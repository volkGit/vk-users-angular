import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IFriends, IFriendsList, IUsers } from 'src/app/models/users';

@Injectable({
  providedIn: 'root'
})

export class StoreService {
    public users$: Subject<IUsers[]> = new Subject()
    public friendsAll: IFriendsList[] = []
    public friends$: Subject<IFriends[]> = new Subject()
    public users: IUsers[] = []
    public friends: IFriends[] = [] 

    setUsers(value: IUsers[]) {
        this.users = value
        this.users$.next(value)
    }

    setFriendsAll(value: IFriendsList[]) {
        this.friendsAll = value
    }

    setFriends(value: IFriends[]) {
        this.friends = value
        this.friends$.next(value)
    }

    getUsers() {
        return this.users
    }
    
    getFriendsAll() {
        return this.friendsAll
    }

    getFriends() {
        return this.friends
    }
}
