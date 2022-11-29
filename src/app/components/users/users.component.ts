import { Component, Input, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IFriends, IUsers } from "src/app/models/users";
import { StoreService } from "src/app/services/store/store.service";
import { NgbdModalContent } from "../modals/modal.component";

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html'
})

export class UsersComponent implements OnInit  {
    tab: number = 0
    users: IUsers[]
    friends: IFriends[] = []
    @Input() isLoading: boolean
    title: string = 'Подтверждение'
    selectedUser: IUsers

    constructor(public storeService: StoreService,
        public modalService: NgbModal){

    }

    ngOnInit(): void {
        this.storeService.users$.subscribe(users => {
            console.log("updateUsers")
            this.users = users
        })

        this.storeService.friends$.subscribe(friends => {
            console.log("Frineds", friends)
            this.friends = friends
        })

        this.users = this.storeService.getUsers()
        this.friends = this.storeService.getFriends()
    }

    showDelete(user: IUsers) {
        this.selectedUser = user
        //this.modalService.open(content)
        const modalRef = this.modalService.open(NgbdModalContent)
        modalRef.componentInstance.title = 'Подтверждение'
        modalRef.componentInstance.text = `Вы уверены, что хотите удалить ${user.name}?`
        modalRef.result.then(
            () => {
                console.log('userDelete', user)
                const users = this.users.filter(v => v.id !== user.id)
                this.storeService.setUsers(users)
			},
			() => {
				
			},
        )
    }


}