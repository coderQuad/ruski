import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Apollo, gql } from 'apollo-angular';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

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
        handle
        elo
      }
    } 
  `;

  constructor(private apollo: Apollo, private auth: AuthService) { }

  // query all users and sort by elo
  fetchLeaders() {
    return this.apollo.query<any>({
      query: this.GET_LEADERS
    }).pipe(
      map(response => [...response.data.users].sort((a,b) => b.elo - a.elo)),
      catchError(this.handleError())
    );
  }

  fetchSticky() {
    this.auth.user$.subscribe(
      response => {
        console.log(response.email);
      }
    )
  }

  handleError(){
    return (err) => {
      console.error(err);
      return of([]);
    }

  }
}
