import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

import { Apollo, gql } from 'apollo-angular';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  constructor(private auth: AuthService, private apollo: Apollo) { }

  fetchUser(){
    return this.auth.user$.pipe(
      map(response => {
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
          map(response => response)
        );
      })
    );
  }
}
