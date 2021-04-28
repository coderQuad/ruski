import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import Observable from 'zen-observable';

@Injectable({
  providedIn: 'root'
})


export class FetchLeaderboardService {

  // output
  response = [];

  // query to get users id and elo
  GET_LEADERS = gql`
    query GetLeaders {
      users { 
        id
        name
        elo
      }
    } 
  `;

  constructor(private apollo: Apollo) { }

  // query all users and sort by elo
  fetchLeaders() {
    return this.apollo.query<any>({
      query: this.GET_LEADERS
    }).pipe(
      map(response => [...response.data.users].sort((a,b) => b.elo - a.elo)),
      catchError(this.handleError())
    );
  }

  handleError(){
    return (err) => {
      console.error(err);
      return of([]);
    }

  }
}
