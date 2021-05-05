import { CommentService } from './../services/comment.service';
import { FeedService } from './../services/feed.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUserService } from '../services/current-user.service';
import { Game } from '../game-feed-template';
import { FormControl } from '@angular/forms';

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
    alreadyLikedComment: boolean[] = [];
    commentLikeMirror: number[] = [];
    commentTextMirror: string[] = [];
    commentUserMirror: string[] = [];
    commentControl = new FormControl();
    constructor(
        private gameFetcher: FeedService,
        private route: ActivatedRoute,
        private hundy: CurrentUserService,
        private commentService: CommentService,
        private router: Router
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
            // console.log(this.game);
            this.gameFetcher
                .getGameLikes(this.game.id)
                .subscribe((response) => {
                    if (response.includes(this.userID)) {
                        // console.log('yessir');
                        this.alreadyLiked = true;
                        // console.log(this.game.id);
                        // console.log(this.game.likes);
                    } else {
                        // console.log('nosir');
                        this.alreadyLiked = false;
                    }
                });
            // console.log(this.game.comments);
            for (const comment of this.game.comments) {
                this.alreadyLikedComment.push(false);
                this.commentLikeMirror.push(comment['likes']);
                // this.commentTextMirror.push(comment['text']);
                // this.commentUserMirror.push(comment['user']['name']);
            }
        });
        this.hundy.getUserID().subscribe((response) => {
            this.userID = response;
        });
    }

    changeLikeCount(e: any) {
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

    changeCommentLikeCount(e: any, i: number) {
        if (this.alreadyLikedComment[i]) {
            this.gameFetcher.decCommentLike(
                this.game.comments[i]['id'],
                this.userID
            );
            this.commentLikeMirror[i] -= 1;
            this.alreadyLikedComment[i] = false;
        } else {
            this.gameFetcher.incCommentLike(
                this.game.comments[i]['id'],
                this.userID
            );
            console.log(this.userID);
            this.commentLikeMirror[i] += 1;
            this.alreadyLikedComment[i] = true;
        }
    }

    getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    postComment() {
        const commentText = this.commentControl.value;
        this.commentControl = new FormControl();
        this.commentService.addComment(this.userID, commentText, this.game.id);
        // this.commentTextMirror.push(commentText);
        // this.commentUserMirror.push('thebilly');
        // console.log(commentText);
    }

    goBack() {
        this.router.navigate(['/main/feed']);
    }
}