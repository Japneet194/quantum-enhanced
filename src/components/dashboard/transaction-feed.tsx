import * as React from "react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, XCircle, Leaf, ShoppingCart, Car, Home, Gamepad2, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/useTransactions";
import { useApi } from "@/hooks/useApi";

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  category: string;
  timestamp: Date;
  isAnomaly: boolean;
  anomalyReason?: string;
  carbonScore: number;
  status: "pending" | "verified" | "flagged";
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    merchant: "Amazon India",
    amount: -15999,
    currency: "INR",
    category: "shopping",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isAnomaly: true,
    anomalyReason: "Amount 3x higher than average shopping spend",
    carbonScore: 85,
    status: "flagged"
  },
  {
    id: "2",
    merchant: "Shell Petrol Pump",
    amount: -3500,
    currency: "INR",
    category: "fuel",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isAnomaly: false,
    carbonScore: 95,
    status: "verified"
  },
  {
    id: "3",
    merchant: "Swiggy",
    amount: -450,
    currency: "INR",
    category: "food",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    isAnomaly: false,
    carbonScore: 30,
    status: "verified"
  },
  {
    id: "4",
    merchant: "BSES Delhi",
    amount: -2100,
    currency: "INR",
    category: "utilities",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isAnomaly: false,
    carbonScore: 70,
    status: "verified"
  },
  {
    id: "5",
    merchant: "Steam Games",
    amount: -2999,
    currency: "INR",
    category: "entertainment",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    isAnomaly: true,
    anomalyReason: "Unusual gaming purchase outside normal pattern",
    carbonScore: 10,
    status: "pending"
  }
];

const categoryIcons = {
  shopping: ShoppingCart,
  fuel: Car,
  food: Coffee,
  utilities: Home,
  entertainment: Gamepad2,
} as const;

const getCarbonColor = (score: number) => {
  if (score >= 80) return "text-danger";
  if (score >= 50) return "text-warning";
  return "text-success";
};

const formatAmount = (amount: number, currency: string) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  });
  return formatter.format(amount);
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffMinutes < 24 * 60) {
    return `${Math.floor(diffMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffMinutes / (24 * 60))}d ago`;
  }
};

export const TransactionFeed: React.FC = () => {
  const { items, loading, error } = useTransactions();
  const api = useApi();
  const feedItems: Transaction[] = useMemo(() => {
    if (items && items.length) {
      return items.map((t) => ({
        id: t._id,
        merchant: t.merchant,
        amount: t.amount,
        currency: t.currency,
        category: t.category,
        timestamp: new Date(t.timestamp),
        isAnomaly: t.isAnomaly,
        anomalyReason: t.anomalyReason,
        carbonScore: t.carbonScore ?? 50,
        status: t.status,
      }));
    }
    return mockTransactions;
  }, [items]);

  const updateStatus = async (id: string, status: 'verified' | 'flagged') => {
    try {
      await api.patch(`/transactions/${id}`, { status });
    } catch (e) { /* handled by WS refresh */ }
  };

  return (
    <Card id="feed" className="col-span-full lg:col-span-2 animate-slide-in-left">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          Live Transaction Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="text-sm text-danger">{String(error)}</div>}
        {feedItems.map((transaction, index) => {
          const CategoryIcon = categoryIcons[transaction.category as keyof typeof categoryIcons] || ShoppingCart;
          
          return (
            <div
              key={transaction.id}
              className={cn(
                "p-4 rounded-lg border transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer animate-slide-up group",
                transaction.isAnomaly 
                  ? "border-warning/30 bg-warning-light hover:border-warning/50 hover:shadow-warning/10" 
                  : "border-border bg-card hover:border-primary/20 hover:shadow-primary/10"
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {/* Icon & Category */}
                  <div className="p-2 rounded-lg bg-muted transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10">
                    <CategoryIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                  </div>
                  
                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold truncate transition-colors duration-300 group-hover:text-primary">{transaction.merchant}</h4>
                      <span className="font-bold text-lg transition-all duration-300 group-hover:scale-105">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`${badgeVariants({ variant: 'outline' })} text-xs`}>
                        {transaction.category}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(transaction.timestamp)}
                      </span>
                    </div>

                    {/* Anomaly Alert */}
                    {transaction.isAnomaly && transaction.anomalyReason && (
                      <div className="flex items-center gap-2 p-2 rounded bg-warning/10 border border-warning/20 mb-2 animate-bounce-in">
                        <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 animate-pulse" />
                        <span className="text-xs text-warning-foreground">
                          {transaction.anomalyReason}
                        </span>
                      </div>
                    )}

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Carbon Score */}
                        <div className="flex items-center gap-1 group/carbon transition-all duration-300 hover:scale-110">
                          <Leaf className={cn("w-3 h-3 transition-transform duration-300 group-hover/carbon:rotate-12", getCarbonColor(transaction.carbonScore))} />
                          <span className={cn("text-xs font-medium", getCarbonColor(transaction.carbonScore))}>
                            {transaction.carbonScore}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-1">
                          {transaction.status === "verified" && (
                            <CheckCircle className="w-3 h-3 text-success" />
                          )}
                          {transaction.status === "flagged" && (
                            <XCircle className="w-3 h-3 text-danger" />
                          )}
                          {transaction.status === "pending" && (
                            <div className="w-3 h-3 rounded-full bg-warning animate-pulse" />
                          )}
                          <span className="text-xs text-muted-foreground capitalize">
                            {transaction.status}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {transaction.isAnomaly && transaction.status !== "verified" && (
                        <div className="flex gap-2">
                          <button type="button" onClick={() => updateStatus(transaction.id, 'verified')} className={`${buttonVariants({ variant: 'outline', size: 'sm' })} h-6 px-2 text-xs transition-all duration-300 hover:scale-105 hover:bg-success/10 hover:text-success hover:border-success`}>
                            Verify
                          </button>
                          <button type="button" onClick={() => updateStatus(transaction.id, 'flagged')} className={`${buttonVariants({ variant: 'outline', size: 'sm' })} h-6 px-2 text-xs transition-all duration-300 hover:scale-105 hover:bg-danger/10 hover:text-danger hover:border-danger`}>
                            Flag
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="text-center py-4">
          <button type="button" className={`${buttonVariants({ variant: 'outline', size: 'sm' })} transition-all duration-300 hover:scale-105 hover:bg-primary/5`}>
            Load More Transactions
          </button>
        </div>
      </CardContent>
    </Card>
  );
};