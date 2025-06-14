import { DocumentData } from "firebase/firestore";
import {Charge} from "./Charge";


export class GasCharge implements Charge {
    public price: number;
    public amount: number;
    public rate: number;
    public date: string;
    public boat: string;
    public pump: string;
    public type: string = "Gas Charge";


    constructor(data: DocumentData) {
        this.amount = data.amount;
        this.rate = data.rate;
        this.price = this.amount * this.rate;
        this.date = data.date;
        this.boat = data.boat || "";
        this.pump = data.pump || "";
        console.log("Gas charge added " + data.id);

    }


}



