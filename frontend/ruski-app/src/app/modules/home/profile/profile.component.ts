import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProfileService } from './../services/profile.service';
import { CurrentUserService } from './../services/current-user.service';

import { forkJoin, combineLatest } from 'rxjs';
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

  constructor(private route:ActivatedRoute, private profile:ProfileService, private user:CurrentUserService) { 
  }

  ngOnInit(): void {
    this.determineHandle();
    this.getInfo();
  }

  determineHandle() {
    const 
    combineLatest(
      [
        this.route.params,
        this.user.getHandle(),
      ]
    // ).pipe(
    //   map(([route, user]) => {
    //     console.log(route);
    //     console.log(user);
    //   })
    ).subscribe(response => console.log(response));
  }

  getInfo(): void{
    this.profile.getUserByHandle(this.handle).subscribe(response => {
      this.elo = response.elo;
      this.name = response.name;
      this.profile_url = response.profile_url;
    });
  }

}
