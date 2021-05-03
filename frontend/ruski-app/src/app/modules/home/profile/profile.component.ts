import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProfileService } from './../services/profile.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  handle: string;
  elo: number;
  name: string;

  constructor(private route:ActivatedRoute, private profile:ProfileService) { 
    route.params.subscribe(params => {
      this.handle = params.handle;
    })
  }

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo(): void{
    this.profile.getUserByHandle(this.handle).subscribe(response => {
      console.log(response);
    });
  }

}
