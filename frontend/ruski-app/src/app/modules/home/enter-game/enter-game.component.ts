import { SubmitGameService } from './../services/submit-game.service';
import { Game } from './../game-template';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-enter-game',
    templateUrl: './enter-game.component.html',
    styleUrls: ['./enter-game.component.scss'],
})
export class EnterGameComponent implements OnInit {
    myName = new FormControl();
    myCups = new FormControl();
    partnerName = new FormControl();
    partnerCups = new FormControl();
    oneName = new FormControl();
    oneCups = new FormControl();
    twoName = new FormControl();
    twoCups = new FormControl();

    constructor(private gameSubmitter: SubmitGameService) {}

    ngOnInit(): void {}

    submitInfo() {
        const game: Game = {
            myName: this.myName.value,
            myCups: this.myCups.value,
            partnerName: this.partnerName.value,
            partnerCups: this.partnerCups.value,
            oneName: this.oneName.value,
            oneCups: this.oneCups.value,
            twoName: this.twoName.value,
            twoCups: this.twoCups.value,
        };
        this.gameSubmitter.submitGame(game);
    }
}
