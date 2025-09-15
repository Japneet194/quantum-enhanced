export interface UserPayload { id: string; name: string; email: string; }
export interface LoginResponse { token: string; user: UserPayload }

export interface TransactionDto {
  _id: string;
  userId: string;
  merchant: string;
  amount: number;
  currency: string;
  category: string;
  timestamp: string;
  isAnomaly: boolean;
  anomalyReason?: string;
  carbonScore: number;
  status: 'pending' | 'verified' | 'flagged';
}

export interface CategoryPattern { category: string; avg: number; count: number }
