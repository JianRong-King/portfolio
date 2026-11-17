export class Budget {
  private spentUsd = 0;

  constructor(private readonly capUsd: number) {}

  record(costUsd: number): void {
    this.spentUsd += Math.max(0, costUsd);
  }

  get spent(): number {
    return this.spentUsd;
  }

  get remaining(): number {
    return Math.max(0, this.capUsd - this.spentUsd);
  }

  get exhausted(): boolean {
    return this.spentUsd >= this.capUsd;
  }
}
