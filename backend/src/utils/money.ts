export function toCents(value: unknown): number {
  return Math.round(Number(value) * 100);
}

export function fromCents(pence: number): string {
  return (pence / 100).toFixed(2);
}
