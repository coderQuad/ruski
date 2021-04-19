import { MaterialModule } from './../material/material.module';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';

@NgModule({
    declarations: [LoginComponent, RegisterComponent],
    imports: [CommonModule, MaterialModule],
    exports: [LoginComponent],
})
export class AuthLogModule {}
