import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { FetchLeaderboardService } from './../services/fetch-leaderboard.service';
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
    columnsToDisplay = ["rank", "name", "elo"];

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

    constructor(private leaderboardFetcher: FetchLeaderboardService) {}

    getLeaderboard(): any {
        this.leaderboardFetcher.fetchLeaders()
        .subscribe(response => {
            this.length = response.length;
            this.users = response.map( (user, index) => ({
                ...user, 
                profile: 'https://d26n5v24zcmg6e.cloudfront.net/profiles/default.jpeg',
                rank: index + 1
            }));
            this.dataSource = new MatTableDataSource<leaderboardRow>(this.users);
            this.dataSource.paginator = this.paginator;
        });
    }

    fillUser(): void {
        this.leaderboardFetcher.fetchSticky();
        this.userRank= 24;
        this.userPro= 'https://d26n5v24zcmg6e.cloudfront.net/profiles/default.jpeg';
        this.userName= 'Steemer';
        this.userElo= 1224;
        this.userHandle= 'stanleysteemer';
        this.loaded= true;
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
