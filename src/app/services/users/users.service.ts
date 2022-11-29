import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Observable, map, timer, switchMap } from 'rxjs';
import { IFriendsList, IParams, IUsers, IFriends } from 'src/app/models/users';
import config from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {
  }

  getQueryParams(params: IParams): string {
    let query: string = '';
    let key: keyof IParams;
    for (key in params) {
      query = query === '' ? `${key}=${params[key]}` : `${query}&${key}=${params[key]}`;
    }
    return query;
  }

  getUrl(method: string, params: any):string {
    params = params || {};
    params['access_token'] = config.KEY;
    params['v'] = config.VERSION;
    return `https://api.vk.com/method/${method}?${this.getQueryParams(params)}`;
  }

  getUsers(q: string | number): Observable<IUsers[]> {
    const params = {
      q,
      fields: 'photo_200_orig'
    }

    return this.http.jsonp<any>(this.getUrl('users.search', params),'callback')
      .pipe(
        map(res => {
          return res.response.items.map((item: any) => {
            return {
              id: item.id,
              name: `${item.first_name} ${item.last_name}`,
              photo: item.photo_200_orig
            }
          })
          
        })
      )
  }

  getFriends(id: number, time: number = 0): Observable<IFriendsList[]> {
    const params = {
      user_id: id,
			fields: 'nickname'
    }
    
    console.log('GetFriendsid', id)

    return timer(time)
      .pipe(
        switchMap( _ => {
          return this.http.jsonp<any>(this.getUrl('friends.get', params), 'callback')
            .pipe(
              map(
                res => {
                  console.log("res", res)
                  return res.response.items.map((item: any) => {
                    return {
                      id: item.id,
                      name: `${item.first_name} ${item.last_name}`
                    }
                  })
                }
              )
            )
        })
      )
  }

  getUserInfo(id: number, time: number = 0): Observable<any[]> {
    const params = {
      user_id: id,
      fields: 'sex,counters,bdate,photo_200_orig'
    }

    return timer(time)
      .pipe(
        switchMap( _ => {
          return this.http.jsonp<any>(this.getUrl('users.get', params), 'callback')
            .pipe(
              map(
                res => {
                  console.log("resInfoUser", res)
                  return res.response
                }
              )
            )
        })
      )
  }

  getWall(id: number) {
    const params = {
      owner_id: id,
      extended: 1
    }

    return this.http.jsonp<any>(this.getUrl('wall.get', params), 'callback').pipe(
      map(
        res => res.response
      )
    )
  }

  getDataUsers(data: any): IFriends {
    return  {
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        photo: data.photo_200_orig,
        male: data.sex === 2 ? 'мужский' : data.sex === 1 ? 'женский' : 'не указан',
        age: data.bdate !== undefined ? this.getAge(data.bdate) : 'не указан',
        counters: {
            photos: data.counters !== undefined ? data.counters.photos || 0 : 0,
            friends: data.counters !== undefined ? data.counters.friends || 0 : 0
        },
        isBanned: data.deactivated !== undefined && data.deactivated === 'banned' ? true : false,
        isDeleted: data.deactivated !== undefined && data.deactivated === 'deleted' ? true : false
    }
  }

  getAge(date: string): number | string {
      const dates: any[] = date.split('.');

      if (dates.length === 2) {
          return 'Не указан';
      }

      const dateBirthday = new Date(dates[2], parseInt(dates[1]) - 1, dates[0]);
      let today = new Date();
      today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const dbToday = new Date(today.getFullYear(), dateBirthday.getMonth(), dateBirthday.getDate());
      let age: number = today.getFullYear() - dateBirthday.getFullYear();
      if (today < dbToday) {
          age--;
      }
      return age;
  }


}
