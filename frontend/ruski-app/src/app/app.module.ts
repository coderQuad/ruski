import { MaterialModule } from './modules/material/material.module';
import { AuthLogModule } from './modules/auth/auth-log.module';
import { HomeModule } from './modules/home/home.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';

// Import the module from the SDK
import { AuthModule } from '@auth0/auth0-angular';

@NgModule({
    declarations: [AppComponent, MainComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HomeModule,
        AuthLogModule,
        BrowserAnimationsModule,
        MaterialModule,
        // Import the module into the application, with configuration
        AuthModule.forRoot({
            domain: 'playruski.us.auth0.com',
            clientId: 'aOLAfBpRiRBIsNZk2kr9xxdqRPuvOysL',
        }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
