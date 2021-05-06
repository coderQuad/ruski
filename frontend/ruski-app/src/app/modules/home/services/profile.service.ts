import { Injectable, Type } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private apollo: Apollo, private http: HttpClient) {}

    getUserByHandle(handle: string) {
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
        return this.apollo
            .query<any>({
                query: GET_USER,
                fetchPolicy: 'no-cache',
            })
            .pipe(
                map((response) => {
                    if (!response.data.userByHandle.length) {
                        return {
                            profile_url:
                                'https://d26n5v24zcmg6e.cloudfront.net/profiles/default.jpeg',
                            name: 'YourName',
                            elo: 1200,
                            handle: 'yourhandle',
                            id: 'abcdefghijklmnop',
                        };
                    } else {
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

        return this.apollo
            .query<any>({
                query: FIND_FRIEND_HANDLES,
            })
            .pipe(
                map((response) => {
                    if (!response.data.userByHandle.length) {
                        return false;
                    } else {
                        let friends_list =
                            response.data.userByHandle[0].friends;
                        return friends_list.includes(prospectiveId);
                    }
                })
            );
    }

    updateHandle(id: string, newHandle: string) {
        const UPDATE_HANDLE = gql`
            mutation ModifyHandle($id: ID!, $handle: String!) {
                modifyHandle(id: $id, handle: $handle) {
                    id
                }
            }
        `;
        return this.apollo.mutate({
            mutation: UPDATE_HANDLE,
            variables: {
                id: id,
                handle: newHandle,
            },
        });
    }

    updateName(id: string, newName: string) {
        const UPDATE_NAME = gql`
            mutation ModifyName($id: ID!, $name: String!) {
                modifyName(id: $id, name: $name) {
                    id
                }
            }
        `;
        return this.apollo.mutate({
            mutation: UPDATE_NAME,
            variables: {
                id: id,
                name: newName,
            },
        });
    }

    updatePic(id: string, picture: string) {
        const typeRegex = /data\:image\/(png|jpeg)/;
        const type = typeRegex.exec(picture)[1];
        return this.http
            .get(`http://localhost:4000/get_presigned_url_${type}/${id}`)
            .pipe(
                switchMap((response: any) => {
                    console.log(response);
                    // const data = response.json();
                    const signedUrl = response.presigned_url;
                    console.log(signedUrl);
                    return this.http
                        .request('POST', signedUrl, {
                            headers: {
                                'Content-Type': `image/${type}`,
                                mode: 'cors',
                            },
                            body: picture,
                        })
                        .pipe(
                            map((response) => {
                                console.log(response);
                                return response;
                            })
                        );
                })
            );
    }

    // signedUrl,
    // picture,
    // {
    //   headers: {
    //     'Content-Type': `image/${type}`,
    //   }
    // },
}
