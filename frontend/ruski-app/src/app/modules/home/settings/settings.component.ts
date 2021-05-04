import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators, FormBuilder,FormGroup, Form } from '@angular/forms';

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

  name:string;
  handle:string;
  pic:string;

  oldName:string;
  oldHandle:string;
  oldPic: string;

  constructor(private currentUser: CurrentUserService, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.currentUser.fetchUser().subscribe(response => {
      this.oldHandle = response.handle;
      this.oldName = response.name;
      this.oldPic = response.profile_url;

      this.name = this.oldName;
      this.handle = this.oldHandle;
      this.pic = this.oldPic;
    });
  }

  submitChanges(): void {
    const handle = this.handleControl.value;
    const name = this.nameControl.value;
    console.log(handle);
    console.log(name);
  }

}
