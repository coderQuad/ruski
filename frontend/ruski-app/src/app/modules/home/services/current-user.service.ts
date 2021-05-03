import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

import { Apollo, gql } from 'apollo-angular';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  constructor(private auth: AuthService, private apollo: Apollo) { }

  fetchUser(){
    return this.auth.user$.pipe(
      switchMap(response => {
        // query to get logged in user 
        const GET_USER = gql`
          query GetUser {
            userByEmail(email: "${response.email}") {
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
            if(!response.data.userByEmail.length){
              return {
                'data': {
                  'userByEmail': [
                    {
                      'profile_url': 'https://d26n5v24zcmg6e.cloudfront.net/profiles/default.jpeg',
                      'name': 'YourName',
                      'elo': 1200,
                      'handle': 'yourhandle',
                      'id': 'abcdefghijklmnop',
                    }
                  ]
                }
              }
            }
            else{
              return response;
            }
          })
        );
      })
    );
  }

  getHandle(){
    return this.auth.user$.pipe(
      switchMap(response => {
        // query to get logged in user 
        const GET_USER = gql`
          query GetUser {
            userByEmail(email: "${response.email}") {
              handle
            }
          }
        `;
        return this.apollo.query<any>({
          query: GET_USER
        }).pipe(
          map(response => {
            if(!response.data.userByEmail.length){
              return {
                      'handle': 'yourhandle',
              }
            }
            else{
              return response.data.userByEmail[0].handle;
            }
          })
        );
      })
    );
  }
}
