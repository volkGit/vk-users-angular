import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Route, Router, RouterState } from "@angular/router";
import { IInfo, IMessage } from "src/app/models/user";
import { IFriends, IUsers } from "src/app/models/users";
import { StoreService } from "src/app/services/store/store.service";
import { UsersService } from "src/app/services/users/users.service";

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html'
})

export class UserComponent implements OnInit {
    users: IUsers[]
    friends: IUsers[]
    userId: number
    items: any
    user: IFriends

    constructor(
        public storeService: StoreService,
        public userService: UsersService,
        private route: ActivatedRoute) {
    }

    getUserInfo() {
        this.userService.getUserInfo(this.userId).subscribe(data => {
            this.user = this.userService.getDataUsers(data[0])
        })
    }

    getFriendsApp(): void {
        const users: IUsers[] = [];

        this.userService.getFriends(this.userId).subscribe(data => {
            const friends = data.map(v => v.id);
            for (let val of this.users) {
                if (friends.includes(val.id)) {
                    users.push({
                        ...val,
                        name: val.name.split(' ')[0]
                    });
                }
                
            }
            this.friends = users;
        });
    }

    getMessages(): void {
        this.userService.getWall(this.userId).subscribe(data => {
            const items = data.items.map((v: any) => {
                return this.getPost(v, data.profiles, data.groups)
            })
            this.items = items
        })
    }

    getPost(data: any, profiles: [], groups: []): IMessage {
        let files = [];
        let copyInfo: IInfo = {};
        let value: any;
        let item: any;
        let date: number;
        const profile: any = profiles.filter((v: any) => v.id === data.from_id)[0];
        if (data.copy_history !== undefined) {
            value = data.copy_history[0];
            if (value.from_id < 0) {
                item = groups.filter((g: any) => g.id === Math.abs(value.from_id))[0];
                date = value.date * 1000;
            } else {
                item = profiles.filter((v: any) => v.id === value.from_id)[0];
                date = this.getDateForProfile(value) * 1000;
            }
            
            copyInfo = {
                name: item.name !== undefined ? item.name : `${item.first_name} ${item.last_name}`,
                photo: item.photo_100,
                date
            };
        } else {
            value = data;
        }

        if (value.attachments !== undefined) {
            for (let file of value.attachments) {
                files.push(this.getFile(file))
            }
        }
        return {
            copyInfo: {
                ...copyInfo
            }, 
            from: {
                name: `${profile.first_name} ${profile.last_name}`,
                photo: profile.photo_100,
                date: data.date * 1000
            },
            text: value.text,
            files: files.filter((v: any) => v.type !== 'link'),
            linkFiles: files.filter((v: any) => v.type === 'link') 
        }
    }

    getDateForProfile(value: any) {
        if (value.attachments === undefined) {
            return value.date
        }
        
        for (let item of value.attachments) {
            for (let val in item) {
                if (item[val].date) {
                    return item[val].date;
                }
                
            }
        }
    }

    getFile(file: any) {
        switch(file.type) {
            case 'photo':
                return this.getPhotoPost(file.photo);
            case 'link':
                return this.getLinkPost(file.link);
            case 'doc':
                return this.getDocPost(file.doc);    
            default:
                return {};    
        }
    }

    getPhotoPost(value: any) {
        return {
            url: value.sizes.filter((s: any) => s.type === 'y').length 
                ? value.sizes.filter((s: any) => s.type === 'y')[0].url
                : value.sizes.filter((s: any) => s.type === 'p').length ? value.sizes.filter((s: any) => s.type === 'p')[0].url
                : value.sizes[0].url,
            type: 'photo'
        }
    }

    getLinkPost(value: any) {
        return {
            title: value.title === '' ? value.url : value.title,
            url: value.url,
            description: value.description,
            photo: value.photo !== undefined ? this.getPhotoPost(value.photo) : '',
            type: 'link'
        }
    }

    getDocPost(value: any) {
        return {
            url: value.url,
            type: 'doc'
        }
    }

    ngOnInit(): void {
        this.users = this.storeService.getUsers()
        this.userId = Number(this.route.snapshot.paramMap.get('id'))
        this.getFriendsApp()
        this.getMessages()
        this.getUserInfo()
    }
}