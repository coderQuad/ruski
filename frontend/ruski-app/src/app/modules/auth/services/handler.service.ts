import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Apollo, gql } from 'apollo-angular';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class HandlerService {
    isRegistered = false;

    constructor(private apollo: Apollo, public auth: AuthService) {}

    changeRegistered() {
        // console.log('here');
        this.isRegistered = true;
    }

    getStatus() {
        // console.log(this.isRegistered);
        return this.isRegistered;
    }

    checkUserExistsByEmail() {
        console.log();
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
                    })
                    .pipe(map((response) => response.data.userByEmail));
            })
        );
    }
}
