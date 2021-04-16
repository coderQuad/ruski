import { Game } from './../game-template';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SubmitGameService {
    constructor() {}

    submitGame(game: Game) {
        console.log(game);
    }
}
