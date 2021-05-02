import { HandlerService } from './../services/handler.service';
import { RegisterService } from './../services/register.service';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    nameControl = new FormControl(null);
    handleControl = new FormControl(null);
    namesOptions: string[] = [];
    allHandles: Set<string> = new Set();
    filteredNames: Observable<string[]>;
    nameIdMap: Map<string, string> = new Map();
    errorFlag = false;
    errorMessage: string;

    constructor(
        private reg: RegisterService,
        private router: Router,
        private hundler: HandlerService
    ) {}

    ngOnInit(): void {
        this.reg.fetchUnregUsers().subscribe((response) => {
            // console.log(response);
            this.namesOptions = response.map((user) => user.name);
            for (const user of response) {
                this.nameIdMap.set(user.name, user.id);
            }
            console.log(this.namesOptions);
        });
        this.reg.fetchAllHandles().subscribe((response) => {
            console.log(response);
            for (const user of response) {
                this.allHandles.add(user.handle);
            }
            console.log(this.allHandles);
        });
        this.filteredNames = this.nameControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
        );
    }

    submitInfo() {
        const userHandle = this.handleControl.value;
        const userName = this.nameControl.value;
        if (this.allHandles.has(userHandle)) {
            this.errorFlag = true;
            this.errorMessage = 'Error: Handle already taken.';
            return;
        }
        if (userName == null) {
            this.errorFlag = true;
            this.errorMessage = 'Error: Name cannot be blank.';
            return;
        }
        if (userHandle == null) {
            this.errorFlag = true;
            this.errorMessage = 'Error: Handle cannot be blank.';
            return;
        }
        if (userName.length > 20) {
            this.errorFlag = true;
            this.errorMessage = 'Error: Name must be less than 20 characters.';
            return;
        }
        if (userHandle.length > 20) {
            this.errorFlag = true;
            this.errorMessage =
                'Error: Handle must be less than 20 characters.';
            return;
        }
        this.errorFlag = false;
        if (this.nameIdMap.has(userName)) {
            const userId = this.nameIdMap.get(userName);
            this.reg.submitHandle(userId, userHandle);
            this.reg.submitEmail(userId);
        } else {
            this.reg.genUser(userName).subscribe((response) => {
                const userId = response;
                this.reg.submitHandle(userId, userHandle);
                this.reg.submitEmail(userId);
            });
        }

        // Submit email
        this.hundler.changeRegistered();
        this.router.navigate(['/main']);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        let returnValue = this.namesOptions.filter(
            (option) => option.toLowerCase().indexOf(filterValue) === 0
        );
        returnValue.sort();
        returnValue = returnValue.slice(0, 10);
        return returnValue;
    }
}
