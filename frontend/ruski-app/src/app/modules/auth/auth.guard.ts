import { HandlerService } from './services/handler.service';
import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        public auth: AuthService,
        private hundler: HandlerService
    ) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        // console.log(route);
        const url: string = state.url;
        // console.log(route);
        // console.log(state);
        const isRegistered = this.hundler.getStatus();
        // console.log('here');
        return this.auth.user$.pipe(
            map((response: Response) => {
                // console.log(response);
                if (response['https://example.com/roles'][0] === 'old') {
                    // console.log('billy');
                    return true;
                } else if (isRegistered) {
                    // console.log('hundy');
                    return true;
                }
                this.router.navigate(['/register']);
                return false;
            }),
            catchError((error: any) => {
                console.log(error);
                return of(null);
            })
        );
    }

    isNewUser() {
        // console.log('nah');
        return this.auth.user$.pipe(
            map((response) => {
                // console.log(response);
                return response;
            })
        );
    }
}
