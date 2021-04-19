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
        console.log('here');
        return this.auth.user$.pipe(
            map((response: Response) => {
                if (response['https://example.com/roles'][0] === 'new') {
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
        console.log('nah');
        return this.auth.user$.pipe(
            map((response) => {
                console.log(response);
                return response;
            })
        );
    }
}
