import { FeedService } from './../services/feed.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '../services/current-user.service';
import { Game } from '../game-feed-template';

@Component({
    selector: 'app-spec-game',
    templateUrl: './spec-game.component.html',
    styleUrls: ['./spec-game.component.scss'],
})
export class SpecGameComponent implements OnInit {
    game!: Game;
    userID!: string;
    winning_score: number;
    losing_score: number;
    alreadyLiked = false;
    constructor(
        private gameFetcher: FeedService,
        private route: ActivatedRoute,
        private hundy: CurrentUserService
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.gameFetcher.fetchSpecGame(id).subscribe((response) => {
            this.game = response;
            this.winning_score = 10;
            this.losing_score = this.game.l1Cups + this.game.l2Cups;
            if (this.losing_score > 9) {
                this.losing_score = this.getRandomInt(5, 9);
            }
            this.game.description =
                'Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks. Dennis is very cool. Everyone else sucks.';
            console.log(this.game);
        });
        this.hundy.getUserID().subscribe((response) => {
            this.userID = response;
        });
    }

    changeLikeCount(e: any) {
        console.log('here');
        console.log(e.srcElement.className);
        if (this.alreadyLiked) {
            this.gameFetcher.decLike(this.game.id, this.userID);
            this.game.likes -= 1;
            this.alreadyLiked = false;
        } else {
            this.gameFetcher.incLike(this.game.id, this.userID);
            this.game.likes += 1;
            this.alreadyLiked = true;
        }
    }

    getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
}
