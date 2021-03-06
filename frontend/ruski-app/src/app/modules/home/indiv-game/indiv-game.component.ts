import { FeedService } from './../services/feed.service';
import { CurrentUserService } from './../services/current-user.service';
import { Game } from './../game-feed-template';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TimeService } from '../services/time.service';
import { Time } from '@angular/common';

@Component({
    selector: 'app-indiv-game',
    templateUrl: './indiv-game.component.html',
    styleUrls: ['./indiv-game.component.scss'],
})
export class IndivGameComponent implements OnInit, OnChanges {
    @Input() game!: Game;
    @Input() userID!: string;
    winning_score: number;
    losing_score: number;
    alreadyLiked = false;
    myTime: any;

    constructor(
        private router: Router,
        private hundy: CurrentUserService,
        private feedFetcher: FeedService,
        private timeConverter: TimeService
    ) {}

    ngOnInit(): void {
        this.winning_score = 10;
        console.log(this.game.likes);
        this.losing_score = this.game.l1Cups + this.game.l2Cups;
        this.myTime = this.timeConverter.convertTime(this.game.createdAt);
        if (this.losing_score > 9) {
            this.losing_score = this.getRandomInt(5, 9);
        }
        // this.game.description =
        //     'Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks.';
        this.feedFetcher.getGameLikes(this.game.id).subscribe((response) => {
            if (response.includes(this.userID)) {
                this.alreadyLiked = true;
                // console.log(this.game.id);
            } else {
                // console.log('nosir');
                this.alreadyLiked = false;
            }
            if (this.alreadyLiked) {
                // console.log(this.game.id);
            }
        });
        // console.log(this.userID);
    }

    ngOnChanges() {
        // this.feedFetcher.getGameLikes(this.game.id).subscribe((response) => {
        //     if (response.includes(this.userID)) {
        //         // console.log('yessir');
        //         this.alreadyLiked = true;
        //         // console.log(this.game.id);
        //         // console.log(this.game.likes);
        //     } else {
        //         // console.log('nosir');
        //         this.alreadyLiked = false;
        //     }
        //     if (this.alreadyLiked) {
        //         // console.log(this.game.id);
        //     }
        // });
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
            if (this.game.likes < 0) {
                // console.log(this.game.id);
            }
            this.alreadyLiked = false;
        } else {
            this.feedFetcher.incLike(this.game.id, this.userID);
            this.game.likes += 1;
            this.alreadyLiked = true;
        }
    }

    goToUserProfile(handle: string) {
        this.router.navigate([`/main/user/${handle}`]);
    }
}
