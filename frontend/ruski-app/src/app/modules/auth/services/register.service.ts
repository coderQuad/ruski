import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Apollo, gql } from 'apollo-angular';
import { of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class RegisterService {
    constructor(private apollo: Apollo, public auth: AuthService) {}

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
            mutation ModifyHandle($id: ID!, $handle: String!) {
                modifyHandle(id: $id, handle: $handle) {
                    id
                }
            }
        `;
        console.log('here');
        this.apollo
            .mutate({
                mutation: ADD_HANDLE,
                variables: {
                    id: id,
                    handle: handle,
                },
            })
            .subscribe((response) => {
                console.log(response);
            });
    }

    submitEmail(id: string) {
        console.log('here');
        const ADD_EMAIL = gql`
            mutation ModifyEmail($id: ID!, $email: String!) {
                modifyEmail(id: $id, email: $email) {
                    id
                }
            }
        `;
        this.auth.user$
            .pipe(
                switchMap((response: any) => {
                    const email = response.email;
                    console.log(email);

                    return this.apollo.mutate({
                        mutation: ADD_EMAIL,
                        variables: {
                            id: id,
                            email: email,
                        },
                    });
                })
            )
            .subscribe((response) => {
                console.log(response);
            });
    }

    genUser(name: string) {
        console.log(name);
        const ADD_USER = gql`
            mutation AddUser(
                $email: String!
                $handle: String!
                $name: String!
                $elo: Int!
            ) {
                addUser(
                    email: $email
                    handle: $handle
                    name: $name
                    elo: $elo
                ) {
                    id
                }
            }
        `;
        return this.apollo
            .mutate<any>({
                mutation: ADD_USER,
                variables: {
                    email: '',
                    handle: '',
                    name: 'Billy',
                    elo: 1200,
                },
            })
            .pipe(
                map((response) => {
                    return response.data.addUser.id;
                })
            );
    }
}
