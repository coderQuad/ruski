import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators, FormBuilder,FormGroup, Form } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Router } from '@angular/router';

import { CurrentUserService } from './../services/current-user.service';
import { ProfileService } from './../services/profile.service';

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

  // identify user
  id:string;

  // cropper properties
  imageChangedEvent;
  croppedImage;

  // error properties
  errorFlag: boolean;
  errorMessage: string;

  constructor(private currentUser: CurrentUserService, private _formBuilder: FormBuilder, private router: Router, private profile:ProfileService) { }

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
      this.id = response.id;

      this.name = this.oldName;
      this.handle = this.oldHandle;
      this.pic = this.oldPic;
    });
  }

  submitChanges(): void {
    const handle = this.handleControl.value;
    const name = this.nameControl.value;
    const pic = this.imageControl.value;

    if(name && name.length > 20) {
      this.errorFlag = true;
      this.errorMessage = 'Error: Name must be less than 20 characters.';
      return;
    }
    if(handle && handle.length > 20) {
        this.errorFlag = true;
        this.errorMessage = 'Error: Handle must be less than 20 characters.';
        return;
    }
    this.errorFlag = false;      

    if(handle && handle !== this.oldHandle){
      this.handle = handle;
      this.profile.updateHandle(this.id, this.handle);
    }
    if(name && name !== this.oldName){
      this.name = name;
      this.profile.updateName(this.id, this.name);
    }
    if(pic){
      this.profile.updatePic(this.id, pic);
    }

    this.router.navigate([`/main/user/${this.handle}`]);
  }

  onSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.formGroup.patchValue({image: file});
    this.formGroup.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.pic = this.croppedImage;
    this.formGroup.patchValue({image: this.croppedImage});
  }
  imageLoaded(image: HTMLImageElement) {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }

}
