import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit(): void {}

    enterGame() {
        this.router.navigate(['/main/enter']);
    }

    showLeaderboard() {
        this.router.navigate(['/main/leaderboard']);
    }

    showFeed() {
        this.router.navigate(['/main/feed']);
    }

    showSearch() {
        this.router.navigate(['/main/search']);
    }
}
