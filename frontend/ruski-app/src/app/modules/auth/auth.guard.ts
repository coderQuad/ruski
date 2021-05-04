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
        const url: string = state.url;
        return this.hundler.checkUserExistsByEmail().pipe(
            map((response: any) => {
                // console.log(response);
                if (response.length > 0) {
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
        return this.auth.user$.pipe(
            map((response) => {
                return response;
            })
        );
    }
}
