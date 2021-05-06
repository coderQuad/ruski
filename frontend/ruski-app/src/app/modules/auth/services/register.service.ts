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
        // console.log('here');
        return this.apollo
            .watchQuery<any>({
                query: gql`
                    {
                        users {
                            id
                            name
                            email
                        }
                    }
                `,
            })
            .valueChanges.pipe(
                map((user) => {
                    return user.data.users.filter((user: any) => {
                        return (
                            !user.hasOwnProperty('email') ||
                            user.email.length === 0
                        );
                    });
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
                    return user.data.users.filter((user: any) => true);
                })
            );
        // .valueChanges.pipe(
        //     map((user) => {
        //         return user.data.users.filter(
        //             (user: any) => user.email.length > 0
        //         );
        //     })
        // );
    }

    submitHandle(id: string, handle: string) {
        // console.log(id, handle);
        const ADD_HANDLE = gql`
            mutation ModifyHandle($id: ID!, $handle: String!) {
                modifyHandle(id: $id, handle: $handle) {
                    id
                    handle
                    name
                }
            }
        `;
        // console.log('here');
        this.apollo
            .mutate({
                mutation: ADD_HANDLE,
                variables: {
                    id: id,
                    handle: handle,
                },
            })
            .subscribe((response) => {
                // console.log(response);
            });
    }

    submitEmail(id: string) {
        // console.log('here');
        // console.log(id);
        const ADD_EMAIL = gql`
            mutation ModifyEmail($id: ID!, $email: String!) {
                modifyEmail(id: $id, email: $email) {
                    id
                    email
                    handle
                }
            }
        `;
        return this.auth.user$.pipe(
            switchMap((response: any) => {
                const email = response.email;
                // console.log(email);

                return this.apollo.mutate({
                    mutation: ADD_EMAIL,
                    variables: {
                        id: id,
                        email: email,
                    },
                });
            })
        );
    }

    genUser(name: string) {
        // console.log(name);
        const ADD_USER = gql`
            mutation AddUser(
                $email: String!
                $handle: String!
                $name: String!
                $elo: Int!
                $profile_url: String!
            ) {
                addUser(
                    email: $email
                    handle: $handle
                    name: $name
                    elo: $elo
                    profile_url: $profile_url
                ) {
                    id
                }
            }
        `;
        return this.auth.user$.pipe(
            switchMap((response: any) => {
                // console.log(response);
                let profile_pic =
                    'https://d26n5v24zcmg6e.cloudfront.net/profiles/default.jpeg';
                if (response.hasOwnProperty('picture')) {
                    profile_pic = response.picture;
                }
                return this.apollo
                    .mutate<any>({
                        mutation: ADD_USER,
                        variables: {
                            email: '',
                            handle: '',
                            profile_url: profile_pic,
                            name: 'Billy',
                            elo: 1200,
                        },
                    })
                    .pipe(
                        map((response) => {
                            return response.data.addUser.id;
                        })
                    );
            })
        );
    }
}
