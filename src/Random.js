export class Random
{
    constructor() {
        this.seed = Date.now();
    }

    setSeed(seed) {
        this.seed = seed;
    }

    reset() {
        this.seed = Date.now();
    }

    // named Number to match built in boardgame.io random.Number()
    Number() {
        var x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }
}