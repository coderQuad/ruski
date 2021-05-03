import { SubmitGameService } from './../services/submit-game.service';
import { CurrentUserService } from './../services/current-user.service';
import { Game } from './../game-template';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators, FormBuilder,FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-enter-game',
    templateUrl: './enter-game.component.html',
    styleUrls: ['./enter-game.component.scss'],
})
export class EnterGameComponent implements OnInit {
    myName = new FormControl();
    myCups = new FormControl([Validators.min(1), Validators.max(10)]);
    myPenalties = new FormControl(0);
    partnerName = new FormControl();
    partnerCups = new FormControl();
    partnerPenalties = new FormControl(0);
    oneName = new FormControl();
    oneCups = new FormControl();
    onePenalties = new FormControl(0);
    twoName = new FormControl();
    twoCups = new FormControl();
    twoPenalties = new FormControl(0);
    descriptionControl = new FormControl();
    formGroup = this._formBuilder.group({});
    usersOptions: string[] = [];
    userMap: Map<string, string> = new Map();
    filteredUsers: Observable<string[]>;
    errorFlag: boolean = false;
    errorMessage: string = '';


    // properties for current user display
    userPro: string = '';
    userName: string = '';
    userHandle: string = '';
    usered: boolean;

    constructor(private gameSubmitter: SubmitGameService, private _formBuilder: FormBuilder, private current:CurrentUserService) {}

    ngOnInit(): void {
        this.gameSubmitter.fetchUsers().valueChanges.subscribe((response) => {
            for (const user of response.data.users) {
                this.userMap.set(user.name, user.id);
                this.usersOptions.push(user.name);
            }
        });
        this.formGroup = this._formBuilder.group({
            formArray: this._formBuilder.array([
              this._formBuilder.group({
                myName : this.myName,
                myCups: this.myCups,
                myPenalties : this.myPenalties,
                partnerName : this.partnerName,
                partnerCups : this.partnerCups,
                partnerPenalties : this.partnerPenalties,
                
              }),
              this._formBuilder.group({
                oneName : this.oneName,
                oneCups : this.oneCups,
                onePenalties : this.onePenalties,
                twoName : this.twoName,
                twoCups : this.twoCups,
                twoPenalties : this.twoPenalties
              }),
              this._formBuilder.group({
                descriptionControl : this.descriptionControl,
              }),
            ])
          });
        this.fillUser();
    }
    get formArray(): AbstractControl | null {
        return this.formGroup.get('formArray');
    }

    filterHandler(formy: FormControl) {
        this.filteredUsers = formy.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
        );
    }

    watchValue(formy: FormControl, flag: number) {
        console.log(flag);
        formy.valueChanges.subscribe((response) => {
            if (response > 10) {
                console.log(response);
                if (flag === 1) {
                    this.myCups = new FormControl(10, [
                        Validators.min(1),
                        Validators.max(10),
                    ]);
                } else if (flag === 2) {
                    this.partnerCups = new FormControl(10, [
                        Validators.min(1),
                        Validators.max(10),
                    ]);
                } else if (flag === 3) {
                    this.oneCups = new FormControl(10, [
                        Validators.min(1),
                        Validators.max(10),
                    ]);
                } else if (flag === 4) {
                    this.twoCups = new FormControl(10, [
                        Validators.min(1),
                        Validators.max(10),
                    ]);
                }
            }
        });
    }

    submitInfo() {
        if (this.myCups.value > 10) {
            this.myCups = new FormControl(10, [
                Validators.min(1),
                Validators.max(10),
            ]);
        }
        if (this.partnerCups.value > 10) {
            this.partnerCups = new FormControl(10, [
                Validators.min(1),
                Validators.max(10),
            ]);
        }
        if (this.oneCups.value > 10) {
            this.oneCups = new FormControl(10, [
                Validators.min(1),
                Validators.max(10),
            ]);
        }
        if (this.twoCups.value > 10) {
            this.twoCups = new FormControl(10, [
                Validators.min(1),
                Validators.max(10),
            ]);
        }

        const allValuesArray = [
            this.myName.value,
            this.partnerName.value,
            this.oneName.value,
            this.twoName.value,
            this.myCups.value,
            this.partnerCups.value,
            this.oneCups.value,
            this.twoCups.value,
        ];
        const namesArray = [
            this.myName.value,
            this.partnerName.value,
            this.oneName.value,
            this.twoName.value,
        ];
        let noErrors = true;
        for (const value of allValuesArray) {
            if (!value) {
                this.errorFlag = true;
                noErrors = false;
                this.errorMessage = `Error: Cannot leave fields blank`;
                return;
            }
        }
        for (const name of namesArray) {
            if (!this.userMap.has(name)) {
                this.errorFlag = true;
                noErrors = false;
                this.errorMessage = `Error: ${name} is not a valid user`;
                return;
            }
        }
        if (noErrors) {
            this.errorFlag = false;
        }
        if (!this.descriptionControl.value) {
            this.descriptionControl = new FormControl('');
        }

        const winner =
            this.myCups.value + this.partnerCups.value >
            this.oneCups.value + this.twoCups.value
                ? 1
                : 2;
        const game: Game = {
            myName: this.userMap.get(this.myName.value),
            myCups: this.myCups.value,
            myPenalties: this.myPenalties.value,
            partnerName: this.userMap.get(this.partnerName.value),
            partnerCups: this.partnerCups.value,
            partnerPenalties: this.partnerPenalties.value,
            oneName: this.userMap.get(this.oneName.value),
            oneCups: this.oneCups.value,
            onePenalties: this.onePenalties.value,
            twoName: this.userMap.get(this.twoName.value),
            twoCups: this.twoCups.value,
            twoPenalties: this.twoPenalties.value,
            description: this.descriptionControl.value,
            winner: winner,
        };
        this.gameSubmitter.submitGame(game);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        let returnValue = this.usersOptions.filter(
            (option) => option.toLowerCase().indexOf(filterValue) === 0
        );
        returnValue.sort();
        returnValue = returnValue.slice(0, 10);
        return returnValue;
    }

    fillUser(){
        this.current.fetchUser()
        .subscribe(response => {
            const user = response.data.userByEmail[0];
            this.userPro= user.profile_url;
            this.userName= user.name;
            this.userHandle= user.handle;
            this.usered=true;
        });

    }
    
}
