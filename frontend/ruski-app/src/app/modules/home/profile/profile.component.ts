import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProfileService } from './../services/profile.service';
import { CurrentUserService } from './../services/current-user.service';

import { catchError, map, tap, switchMap } from 'rxjs/operators';


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

  constructor(private route:ActivatedRoute, private profile:ProfileService) { 
  }

  ngOnInit(): void {
    this.route.params.pipe(
      map(response => {
        return response;
      }).subscribe(data => )
    );
    this.getInfo();
  }

  getInfo(): void{
    this.profile.getUserByHandle(this.handle).subscribe(response => {
      this.elo = response.elo;
      this.name = response.name;
      this.profile_url = response.profile_url;
    });
  }

}
