export class Random
{
    constructor(seed) {
        function getHashCode(value) { // https://stackoverflow.com/a/7616484
            var hash = 0,
                i, chr;
            if (value.length === 0) return hash;
            for (i = 0; i < value.length; i++) {
                chr = value.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }
        
        if (!seed) {
            this.seed = Date.now();
        } else {
            this.seed = getHashCode(seed);
        }
    }

    setSeed(seed) {
        this.seed = seed;
    }

    reset() {
        this.seed = Date.now();
    }

    next() {
        var x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }
}