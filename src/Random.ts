export class Random {
  seed: number;

  constructor(seed: string) {
    this.seed = this.getHashCode(seed);
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

  next() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  static generateSeed() {
    return (Math.random() + 1).toString(36).substring(2);
  }
}
