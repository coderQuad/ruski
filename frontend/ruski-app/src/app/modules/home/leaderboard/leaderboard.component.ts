import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { FetchLeaderboardService } from './../services/fetch-leaderboard.service';
@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.scss'],
})

export class LeaderboardComponent implements OnInit {

    // leaderboard basic data body
    users? = [];

    // paginator params
    length: number;
    pageSize: number = 25;
    pageSizeOptions: number[] = [5, 10, 25, 100];

    // paginator output
    pageEvent: PageEvent;

    constructor(private leaderboardFetcher: FetchLeaderboardService) {}

    getLeaderboard(): void {
        this.leaderboardFetcher.fetchLeaders()
        .subscribe(response => {
            this.users = response;
            this.length = this.users.length;
            // console.log(this.users);
            //TODO: matdatasource stuff
        });
    }


    ngOnInit(): void {
        this.getLeaderboard();
    }
}
export interface leaderboardRow {
    id: string;
    name: string;
    elo: number;
}
