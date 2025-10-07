class Guess {
    constructor() {
        this.hundreds = 0;
        this.tens = 0;
        this.ones = 0;
    }
    toString() {
        return "" + this.hundreds + this.tens + this.ones;
    }
    increment(key) {
        console.log((this[key] + 1) % 10)
        this[key] = (this[key] + 1) % 10;
    }

    decrement(key) {
        this[key] = (this[key] > 0) ? this[key] - 1 : 9;
    }
}
