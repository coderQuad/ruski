import { DOCUMENT } from '@angular/common';
import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
// Import the AuthService type from the SDK
import { AuthService } from '@auth0/auth0-angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    constructor(
        @Inject(DOCUMENT) public document: Document,
        public auth: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        console.log(this.auth.isAuthenticated$);
        if (this.checkIfLoggedIn) {
            this.router.navigate(['/main']);
        }
    }

    checkIfLoggedIn() {
        return this.auth.isAuthenticated$.pipe(
            map((response) => {
                return response;
            })
        );
    }
}
