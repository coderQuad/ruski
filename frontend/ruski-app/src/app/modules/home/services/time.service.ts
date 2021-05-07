import { Time } from './../time-template';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TimeService {
    constructor() {}

    convertTime(time1: string) {
        // "2021-04-07T03:26:01.422Z"
        // "2021-05-07T00:50:12.260Z"
        const time = new Date(time1);
        // const splitT = time.split('T');
        // const calendar = splitT[0];
        // const numbers = splitT[1];
        // const yearMonthDay = calendar.split('-');
        // const hourTimeRest = numbers.split(':');
        let outputTime = {} as Time;
        outputTime.day = time.getDate().toString();
        outputTime.month = time.getMonth().toString();
        outputTime.year = time.getFullYear().toString();
        outputTime.hour = time.getHours().toString();
        outputTime.minute = time.getMinutes().toString();
        return outputTime;
    }
}
