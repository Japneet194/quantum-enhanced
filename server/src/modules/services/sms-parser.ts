// Very simple SMS parser for common Indian bank SMS formats.
// This is a heuristic. In production, consider a rules engine.

export interface ParsedSmsTx {
  merchant: string;
  amount: number;
  currency: string;
  category: string;
  timestamp: Date;
  raw: string;
}

export function parseBankSms(sms: string): ParsedSmsTx | null {
  // Try patterns: "INR XXXX debited at MERCHANT" or "spent Rs.XXXX at MERCHANT"
  const patterns: Array<(s: string) => ParsedSmsTx | null> = [
    (s) => {
      const m = s.match(/INR\s*(\d+[\d,]*\.?\d*)\s*(debited|spent)\s*(?:at|in)\s*([A-Za-z0-9 &.-]+)/i);
      if (!m) return null;
      const amount = Number(m[1].replace(/,/g, ''));
      const merchant = m[3].trim();
      return { merchant, amount: -amount, currency: 'INR', category: guessCategory(merchant), timestamp: new Date(), raw: s };
    },
    (s) => {
      const m = s.match(/Rs\.?\s*(\d+[\d,]*\.?\d*)\s*(?:spent|debited)\s*(?:at|in)\s*([A-Za-z0-9 &.-]+)/i);
      if (!m) return null;
      const amount = Number(m[1].replace(/,/g, ''));
      const merchant = m[2].trim();
      return { merchant, amount: -amount, currency: 'INR', category: guessCategory(merchant), timestamp: new Date(), raw: s };
    }
  ];

  for (const p of patterns) {
    const tx = p(sms);
    if (tx) return tx;
  }
  return null;
}

function guessCategory(merchant: string): string {
  const m = merchant.toLowerCase();
  if (/(amazon|flipkart|myntra|store|mart)/.test(m)) return 'shopping';
  if (/(petrol|hpcl|bpcl|shell|fuel)/.test(m)) return 'fuel';
  if (/(swiggy|zomato|cafe|restaurant|food)/.test(m)) return 'food';
  if (/(bses|tata power|electric|bill|utilities)/.test(m)) return 'utilities';
  if (/(netflix|steam|game|entertainment)/.test(m)) return 'entertainment';
  return 'other';
}
