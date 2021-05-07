import { SearchFetcherService } from './../services/search-fetcher.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
    constructor(private searchFetcher: SearchFetcherService, private router: Router) {}
    searchControl = new FormControl();
    namesOptions = [];
    handleOptions = [];
    handleToName = new Map();
    nameToHandle = new Map();
    nameUrlMap = new Map();
    nameEloMap = new Map();
    filteredOptions: Observable<string[]>;

    ngOnInit(): void {
        this.searchFetcher.fetchAllUsersAndHandles().subscribe((response) => {
            // console.log(response);
            for (const user of response) {
                this.namesOptions.push(user.name);
                this.handleOptions.push(user.handle);
                this.handleToName.set(user.handle, user.name);
                this.nameToHandle.set(user.name, user.handle);
                this.nameUrlMap.set(user.name, user.profile_url);
                this.nameEloMap.set(user.name, user.elo);
            }
            // console.log(this.nameUrlMap.get('Abby'));
        });
        this.filteredOptions = this.searchControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
        );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        // console.log(this.handleToName);

        let returnName = this.namesOptions
            .filter((option) => option.toLowerCase().indexOf(filterValue) === 0)
            .map((name) => {
                return `${name} @${this.nameToHandle.get(name)}`;
            });

        let returnHandle = this.handleOptions
            .filter((option) => option.toLowerCase().indexOf(filterValue) === 0)
            .map((handle) => {
                return `${this.handleToName.get(handle)} @${handle}`;
            });

        let returnValues = [...new Set(returnName.concat(returnHandle))];
        returnValues.sort();
        returnValues = returnValues.slice(0, 5);

        return returnValues;
    }

    navUser(name: any){
        const handle = name.split(' ')[1].slice(1);
        this.router.navigate([`/main/user/${handle}`]);
    }
}
