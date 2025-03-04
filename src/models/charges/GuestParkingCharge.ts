import {Charge} from "./Charge";
import {Car} from "../Car";
import {Temporal} from "@js-temporal/polyfill";


export class GuestParkingCharge implements Charge {
    amount: number;
    description: string;
    date: Temporal.PlainDateTime;

    constructor(
        carInfo: string,
        days: number,
        rate: number,

    ) {
        this.amount = days * rate;

        this.description = carInfo;
        this.date = Temporal.Now.plainDateTimeISO();
    }

}
