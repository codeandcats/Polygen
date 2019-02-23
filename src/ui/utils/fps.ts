export class Fps {
  private samples: number[] = [];

  constructor(private sampleSize: number = 180) {
  }

  public tick() {
    const now = Date.now();

    this.samples.push(now);

    if (this.samples.length > this.sampleSize) {
      this.samples.shift();
    }
  }

  public getAverage() {
    if (this.samples.length < 2) {
      return 0;
    }

    const diff = this.samples[this.samples.length - 1] - this.samples[0];

    const averageDiff = diff / this.samples.length;

    const fps = 1000 / averageDiff;

    return fps;
  }
}
