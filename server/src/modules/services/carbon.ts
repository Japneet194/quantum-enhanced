export function computeCarbonScore(category: string, amount: number): number {
  const cat = (category || '').toLowerCase();
  let base = 50;
  if (/fuel/.test(cat)) base = 90;
  else if (/utilities|energy|electric/.test(cat)) base = 70;
  else if (/shopping/.test(cat)) base = 60;
  else if (/food|restaurant|cafe/.test(cat)) base = 40;
  else if (/entertainment|game/.test(cat)) base = 30;
  const magnitude = Math.min(50, Math.max(0, Math.log10(Math.abs(amount) + 1) * 10));
  return Math.max(0, Math.min(100, Math.round((base + magnitude) / 2)));
}
