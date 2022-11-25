export class Random {
  seed: number;

  constructor(seed: string | null) {
    if (!seed) {
      this.seed = Date.now();
    } else {
      this.seed = this.getHashCode(seed);
    }
  }

  // https://stackoverflow.com/a/7616484
  getHashCode(value: string) {
    let hash = 0,
      i,
      chr;
    if (value.length === 0) return hash;
    for (i = 0; i < value.length; i++) {
      chr = value.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  setSeed(seed: string) {
    this.seed = this.getHashCode(seed);
  }

  reset() {
    this.seed = Date.now();
  }

  next() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}
