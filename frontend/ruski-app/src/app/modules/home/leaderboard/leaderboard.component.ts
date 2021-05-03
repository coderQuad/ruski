import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { FetchLeaderboardService } from './../services/fetch-leaderboard.service';
import { CurrentUserService } from './../services/current-user.service';
@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.scss'],
})

export class LeaderboardComponent implements OnInit {

    // leaderboard data body
    users? = [];

    // current user false header info
    loggedInUser = [
        24,
        'https://d26n5v24zcmg6e.cloudfront.net/profiles/default.jpeg',
        'Steemer',
        1230,
        'stanleysteemer'
    ];

    // paginator params
    length: number;
    pageSize: number = 15;
    pageSizeOptions: number[] = [5, 10, 15, 25];

    // paginator output
    pageEvent: PageEvent;

    // columns
    columnsToDisplay = ["rank", "user", "elo"];

    // false header
    columnsToScheme = ["falseRank", "falseName", "falseElo"];
    userRank: number;
    userPro: string;
    userName: string;
    userElo: number;
    userHandle: string;
    loaded= false;

    // interact w paginator
    dataSource: MatTableDataSource<leaderboardRow>;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private leaderboardFetcher: FetchLeaderboardService, private user: CurrentUserService) {}

    getLeaderboard(): void {
        this.leaderboardFetcher.fetchLeaders()
        .subscribe(response => {
            this.length = response.length;
            this.users = response.map( (user, index) => ({
                ...user, 
                profile: user.profile_url,
                rank: index
            }));
            this.dataSource = new MatTableDataSource<leaderboardRow>(this.users);
            this.dataSource.paginator = this.paginator;
        });
    }

    fillUser(): void {
        this.user.fetchUser()
        .subscribe(response => {
            const user = response.data.userByEmail[0];
            this.userPro= user.profile_url;
            this.userName= user.name;
            this.userElo= user.elo;
            this.userHandle= user.handle;
            this.userRank = this.getRank(user.id);
        });
        this.loaded= true;
    }

    getRank(id: string): number {
        for(let user of this.users){
            if(user.id === id){
                return user.rank;
            }
        }
        return 0;
    }

    ngOnInit(): void {
        this.getLeaderboard();
        this.fillUser();
    }
}

// class for data source
export interface leaderboardRow {
    rank: number,
    profile: string,
    name: string,
    elo: number,
    handle: string
}
