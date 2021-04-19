import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { filter, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class RegisterService {
    constructor(private apollo: Apollo) {}

    fetchUnregUsers() {
        console.log('here');
        return this.apollo
            .watchQuery<any>({
                query: gql`
                    {
                        users {
                            id
                            name
                            handle
                        }
                    }
                `,
            })
            .valueChanges.pipe(
                map((user) => {
                    return user.data.users.filter(
                        (user: any) => user.handle.length === 0
                    );
                })
            );
    }

    fetchAllHandles() {
        return this.apollo
            .watchQuery<any>({
                query: gql`
                    {
                        users {
                            handle
                        }
                    }
                `,
            })
            .valueChanges.pipe(
                map((user) => {
                    return user.data.users.filter(
                        (user: any) => user.handle.length > 0
                    );
                })
            );
    }

    submitHandle(id: string, handle: string) {
        console.log(id, handle);
        const ADD_HANDLE = gql`
            mutation AddHandle($user_id: ID!, $handle: String!) {
                modifyHandle(user_id: $user_id, handle: $handle) {
                    id
                }
            }
        `;
        console.log('here');
        this.apollo
            .mutate({
                mutation: ADD_HANDLE,
                variables: {
                    user_id: id,
                    handle: handle,
                },
            })
            .subscribe((response) => {
                console.log(response);
            });
    }
}
