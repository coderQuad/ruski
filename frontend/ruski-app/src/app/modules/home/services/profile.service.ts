import { Injectable, Type } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { combineLatest, of } from 'rxjs';
import { catchError, map, tap, switchMap, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private apollo: Apollo, private http:HttpClient) { }

  getUserByHandle(handle:string) {
    // query to get logged in user 
    const GET_USER = gql`
      query GetUser($handle: String!) {
        userByHandle(handle: $handle) {
          id
          name
          handle
          profile_url
          elo
        }
      }
    `;
    return this.apollo.query<any>({
      query: GET_USER,
      variables: {
        handle: handle
      }
    }).pipe(
      map(response => {
        if(!response.data.userByHandle.length){
          return {
            'profile_url': 'https://d26n5v24zcmg6e.cloudfront.net/profiles/default.jpeg',
            'name': 'YourName',
            'elo': 1200,
            'handle': 'yourhandle',
            'id': 'abcdefghijklmnop',
          }
        }
        else{
          return response.data.userByHandle[0];
        }
      })
    );
  }

  getUserStats(userId: string) {
    const GET_USER_PLAYERS = gql`
      query GetUserPlayers {
        playerWithUserId(id: "${userId}"){
          id
          cups
          penalties
        }
      }
    `;
    return this.apollo.query<any>({
      query: GET_USER_PLAYERS,
    }).pipe(
      switchMap((response:any) => {
        return this.parsePlayers(response.data.playerWithUserId)
      })
    );
  }
  parsePlayers(data: any){
    const stats = {
      wins: 0,
      losses: 0,
      yaks: 0,
      averageCups: 0,
      percentage: '.000'
    }

    let cups = 0;
    let playerIds = [];
    
    if(!data){
      return of(stats);
    }

    for(let player of data){
      stats.yaks += player.penalties;
      cups += player.cups;
      playerIds.push(player.id);
    }    

    let observables = [];
    for(let playerId of playerIds){
      observables.push(this.findGames(playerId));
    }
    return combineLatest(observables).pipe(
      map((response:any) => {
        for(let [index, game] of response.entries()){
          if(game){
            for(let player of game.winning_team){
              if(player.id == playerIds[index]){
                stats.wins += 1
              }
            }
            for(let player of game.losing_team){
              if(player.id == playerIds[index]){
                stats.losses += 1
              }
            }
          }
        }
        stats.averageCups = cups / (stats.wins + stats.losses);
        stats.percentage = (stats.wins/(stats.wins + stats.losses)).toFixed(3);
        return stats;
      })
    )
  }

  findGames(playerId: string){
    const FIND_PLAYER_GAMES = gql`
        query GetGames {
          gamesByPlayerId(id: "${playerId}"){
            winning_team{
              id
            }
            losing_team{
              id
            }
          }
        }
      `; 
      return this.apollo.query<any>({
        query: FIND_PLAYER_GAMES,
      }).pipe(
        map((response: any) => {
          return response.data.gamesByPlayerId[0];
        })
      )
  }

  checkFriends(prospectiveId: string, baseHandle: string) {
    const FIND_FRIEND_HANDLES = gql`
      query GetUser($handle: String!) {
        userByHandle(handle: $handle) {
          id
          friends {
            handle
          }
        }
      }
    `;

    return this.apollo.query<any>({
      query: FIND_FRIEND_HANDLES,
      variables: {
        handle: baseHandle
      }
    }).pipe(
      map(response => {
        if(!response.data.userByHandle.length){
          return false;
        }
        else{
          let friends_list = response.data.userByHandle[0].friends;
          return friends_list.includes(prospectiveId)  
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
    return this.apollo
        .mutate({
            mutation: UPDATE_HANDLE,
            variables: {
                id: id,
                handle: newHandle,
            },
        })
  }

  updateName(id: string, newName: string) {
    const UPDATE_NAME = gql`
        mutation ModifyName($id: ID!, $name: String!) {
            modifyName(id: $id, name: $name) {
                id
            }
        }
    `;
    return this.apollo
        .mutate({
            mutation: UPDATE_NAME,
            variables: {
                id: id,
                name: newName,
            },
        })
  }

  // updatePic(id:string, picture: string) {
  //   const typeRegex = /data\:image\/(png|jpeg)/;
  //   const type = typeRegex.exec(picture)[1];
  //   return this.http.get(`http://localhost:4000/get_presigned_url_${type}/${id}`).pipe(
  //     switchMap((response: any) => {
  //       console.log(response);
  //       // const data = response.json();
  //       const signedUrl = response.presigned_url;
  //       console.log(signedUrl); 
  //       const HttpOptions = {
  //         headers: new HttpHeaders({
  //           'Content-Type': `image/${type}`,
  //           'mode': 'cors',
  //         }),
  //         body: picture,
  //       }
  //       fetch(
  //         signedUrl,
  //         {
  //           method: 'PUT',
  //           mode: 'cors',
  //           headers: {
  //             'Content-Type': `image/${type}`,
  //           },
  //           body: picture
  //         }
  //       ).then(response => {
  //         console.log(response.text())
  //       });
  //     })
  //   );
  // }
  postPic(id:string, picture:string){
    const typeRegex = /data\:image\/(png|jpeg)/;
    const type = typeRegex.exec(picture)[1];
    return this.http.get(`http://localhost:4000/get_presigned_url_${type}/${id}`).pipe(
      switchMap(
        async (response: any) => {
          console.log(response);
          const signedUrl = response.presigned_url;
          console.log(signedUrl); 

          const data = picture.replace(/^data:image\/\w+;base64,/, "");
          const buff = Buffer.from(data, 'base64');

          await fetch(
            signedUrl,
            {
              method: 'PUT',
              mode: 'cors',
              headers: {
                'Content-Type': `image/${type}`,
                'Content-Encoding': 'base64'
              },
              body: buff
            }
          ).then(result => result.text())
          .then(result => {
            console.log(result);
          })
          return response.s3_access_url;
        })
    );
  }
  updatePic(id:string, picture: string) {
    this.postPic(id, picture).subscribe(response => {
      const UPDATE_PROFILE = gql`
        mutation ModifyProfileUrl($id: ID!, $profile_url: String!) {
            modifyProfileURL(id: $id, profile_url: $profile_url) {
                id
            }
        }
      `;
      this.apollo
        .mutate({
            mutation: UPDATE_PROFILE,
            variables: {
                id: id,
                profile_url: response,
            },
        }).subscribe();
    });
    return of([]);
  }

}