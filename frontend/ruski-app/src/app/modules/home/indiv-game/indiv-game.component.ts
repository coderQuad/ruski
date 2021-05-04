import { FeedService } from './../services/feed.service';
import { CurrentUserService } from './../services/current-user.service';
import { Game } from './../game-feed-template';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-indiv-game',
    templateUrl: './indiv-game.component.html',
    styleUrls: ['./indiv-game.component.scss'],
})
export class IndivGameComponent implements OnInit {
    @Input() game!: Game;
    @Input() userID!: string;
    winning_score: number;
    losing_score: number;
    alreadyLiked = false;

    constructor(
        private router: Router,
        private hundy: CurrentUserService,
        private feedFetcher: FeedService
    ) {}

    ngOnInit(): void {
        this.winning_score = 10;
        this.losing_score = this.game.l1Cups + this.game.l2Cups;
        if (this.losing_score > 9) {
            this.losing_score = this.getRandomInt(5, 9);
        }
        this.game.description =
            'Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks.';
        this.feedFetcher.getGameLikes(this.game.id).subscribe((response) => {
            if (response.includes(this.userID)) {
                console.log('yessir');
                this.alreadyLiked = true;
                console.log(this.game.id);
            } else {
                console.log('nosir');
                this.alreadyLiked = false;
            }
        });
        // console.log(this.userID);
    }

    getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    navToGame(e: any) {
        const srcClasses = e.srcElement.className.split(' ');
        if (srcClasses.includes('likeClick')) {
            console.log('yo');
        } else {
            this.router.navigate(['/main/feed', this.game.id]);
        }
        // this.router.navigate(['/main/feed', this.game.id]);
    }

    changeLikeCount(e: any) {
        // console.log('here');
        // console.log(e.srcElement.className);
        if (this.alreadyLiked) {
            this.feedFetcher.decLike(this.game.id, this.userID);
            this.game.likes -= 1;
            this.alreadyLiked = false;
        } else {
            this.feedFetcher.incLike(this.game.id, this.userID);
            this.game.likes += 1;
            this.alreadyLiked = true;
        }
    }
}
