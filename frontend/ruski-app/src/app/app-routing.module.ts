import { RegisterComponent } from './modules/auth/register/register.component';
import { EnterGameComponent } from './modules/home/enter-game/enter-game.component';
import { HomeComponent } from './modules/home/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { MainComponent } from './main/main.component';
import { AuthGuard as Custom } from './modules/auth/auth.guard';
import { AuthGuard } from '@auth0/auth0-angular';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuard],
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
