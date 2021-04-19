import { DOCUMENT } from '@angular/common';
import { Component, Inject, NgZone, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
// Import the AuthService type from the SDK
import { AuthService } from '@auth0/auth0-angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnChanges {
    constructor(
        @Inject(DOCUMENT) public document: Document,
        public auth: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.auth.user$.subscribe((response) => {
            console.log(response);
        });
        this.checkIfLoggedIn().subscribe((response) => {
            if (response) {
                this.router.navigate(['/main']);
            }
        });
    }

    ngOnChanges() {
        this.checkIfLoggedIn().subscribe((response) => {
            if (response) {
                this.router.navigate(['/main']);
            }
        });
    }

    checkIfLoggedIn() {
        return this.auth.isAuthenticated$;
    }
}
