import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

import { Apollo, gql } from 'apollo-angular';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CurrentUserService {
    userId = '';

    constructor(private auth: AuthService, private apollo: Apollo) {}

    getUserID() {
        const GET_USER = gql`
            query UserByEmail($email: String!) {
                userByEmail(email: $email) {
                    id
                }
            }
        `;
        return this.auth.user$.pipe(
            switchMap((response: any) => {
                const email = response.email;

                return this.apollo
                    .query<any>({
                        query: GET_USER,
                        variables: {
                            email: email,
                        },
                        fetchPolicy: 'no-cache',
                    })
                    .pipe(
                        map((response) => {
                            return response.data.userByEmail[0].id;
                        })
                    );
            })
        );
    }

    fetchUser() {
        return this.auth.user$.pipe(
            switchMap((response) => {
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
                return this.apollo
                    .query<any>({
                        query: GET_USER,
                        fetchPolicy: 'no-cache',
                    })
                    .pipe(
                        map((response) => {
                            console.log(response);
                            if (!response.data.userByEmail.length) {
                                return {
                                    profile_url:
                                        'https://d26n5v24zcmg6e.cloudfront.net/profiles/default.jpeg',
                                    name: 'YourName',
                                    elo: 1200,
                                    handle: 'yourhandle',
                                    id: 'abcdefghijklmnop',
                                };
                            } else {
                                return response.data.userByEmail[0];
                            }
                        })
                    );
            })
        );
    }

    getHandle() {
        return this.auth.user$.pipe(
            switchMap((response) => {
                // query to get logged in user
                console.log(response.email);
                const GET_USER = gql`
          query GetUser {
            userByEmail(email: "${response.email}") {
              handle
            }
          }
        `;
                return this.apollo
                    .query<any>({
                        query: GET_USER,
                        fetchPolicy: 'no-cache',
                    })
                    .pipe(
                        map((response) => {
                            console.log(response);
                            if (!response.data.userByEmail.length) {
                                return {
                                    handle: 'yourhandle',
                                };
                            } else {
                                return response.data.userByEmail[0].handle;
                            }
                        })
                    );
            })
        );
    }
}
