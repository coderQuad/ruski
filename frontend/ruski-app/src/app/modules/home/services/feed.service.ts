import { Game } from './../game-feed-template';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FeedService {
    constructor(private apollo: Apollo, public auth: AuthService) {}

    fetchGlobal() {}

    fetchSpecGame(id: string) {
        // console.log('here');
        // console.log(id);
        const GET_GAME = gql`
            query GetGameByID($id: ID!) {
                game(id: $id) {
                    likes
                    createdAt
                    comments {
                        text
                        user {
                            name
                            profile_url
                        }
                        id
                        likes
                    }
                    winning_team {
                        user {
                            name
                            profile_url
                        }
                        cups
                        penalties
                    }
                    losing_team {
                        user {
                            name
                            profile_url
                        }
                        cups
                        penalties
                    }
                    description
                    id
                }
            }
        `;

        return this.apollo
            .query<any>({
                query: GET_GAME,
                variables: {
                    id: id,
                },
                fetchPolicy: 'no-cache',
            })
            .pipe(
                map((response) => {
                    // console.log(response);
                    const gamesList = [];
                    const game = response.data.game;
                    const tempGame = {
                        w1Name: game.winning_team[0].user.name,
                        w1Cups: game.winning_team[0].cups,
                        w1Penalties: game.winning_team[0].penalties,
                        w1Image: game.winning_team[0].user.profile_url,
                        w2Name: game.winning_team[1].user.name,
                        w2Cups: game.winning_team[1].cups,
                        w2Penalties: game.winning_team[1].penalties,
                        w2Image: game.winning_team[1].user.profile_url,
                        l1Name: game.losing_team[0].user.name,
                        l1Cups: game.losing_team[0].cups,
                        l1Penalties: game.losing_team[0].penalties,
                        l1Image: game.losing_team[0].user.profile_url,
                        l2Name: game.losing_team[1].user.name,
                        l2Cups: game.losing_team[1].cups,
                        l2Penalties: game.losing_team[1].penalties,
                        l2Image: game.losing_team[1].user.profile_url,
                        description: game.description,
                        likes: game.likes,
                        createdAt: game.createdAt,
                        id: game.id,
                        comments: game.comments,
                    };
                    return tempGame;
                })
            );
    }

    fetchAllGames() {
        const GET_GAMES = gql`
            query GetGames {
                games {
                    likes
                    createdAt
                    comments {
                        text
                    }
                    winning_team {
                        user {
                            name
                            profile_url
                        }
                        cups
                        penalties
                    }
                    losing_team {
                        user {
                            name
                            profile_url
                        }
                        cups
                        penalties
                    }
                    description
                    id
                }
            }
        `;

        return this.apollo
            .query<any>({
                query: GET_GAMES,
                fetchPolicy: 'no-cache',
            })
            .pipe(
                map((response) => {
                    // console.log(response);
                    const gamesList = [];
                    for (const game of response.data.games) {
                        const tempGame = {
                            w1Name: game.winning_team[0].user.name,
                            w1Cups: game.winning_team[0].cups,
                            w1Penalties: game.winning_team[0].penalties,
                            w1Image: game.winning_team[0].user.profile_url,
                            w2Name: game.winning_team[1].user.name,
                            w2Cups: game.winning_team[1].cups,
                            w2Penalties: game.winning_team[1].penalties,
                            w2Image: game.winning_team[1].user.profile_url,
                            l1Name: game.losing_team[0].user.name,
                            l1Cups: game.losing_team[0].cups,
                            l1Penalties: game.losing_team[0].penalties,
                            l1Image: game.losing_team[0].user.profile_url,
                            l2Name: game.losing_team[1].user.name,
                            l2Cups: game.losing_team[1].cups,
                            l2Penalties: game.losing_team[1].penalties,
                            l2Image: game.losing_team[1].user.profile_url,
                            description: game.description,
                            likes: game.likes,
                            createdAt: game.createdAt,
                            id: game.id,
                            comments: game.comments,
                        };
                        gamesList.push(tempGame);
                    }
                    return gamesList;
                })
            );
    }

    incLike(gameId: string, userId: string) {
        // console.log(gameId, userId);
        const INC_LIKE = gql`
            mutation IncrementGameLike($id: ID!, $liked_by_id: ID!) {
                incrementGameLike(id: $id, liked_by_id: $liked_by_id) {
                    id
                }
            }
        `;

        this.auth.user$
            .pipe(
                switchMap((response: any) => {
                    const email = response.email;

                    return this.apollo.mutate({
                        mutation: INC_LIKE,
                        variables: {
                            id: gameId,
                            liked_by_id: userId,
                        },
                    });
                })
            )
            .subscribe((response) => {
                // console.log(response);
            });
    }

    decLike(gameId: string, userId: string) {
        // console.log(gameId, userId);
        const DEC_LIKE = gql`
            mutation DecrementGameLike($id: ID!, $liked_by_id: ID!) {
                decrementGameLike(id: $id, liked_by_id: $liked_by_id) {
                    id
                }
            }
        `;

        this.auth.user$
            .pipe(
                switchMap((response: any) => {
                    const email = response.email;

                    return this.apollo.mutate({
                        mutation: DEC_LIKE,
                        variables: {
                            id: gameId,
                            liked_by_id: userId,
                        },
                    });
                })
            )
            .subscribe((response) => {
                // console.log(response);
            });
    }

    getGameLikes(id: string) {
        // return of(['Billy', '606d262479a35ad0d582ec9c']);
        // console.log(id);
        const GET_GAME = gql`
            query GetGameLikes($id: ID!) {
                game(id: $id) {
                    liked_by {
                        id
                    }
                    likes
                }
            }
        `;

        return this.apollo
            .query<any>({
                query: GET_GAME,
                variables: {
                    id: id,
                },
                fetchPolicy: 'no-cache',
            })
            .pipe(
                map((response) => {
                    const liked_by = [];
                    // console.log(response.data.game.liked_by);
                    for (const user of response.data.game.liked_by) {
                        liked_by.push(user.id);
                    }
                    return liked_by;
                })
            );
    }

    incCommentLike(commentId: string, userId: string) {
        // console.log(gameId, userId);
        const INC_LIKE = gql`
            mutation IncrementCommentLike($id: ID!, $liked_by_id: ID!) {
                incrementCommentLike(id: $id, liked_by_id: $liked_by_id) {
                    id
                }
            }
        `;

        this.auth.user$
            .pipe(
                switchMap((response: any) => {
                    const email = response.email;

                    return this.apollo.mutate({
                        mutation: INC_LIKE,
                        variables: {
                            id: commentId,
                            liked_by_id: userId,
                        },
                    });
                })
            )
            .subscribe((response) => {
                // console.log(response);
            });
    }

    decCommentLike(commentId: string, userId: string) {
        // console.log(gameId, userId);
        const DEC_LIKE = gql`
            mutation DecrementCommentLike($id: ID!, $liked_by_id: ID!) {
                decrementCommentLike(id: $id, liked_by_id: $liked_by_id) {
                    id
                }
            }
        `;

        this.auth.user$
            .pipe(
                switchMap((response: any) => {
                    const email = response.email;

                    return this.apollo.mutate({
                        mutation: DEC_LIKE,
                        variables: {
                            id: commentId,
                            liked_by_id: userId,
                        },
                    });
                })
            )
            .subscribe((response) => {
                // console.log(response);
            });
    }
}
