import {Charge} from "./Charge";
import {Temporal} from "@js-temporal/polyfill";

export class GasCharge implements Charge {
    amount: number;
    description: string;
    date: Temporal.PlainDateTime;


    constructor(
        litres: number,
        rate: number,
        public boatPhoto?: string,
        public pumpPhoto?: string,

    ) {
        this.amount = litres * rate;
        this.description = "Gas";
        this.date = Temporal.Now.plainDateTimeISO();

    }


}



