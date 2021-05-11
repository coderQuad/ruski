import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators, FormBuilder,FormGroup, Form } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Router } from '@angular/router';

import { CurrentUserService } from './../services/current-user.service';
import { RegisterService } from './../../auth/services/register.service';
import { ProfileService } from './../services/profile.service';
import { combineLatest } from 'rxjs';

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

  // list of existing handles
  allHandles: Set<string> = new Set();

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
  editingPic: boolean;

  // error properties
  errorFlag: boolean;
  tooBig: boolean;
  errorMessage: string = '';

  constructor(
    private currentUser: CurrentUserService, 
    private _formBuilder: FormBuilder, 
    private router: Router, 
    private profile:ProfileService, 
    private reg: RegisterService) { }

  ngOnInit(): void {
    this.compareHandles();
    this.reg.fetchAllHandles().subscribe((response) => {
      for (const user of response) {
          this.allHandles.add(user.handle);
      }
  });
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

    this.errorFlag = true;

    if(name && name.length > 20) {
      this.errorFlag = true;
      this.errorMessage += 'Error: Name must be less than 20 characters.';
      return;
    }
    if(handle && handle.length > 20) {
        this.errorFlag = true;
        this.errorMessage += 'Error: Handle must be less than 20 characters.';
        return;
    }
    if(handle && this.allHandles.has(handle)){
      this.errorFlag = true;
      this.errorMessage += 'Error: Handle is already taken.';
      return;
    }
    if(this.tooBig){
      this.errorFlag = true;
      this.errorMessage += 'Error: Image must be 1 MB or less.';
      return;
    }

    this.errorFlag = false;      

    let observables = [];
    const currentHandle = handle ? handle.length : this.handle;
    if(handle && handle !== this.oldHandle){
      this.handle = handle;
      observables.push(this.profile.updateHandle(this.id, this.handle));
    }
    if(name && name !== this.oldName){
      this.name = name;
      observables.push(this.profile.updateName(this.id, currentHandle, this.name));
    }
    if(pic){
      this.editingPic = true;
      observables.push(this.profile.updatePic(this.id, currentHandle, pic));
    }

    if(!observables.length){
      this.router.navigate([`/main/user/${this.handle}`]);
    }

    combineLatest(observables).subscribe(response => {
      console.log(response);
      this.router.navigate([`/main/user/${this.handle.split(' ').join('').toLowerCase()}`]);
    });


  }

  onSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    var filesize = ((file.size/1024)/1024);
    if(filesize > 5){
      this.tooBig = true;
    }
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
