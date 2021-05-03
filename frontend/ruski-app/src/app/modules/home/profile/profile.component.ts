import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  handle: string;
  constructor(private route:ActivatedRoute) { 
    route.params.subscribe(params => {
      this.handle = params.handle;
    })
  }

  ngOnInit(): void {
  }

}
