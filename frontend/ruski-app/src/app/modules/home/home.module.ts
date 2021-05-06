import { AppRoutingModule } from './../../app-routing.module';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { EnterGameComponent } from './enter-game/enter-game.component';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from 'src/app/main/main.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { FeedComponent } from './feed/feed.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard as RegGuard } from '../auth/auth.guard';
import { MatStepperModule } from '@angular/material/stepper';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { SocialFeedComponent } from './social-feed/social-feed.component';

const homeRoutes: Routes = [
    {
        path: 'main',
        component: MainComponent,
        canActivate: [AuthGuard, RegGuard],
        children: [
            { path: '', component: FeedComponent },
            { path: 'enter', component: EnterGameComponent },
            { path: 'leaderboard', component: LeaderboardComponent },
            { path: 'feed', component: SocialFeedComponent },
        ],
    },
];

@NgModule({
    declarations: [
        HomeComponent,
        NavComponent,
        EnterGameComponent,
        FeedComponent,
        LeaderboardComponent,
        SocialFeedComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        MatStepperModule,
        RouterModule.forChild(homeRoutes),
    ],
    exports: [HomeComponent, NavComponent],
})
export class HomeModule {}
