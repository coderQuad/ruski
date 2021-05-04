import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators, FormBuilder,FormGroup, Form } from '@angular/forms';
import Cropper from "cropperjs";

import { CurrentUserService } from './../services/current-user.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  // form properties 
  nameControl = new FormControl(null, {validators: [Validators.maxLength(20)]});
  handleControl = new FormControl(null, {validators: [Validators.maxLength(20)]});
  imageControl = new FormControl(null);

  formGroup = this._formBuilder.group({});

  // values for html
  name:string;
  handle:string;
  pic:string;

  // values for comparison
  oldName:string;
  oldHandle:string;
  oldPic: string;

  // cropper properties
  imageChangedEvent;
  croppedImage;

  constructor(private currentUser: CurrentUserService, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.compareHandles();
    this.formGroup = this._formBuilder.group({
      name: this.nameControl,
      handle: this.handleControl,
      image: this.imageControl,
    })
  }

  compareHandles(): void {
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

  onSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.formGroup.patchValue({image: file});
    this.formGroup.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.pic = reader.result.toString();
    };
    reader.readAsDataURL(file);
    this.imageChangedEvent = event;
  }

}