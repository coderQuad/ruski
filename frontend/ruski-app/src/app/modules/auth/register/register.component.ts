import { RegisterService } from './../services/register.service';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    nameControl = new FormControl();
    handleControl = new FormControl();
    namesOptions: string[] = [];
    allHandles: Set<string>;
    filteredNames: Observable<string[]>;
    nameIdMap: Map<string, string> = new Map();

    constructor(private reg: RegisterService) {}

    ngOnInit(): void {
        this.reg.fetchUnregUsers().subscribe((response) => {
            console.log(response);
            this.namesOptions = response.map((user) => user.name);
            for (const user of response) {
                this.nameIdMap.set(user.name, user.id);
            }
            console.log(this.namesOptions);
        });
        this.reg.fetchAllHandles().subscribe((response) => {
            console.log(response);
        });
        this.filteredNames = this.nameControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
        );
    }

    submitInfo() {
        console.log(this.nameIdMap);
        const userId = this.nameIdMap.get(this.nameControl.value);
        console.log(userId, this.handleControl.value);
        this.reg.submitHandle(userId, this.handleControl.value);
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
