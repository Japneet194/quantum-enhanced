import * as React from "react";
import { useMemo } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, AlertTriangle, Smartphone, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAnomalies } from "@/hooks/useAnomalies";

export const OverviewStats: React.FC = () => {
  const { patterns, loading: loadingPatterns } = useAnalytics();
  const { items: anomalies } = useAnomalies();

  const monthlySpending = useMemo(() => {
    if (!patterns.length) return { value: 0, variance: 0 };
    const total = patterns.reduce((sum, p) => sum + Math.max(0, p.avg * p.count), 0);
    const expected = patterns.reduce((sum, p) => sum + Math.max(0, p.avg) * p.count, 0);
    const variance = expected ? ((total - expected) / expected) * 100 : 0;
    return { value: total, variance };
  }, [patterns]);

  const anomaliesCount = anomalies.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
        {/* Total Balance */}
        <StatCard
        variant="primary"
        title="Total Balance"
        value={"₹" + (245670).toLocaleString('en-IN')}
        subtitle="Across all accounts"
        icon={<DollarSign className="w-5 h-5" />}
        trend={{
          value: 8.2,
          isPositive: true,
          label: "vs last month"
        }}
        action={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuItem>Set Alerts</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        {/* Monthly Spending */}
        <StatCard
        variant="elevated"
        title="Monthly Spending"
        value={loadingPatterns ? "Loading..." : "₹" + Math.abs(monthlySpending.value).toLocaleString('en-IN')}
        subtitle="Last 30 days"
        icon={<CreditCard className="w-5 h-5" />}
        trend={{
          value: Number.isFinite(monthlySpending.variance) ? Number(monthlySpending.variance.toFixed(1)) : 0,
          isPositive: (monthlySpending.variance ?? 0) < 0,
          label: (monthlySpending.variance ?? 0) > 0 ? "above average" : "below average"
        }}
        />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        {/* Savings Goal */}
        <StatCard
        variant="success"
        title="Savings Goal"
        value="₹75,000"
        subtitle="Emergency Fund"
        icon={<PiggyBank className="w-5 h-5" />}
        trend={{
          value: 15.3,
          isPositive: true,
          label: "progress this month"
        }}
        />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        {/* Anomalies Detected */}
        <StatCard
        variant="warning"
        title="Anomalies Detected"
        value={String(anomaliesCount)}
        subtitle="Last 30 days"
        icon={<AlertTriangle className="w-5 h-5" />}
        action={
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-warning/30 text-warning hover:bg-warning/10">
            Review
          </Button>
        }
        />
      </div>
    </div>
  );
};