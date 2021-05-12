import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { AuthService } from '@auth0/auth0-angular';

import { ProfileService } from './../services/profile.service';
import { CurrentUserService } from './../services/current-user.service';

import { forkJoin, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NoFragmentCyclesRule } from 'graphql';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // current page member data
  id: string;
  handle: string;
  elo: number;
  name: string;
  profile_url: string;

  wins: number;
  losses: number;
  percentage: string;
  averageCups: string;
  yaks: number;

  // user data
  myHandle:string;

  // gating properties
  myProfile: boolean;
  isFriend: boolean;

  constructor(private route:ActivatedRoute, private router: Router, private profile:ProfileService, private user:CurrentUserService, public auth:AuthService, @Inject(DOCUMENT) public document: Document) { 
  }

  ngOnInit(): void {
    this.determineHandle();
  }

  determineHandle() {
    combineLatest([
      this.route.params,
      this.user.getHandle()
    ]).subscribe(response => {
      this.handle = response[0].handle;
      this.myHandle = response[1];
      this.getInfo().subscribe();
      if(this.handle !== this.myHandle){
        this.myProfile = false;
        // this.areFriends(this.id, this.myHandle);
      } else {
        this.myProfile = true;
      }
    });
  }

  getInfo() {
    return this.profile.getUserByHandle(this.handle).pipe(
      switchMap(response => {
        this.elo = response.elo;
        this.id = response.id
        this.name = response.name;
        this.profile_url = response.profile_url;
        
        this.profile.getUserStats(this.id).subscribe(response => {
          this.wins = response.wins;
          this.losses = response.losses;
          this.percentage = response.percentage
          this.yaks = response.yaks;
          this.averageCups = response.averageCups;
        })
        return of();
      })
    );
  }

  areFriends(pageId: string, myHandle: string): void {
    this.profile.checkFriends(pageId, myHandle).subscribe(response => {
      this.isFriend = response;
    });
  }

  editProfile(): void{
    this.router.navigate(['/main/settings']);
  }

  addFriend(): void {

    this.areFriends(this.id, this.myHandle);
  }

  removeFriend(): void {

    this.areFriends(this.id, this.myHandle);
  }

}
