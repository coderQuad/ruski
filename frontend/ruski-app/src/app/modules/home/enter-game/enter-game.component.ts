import { SubmitGameService } from './../services/submit-game.service';
import { CurrentUserService } from './../services/current-user.service';
import { Game } from './../game-template';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators, FormBuilder,FormGroup } from '@angular/forms';
import { Observable, forkJoin, from } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';
import { element } from 'protractor';
import { resolve } from 'node:path';

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
    id: string = '';
    myElo: number = 0;
    partnerElo: number = 0;
    enemy1Elo: number = 0;
    enemy2Elo: number =0;


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
            //this.myName.value,
            this.userName,
            this.partnerName.value,
            this.oneName.value,
            this.twoName.value,
            this.myCups.value,
            this.partnerCups.value,
            this.oneCups.value,
            this.twoCups.value,
        ];
        const namesArray = [
            //this.myName.value,
            this.userName,
            this.partnerName.value,
            this.oneName.value,
            this.twoName.value,
        ];
        let noErrors = true;
        console.log(allValuesArray);
        for (const value of allValuesArray) {
            if (value === null) {
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
            //myName: this.userMap.get(this.myName.value),
            myName: this.userMap.get(this.userName),
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
        }
        
        this.gameSubmitter.submitGame(game);
        this.eloUpdate(game);
        
    }
    callUpdate(game: Game){
        this.gameSubmitter.updateElo(game.myName, this.myElo);
        this.gameSubmitter.updateElo(game.partnerName, this.partnerElo);
        this.gameSubmitter.updateElo(game.oneName, this.enemy1Elo);
        this.gameSubmitter.updateElo(game.twoName, this.enemy2Elo);
    }
    eloUpdate( game: Game){
        forkJoin(
            {
                me : this.gameSubmitter.getElo(game.myName),
                partner : this.gameSubmitter.getElo(game.partnerName),
                enemy1  :this.gameSubmitter.getElo(game.oneName),
                enemy2 : this.gameSubmitter.getElo(game.twoName)
            }

        ).subscribe( ({me, partner, enemy1, enemy2}) => {
            
            let elo_new: number[];
            this.myElo = me.data.user["elo"];
            this.partnerElo = partner.data.user["elo"];
            this.enemy1Elo = enemy1.data.user["elo"];
            this.enemy2Elo = enemy2.data.user["elo"];
            if(game.winner === 1){
                const elos = [
                    this.myElo,
                    this.partnerElo,
                    this.enemy1Elo,
                    this.enemy2Elo
                ];
                const cups = [
                    game.myCups,
                    game.partnerCups,
                    game.oneCups,
                    game.twoCups,
                ];
                this.eloCalc(cups,elos).then( elo_new => {
                    //this.myElo = elo_new[0];
                    //this.partnerElo = elo_new[1];
                    //this.enemy1Elo = elo_new[2];
                    //this.enemy2Elo = elo_new[3];
                    console.log("WINNER")
                    console.log(elos);
                    console.log(elo_new);
                    this.gameSubmitter.updateElo(game.myName, elo_new[0]);
                    this.gameSubmitter.updateElo(game.partnerName, elo_new[1]);
                    this.gameSubmitter.updateElo(game.oneName, elo_new[2]);
                    this.gameSubmitter.updateElo(game.twoName, elo_new[3]);
                    
                    }
                );
                

            }
            else{
                const elos = [
                    this.enemy1Elo,
                    this.enemy2Elo,
                    this.myElo,
                    this.partnerElo
                ];
                const cups = [
                    game.oneCups,
                    game.twoCups,
                    game.myCups,
                    game.partnerCups,
                ];
                this.eloCalc(cups,elos).then( elo_new => {
                    this.gameSubmitter.updateElo(game.myName, elo_new[2]);
                    this.gameSubmitter.updateElo(game.partnerName, elo_new[3]);
                    this.gameSubmitter.updateElo(game.oneName, elo_new[0]);
                    this.gameSubmitter.updateElo(game.twoName, elo_new[1]);
                    }
                );
               
                
            }
            
        });

        
        
    }

    async eloCalc(cups: number[] , elos:number[] ){
        let K:number  = 30;
        let cup_m: number = 30;
        let new_elos = [0,0,0,0];
        let win_elo:number = (elos[0]+elos[1])/2;
        let lose_elo:number = (elos[2]+elos[3])/2;
        let win_expect:number = 1/(1+Math.pow(10,((win_elo-lose_elo)/400)) );
        let lose_expect:number = 1/(1+Math.pow(10,((lose_elo- win_elo)/400)) );
        let new_elo:number;
        let expected:number;
        let win_fact:number;
        let oppo_cups:number;
        let Q:number;
        let MOVM:number;
        let result:number;
        let delta: number;
        for(let i= 0; i< 4; i++){
            new_elo = elos[i];
            if( i < 2){
                expected = win_expect;
                win_fact = win_expect * cup_m;
                oppo_cups = (cups[3] + cups[2])/ 2;
                Q = 2.2/(Math.abs(elos[i]-lose_elo)*0.001 + 2.2); 
                MOVM = Math.log(Math.abs(cups[i]- oppo_cups)+1)*Q;
                expected = 1/(1+Math.pow(10,((elos[i]-lose_elo)/400)) );
                result = 0.5;
                if (cups[i] > oppo_cups){
                    result = 1;
                }
                else if( cups[i] < oppo_cups){
                    result = 0;
                }
            }
            else {
                expected = lose_expect;
                win_fact = -1*lose_expect*cup_m;
                oppo_cups = (cups[0] + cups[1])/ 2 ;
                Q = 2.2/(Math.abs(elos[i]-win_elo)*0.001 + 2.2);
                MOVM = Math.log(Math.abs(cups[i]- oppo_cups)+1)*Q;
                expected = 1/(1+Math.pow(10,((elos[i]-win_elo)/400)) );
                result = 0.5;
                if(cups[i] > oppo_cups){
                    result = 1;
                }
                else if (cups[i] < oppo_cups){
                    result = 0;
                }
            }
            delta = K*(result - expected)*MOVM;
            new_elo += delta*.6;
            new_elos[i] = Math.round(new_elo+ 2*win_fact);
        }
        return new_elos;
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
            response.subscribe(res => {
                const user = res.data.userByEmail[0];
                this.userPro= user.profile_url;
                this.userName= user.name;
                this.userHandle= user.handle;
                this.usered=true;
            })
        });

    }
    
}
