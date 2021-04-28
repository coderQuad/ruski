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

    // paginator params
    length: number;
    pageSize: number = 15;
    pageSizeOptions: number[] = [5, 10, 15, 25];

    // paginator output
    pageEvent: PageEvent;

    // columns
    columnsToDisplay = ["rank", "name", "elo"];

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

    ngOnInit(): void {
        this.getLeaderboard();
    }
}

// class for data source
export interface leaderboardRow {
    rank: number,
    profile: string,
    name: string,
    elo: number
}
