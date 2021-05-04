import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators, FormBuilder,FormGroup } from '@angular/forms';

import { CurrentUserService } from './../services/current-user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  nameControl = new FormControl(null);
  handleControl = new FormControl(null);
  imageControl = new FormControl(null);

  oldName:string;
  oldHandle:string;
  oldPic: string;

  constructor(private currentUser: CurrentUserService) { }

  ngOnInit(): void {
    this.currentUser.fetchUser().subscribe(response => {
      this.oldHandle = response.handle;
      this.oldName = response.name;
      this.oldPic = response.profile_url;
    })
  }

  submitChanges(): void {
    const handle = this.handleControl.value;
    const name = this.nameControl.value;
    console.log(handle);
    console.log(name);
  }

}
