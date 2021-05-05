import { FeedService } from './../services/feed.service';
import { Component, OnInit } from '@angular/core';
import { Game } from '../game-feed-template';
import { CurrentUserService } from '../services/current-user.service';

@Component({
    selector: 'app-social-feed',
    templateUrl: './social-feed.component.html',
    styleUrls: ['./social-feed.component.scss'],
})
export class SocialFeedComponent implements OnInit {
    games: Game[] = [];
    games2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    userID = '';

    constructor(
        private feedFetcher: FeedService,
        private hundy: CurrentUserService
    ) {}

    ngOnInit(): void {
        this.feedFetcher.fetchAllGames().subscribe((response) => {
            this.games = response;
        });
        this.hundy.getUserID().subscribe((response) => {
            this.userID = response;
        });
    }
}
