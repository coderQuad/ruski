import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class SearchFetcherService {
    constructor(private apollo: Apollo) {}

    fetchAllUsersAndHandles() {
        // console.log('here');
        return this.apollo
            .watchQuery<any>({
                query: gql`
                    {
                        users {
                            id
                            name
                            handle
                            profile_url
                            elo
                        }
                    }
                `,
                fetchPolicy: 'no-cache',
            })
            .valueChanges.pipe(
                map((data) => {
                    return data.data.users;
                })
            );
    }
}
