export interface IUsers {
    id: number,
    name: string,
    photo: string
}

export interface IParams {
    ['access_token']: string,
    v: string,
    q?: string | number,
    fields?: string
}

export interface IFriendsList {
    id: number,
    name: string
}

export interface IFriends {
    id: number,
    name: string,
    photo: string,
    male: string,
    age: number | string,
    counters: {
        photos: number,
        friends: number
    },
    isBanned: boolean,
    isDeleted: boolean
}