import { MaterialModule } from './../material/material.module';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [LoginComponent, RegisterComponent],
    imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
    exports: [LoginComponent],
})
export class AuthLogModule {}
