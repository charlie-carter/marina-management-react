import {DocumentData} from "firebase/firestore";

export class Address {
    public street: string;
    public city: string;
    public province: string;
    public postalCode: string;
    public country: string;

    constructor(data: DocumentData) {
        this.street = data.street || "";
        this.city = data.city || "";
        this.province = data.province || "";
        this.postalCode = data.postal || "";
        this.country = data.country || "";
    }


    toString(): string {
        return `${this.street}, ${this.city}, ${this.province} ${this.postalCode}, ${this.country}`.trim();
    }
}
