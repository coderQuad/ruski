import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class HandlerService {
    isRegistered = false;

    constructor() {}

    changeRegistered() {
        console.log('here');
        this.isRegistered = true;
    }

    getStatus() {
        console.log(this.isRegistered);
        return this.isRegistered;
    }
}
