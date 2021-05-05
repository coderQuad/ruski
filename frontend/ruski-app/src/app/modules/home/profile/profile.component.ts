import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ProfileService } from './../services/profile.service';
import { CurrentUserService } from './../services/current-user.service';

import { forkJoin, combineLatest, from } from 'rxjs';
import { map } from 'rxjs/operators';


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

  // user data
  myHandle:string;

  // gating properties
  myProfile: boolean;
  isFriend: boolean;

  constructor(private route:ActivatedRoute, private router: Router, private profile:ProfileService, private user:CurrentUserService) { 
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
      this.getInfo();
      if(this.handle !== this.myHandle){
        this.myProfile = false;
        // this.areFriends(this.id, this.myHandle);
      } else {
        this.myProfile = true;
      }
    });
  }

  getInfo(): void{
    this.profile.getUserByHandle(this.handle).subscribe(response => {
      this.elo = response.elo;
      this.name = response.name;
      this.profile_url = response.profile_url;
    });
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
