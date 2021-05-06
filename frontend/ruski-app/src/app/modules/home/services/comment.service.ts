import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommentService {
    constructor(private apollo: Apollo) {}

    addComment(userId: string, text: string, game_id: string) {
        const ADD_COMMENT = gql`
            mutation AddComment($text: String!, $user_id: ID!) {
                addComment(text: $text, user_id: $user_id) {
                    id
                }
            }
        `;
        const ADD_COMMENT_TO_GAME = gql`
            mutation AddCommentToGame($id: ID!, $comment_id: ID!) {
                addCommentToGame(id: $id, comment_id: $comment_id) {
                    id
                }
            }
        `;
        // console.log('here');
        return this.apollo
            .mutate({
                mutation: ADD_COMMENT,
                variables: {
                    text: text,
                    user_id: userId,
                },
            })
            .pipe(
                switchMap((response: any) => {
                    // console.log(response.data.addComment.id);
                    return this.apollo.mutate({
                        mutation: ADD_COMMENT_TO_GAME,
                        variables: {
                            id: game_id,
                            comment_id: response.data.addComment.id,
                        },
                    });
                })
            );
    }
}
