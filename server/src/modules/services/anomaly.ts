export interface AnomalyResult {
  isAnomaly: boolean;
  reason?: string;
}

export function detectAnomaly(amount: number, average: number, factor: number = 2): AnomalyResult {
  if (!isFinite(amount) || !isFinite(average)) return { isAnomaly: false };
  if (amount < 0 && Math.abs(amount) >= factor * Math.abs(average)) {
    return { isAnomaly: true, reason: `Amount ${Math.abs(amount).toFixed(0)} is ${factor}x above average ${Math.abs(average).toFixed(0)}` };
  }
  return { isAnomaly: false };
}
