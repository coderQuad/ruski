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

  handle: string;
  elo: number;
  name: string;
  profile_url: string;
  my_profile: boolean;

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
      this.getInfo();
      if(this.handle !== response[1]){
        this.my_profile = false;
      } else {
        this.my_profile = true;
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

  editProfile(): void{
    this.router.navigate(['/main/settings']);
  }

}
