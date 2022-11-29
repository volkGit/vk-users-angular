import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { IFriends, IFriendsList, IUsers } from "src/app/models/users";
import { UsersService } from "src/app/services/users/users.service";
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { StoreService } from "src/app/services/store/store.service";
import { zip } from "rxjs";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html'
})

export class SearchComponent implements OnInit, OnDestroy {
    filter = ''
    users: IUsers[] = []
    dataUsers: IUsers[] = []
    ids: number[] = []
    show = false
    faMinus = faMinus
    faPlus = faPlus
    isScroll = false
    isLoading = false
    friendsList: IFriendsList[] = []
    friends: IFriends[] = []
    @Output() setLoading = new EventEmitter<boolean>()
    domClickBind: any

    constructor(
        private usersService: UsersService,
        public storeService: StoreService
        ) {
    }

    search() {
        this.usersService.getUsers(this.filter).subscribe(users => {
           this.users = users
           this.show = true
        })
    }

    removeUser(id: number) {
        this.ids = this.ids.filter(v => v !== id);
        const users = this.dataUsers.filter(v => v.id !== id)
        this.storeService.setUsers(users);
    }

    addUser(user: IUsers) {
        this.ids.push(user.id)
        this.dataUsers.push(user)
        this.storeService.setUsers(this.dataUsers)
    }
    
    getFriends() {
        this.show = false
        let requests = []
        let friendsList: IFriendsList[] = []
        let friendsIds: number[] = []


        for (let i = 0; i < this.ids.length; i++) {
            requests.push(this.usersService.getFriends(this.ids[i], 1000 * i))
        }

        let friends$ = zip(...requests);

        friends$.subscribe((result: any) => {
            console.log("rest", result)
            for (let i = 0; i < result.length; i++) {
                for (let j = 0; j < result[i].length; j++) {
                    if (!friendsIds.includes(result[i][j].id) && result[i][j] !== -1) {
                        friendsIds.push(result[i][j].id)
                        friendsList.push(result[i][j])
                    }
                }
            }
            this.friendsList = this.sortArray(friendsList)
            this.storeService.setFriendsAll(this.friendsList)
            console.log("setFriends", this.friendsList)
            this.showFriends()
        });
    }

    showFriends(from: number = 0, count: number = 5) {
        let requests = []
        let friends = from === 0 ? [] : this.friends;
        let users = this.storeService.friendsAll.slice(from, count);
        
        if (users.length === 0) {
            return;
        }

        this.setLoading.emit(true)
        this.isLoading = true
        for (let i = 0; i < users.length; i++) {
            requests.push(this.usersService.getUserInfo(users[i].id, 1000 * i));
        }

        let users$ = zip(...requests);

        users$.subscribe((result : any[]) => {
            for (let i = 0; i < result.length; i++) {
                const idx = friends.findIndex(v => v.id === result[i][0].id)

                if (idx === -1) {
                    friends.push(this.usersService.getDataUsers(result[i][0]))
                }
            }
            this.storeService.setFriends(friends)
            this.friends = friends
            this.setLoading.emit(false)
            this.isLoading = false
        })
    }

    sortArray(array: any[]) {
        return array.sort(function(a, b) {
            a = a.name.toLowerCase();
            b = b.name.toLowerCase();
            if (a < b)
                return -1;
            if (a > b)
                return 1;
            return 0;
        });
    }

    domClick(e: any) {
        this.show = false
    }

    scroll() {
        window.onscroll = () => {
            let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
            
            if (bottomOfWindow && !this.isLoading && !this.isScroll) {
                let length = this.friends.length;
                this.isScroll = true;
                this.showFriends(length, length + 5);
                setTimeout(() => {
                    this.isScroll = false;
                }, 0);
            }
        }
    }

    ngOnInit(): void {
        this.storeService.users$.subscribe(users => {
            let idx
            this.dataUsers = users

            for(let i = 0; i < this.ids.length; i++) {
                idx = users.findIndex(v => v.id === this.ids[i])
                if (idx === -1) {
                    this.ids.splice(i, 1)
                }
            }
        })

        const users = this.storeService.getUsers()

        for(let i = 0; i < users.length; i++) {
            this.ids.push(users[i].id)
        }

        this.domClickBind = this.domClick.bind(this)
        document.addEventListener('click', this.domClickBind)
        this.scroll()
    }

    ngOnDestroy(): void {
        document.removeEventListener('click', this.domClickBind)
    }
}