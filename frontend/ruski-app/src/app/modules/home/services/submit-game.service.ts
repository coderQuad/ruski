import { Game } from './../game-template';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { forkJoin, from } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SubmitGameService {
    constructor(private apollo: Apollo) {}
    getElo(id:string){
        const GET_ELO = gql`
          query GetUser {
            user(id: "${id}") {
              elo
            }
          }
        `;
        return this.apollo.query<any>({
          query: GET_ELO
        }).pipe( tap(response => console.log(response))
          );
    }
    updateElo(id: string, elo: number) {
        const UPDATE_ELO = gql`
            mutation ModifyElo($id: ID!, $elo: Int!) {
                modifyElo(id: $id, elo: $elo) {
                    id
                }
            }
        `;
        console.log(elo);
        console.log(id)
        this.apollo.mutate<any>({
            mutation: UPDATE_ELO,
            variables: {
                id: id,
                elo: elo,
            },
        }).subscribe(response => console.log(response));
    }
    submitGame(game: Game) {
        const ADD_PLAYER = gql`
            mutation AddPlayer($user_id: ID!, $cups: Int!, $penalties: Int!) {
                addPlayer(
                    user_id: $user_id
                    cups: $cups
                    penalties: $penalties
                ) {
                    id
                }
            }
        `;
        const ADD_GAME = gql`
            mutation AddGame(
                $losing_team_player_ids: [ID]!
                $winning_team_player_ids: [ID]!
                $description: String!
            ) {
                addGame(
                    losing_team_player_ids: $losing_team_player_ids
                    winning_team_player_ids: $winning_team_player_ids
                    description: $description
                ) {
                    id
                }
            }
        `;
        const players = [
            [game.myName, game.myCups, game.myPenalties],
            [game.partnerName, game.partnerCups, game.partnerPenalties],
            [game.oneName, game.oneCups, game.onePenalties],
            [game.twoName, game.twoCups, game.twoPenalties],
        ];

        forkJoin([
            from(
                this.apollo.mutate<any>({
                    mutation: ADD_PLAYER,
                    variables: {
                        user_id: players[0][0],
                        cups: players[0][1],
                        penalties: players[0][2],
                    },
                })
            ).toPromise(),
            from(
                this.apollo.mutate<any>({
                    mutation: ADD_PLAYER,
                    variables: {
                        user_id: players[1][0],
                        cups: players[1][1],
                        penalties: players[1][2],
                    },
                })
            ).toPromise(),
            from(
                this.apollo.mutate<any>({
                    mutation: ADD_PLAYER,
                    variables: {
                        user_id: players[2][0],
                        cups: players[2][1],
                        penalties: players[2][2],
                    },
                })
            ).toPromise(),
            from(
                this.apollo.mutate<any>({
                    mutation: ADD_PLAYER,
                    variables: {
                        user_id: players[3][0],
                        cups: players[3][1],
                        penalties: players[3][2],
                    },
                })
            ).toPromise(),
        ])
            .pipe(
                switchMap((response: any) => {
                    let playerArray: string[] = [
                        response[0].data.addPlayer.id,
                        response[1].data.addPlayer.id,
                        response[2].data.addPlayer.id,
                        response[3].data.addPlayer.id,
                    ];
                    let losing_ids: string[] = [];
                    let winning_ids: string[] = [];
                    if (game.winner === 1) {
                        winning_ids.push(playerArray[0]);
                        winning_ids.push(playerArray[1]);
                        losing_ids.push(playerArray[2]);
                        losing_ids.push(playerArray[3]);
                    } else {
                        losing_ids.push(playerArray[0]);
                        losing_ids.push(playerArray[1]);
                        winning_ids.push(playerArray[2]);
                        winning_ids.push(playerArray[3]);
                    }
                    console.log(losing_ids);
                    console.log(winning_ids);
                    console.log(game.description);
                    return this.apollo.mutate({
                        mutation: ADD_GAME,
                        variables: {
                            losing_team_player_ids: losing_ids,
                            winning_team_player_ids: winning_ids,
                            description: game.description,
                        },
                    });
                })
            )
            .subscribe((response) => {
                // console.log(response);
            });
    }

    fetchUsers() {
        const userMap: Map<string, string> = new Map();
        return this.apollo.watchQuery<any>({
            query: gql`
                {
                    users {
                        id
                        name
                    }
                }
            `,
        });
    }
}
