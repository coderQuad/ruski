import { MaterialModule } from './../material/material.module';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [LoginComponent],
    imports: [CommonModule, MaterialModule],
    exports: [LoginComponent],
})
export class AuthLogModule {}
