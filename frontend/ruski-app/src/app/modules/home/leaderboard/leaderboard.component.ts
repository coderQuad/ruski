import { FetchLeaderboardService } from './../services/fetch-leaderboard.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
    constructor(leaderboardFetcher: FetchLeaderboardService) {}

    ngOnInit(): void {}
}
