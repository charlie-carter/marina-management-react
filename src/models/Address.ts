export class Address {
    constructor(
        public street1: string = "",
        public street2: string = "",
        public city: string = "",
        public province: string = "",
        public postalCode: string = "",
        public country: string = ""
    ) {}

    toString(): string {
        return `${this.street1}${this.street2 ? ", " + this.street2 : ""}, ${this.city}, ${this.province} ${this.postalCode}, ${this.country}`.trim();
    }
}
