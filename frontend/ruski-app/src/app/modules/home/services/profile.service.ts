import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, map, tap, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private apollo: Apollo) { }

  getUserByHandle(handle:string) {
    // query to get logged in user 
    const GET_USER = gql`
      query GetUser {
        userByHandle(handle: "${handle}") {
          id
          name
          handle
          profile_url
          elo
        }
      }
    `;
    return this.apollo.query<any>({
      query: GET_USER
    }).pipe(
      map(response => {
        if(!response.data.userByHandle.length){
          return {
            'profile_url': 'https://d26n5v24zcmg6e.cloudfront.net/profiles/default.jpeg',
            'name': 'YourName',
            'elo': 1200,
            'handle': 'yourhandle',
            'id': 'abcdefghijklmnop',
          }
        }
        else{
          return response.data.userByHandle[0];
        }
      })
    );
  }

  checkFriends(prospectiveId: string, baseHandle: string) {
    const FIND_FRIEND_HANDLES = gql`
      query GetUser {
        userByHandle(handle: "${baseHandle}") {
          id
          friends {
            handle
          }
        }
      }
    `;

    return this.apollo.query<any>({
      query: FIND_FRIEND_HANDLES
    }).pipe(
      map(response => {
        if(!response.data.userByHandle.length){
          return false;
        }
        else{
          let friends_list = response.data.userByHandle[0].friends;
          return friends_list.includes(prospectiveId)  
        }
      })
    );
  }

}
