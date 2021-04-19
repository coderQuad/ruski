import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, public auth: AuthService) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const url: string = state.url;
        console.log(
            this.auth.isAuthenticated$.pipe(
                map((response) => {
                    console.log(response);
                })
            )
        );
        console.log('here');
        return true;
    }

    isLoggedIn() {
        console.log('nah');
        return this.auth.isAuthenticated$.pipe(
            map((response) => {
                console.log(response);
                return response;
            })
        );
    }
}
