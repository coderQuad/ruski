import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Apollo, gql } from 'apollo-angular';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import Observable from 'zen-observable';

@Injectable({
    providedIn: 'root',
})
export class FetchLeaderboardService {
    // output
    response = [];

    // query to get users id and elo
    GET_LEADERS = gql`
        query GetLeaders {
            users {
                id
                name
                handle
                profile_url
                elo
            }
        }
    `;

    constructor(private apollo: Apollo, private auth: AuthService) {}

    // query all users and sort by elo
    fetchLeaders() {
        return this.apollo
            .query<any>({
                query: this.GET_LEADERS,
            })
            .pipe(
                map((response) =>
                    [...response.data.users].sort((a, b) => b.elo - a.elo)
                ),
                catchError(this.handleError([]))
            );
    }

    fetchSticky() {
        return this.auth.user$.pipe(
            map((response) => {
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
                    })
                    .pipe(map((response) => response));
            })
        );
    }

    handleError<T>(result: T) {
        return (err) => {
            console.error(err);
            return of(result as T);
        };
    }
}
