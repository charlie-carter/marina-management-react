import {Temporal} from "@js-temporal/polyfill";

export interface Charge {
    amount: number;
    description?: string;
    date: Temporal.PlainDateTime;

}
