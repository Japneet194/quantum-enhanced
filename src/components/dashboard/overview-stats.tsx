import * as React from "react";
import { useMemo } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, AlertTriangle, Smartphone, MoreHorizontal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAnomalies } from "@/hooks/useAnomalies";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { downloadText } from "@/lib/download";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";

export const OverviewStats: React.FC = () => {
  const { patterns, loading: loadingPatterns } = useAnalytics();
  const { items: anomalies } = useAnomalies();
  const api = useApi();
  const { toast } = useToast();

  const monthlySpending = useMemo(() => {
    if (!patterns.length) return { value: 0, variance: 0 };
    const total = patterns.reduce((sum, p) => sum + Math.max(0, p.avg * p.count), 0);
    const expected = patterns.reduce((sum, p) => sum + Math.max(0, p.avg) * p.count, 0);
    const variance = expected ? ((total - expected) / expected) * 100 : 0;
    return { value: total, variance };
  }, [patterns]);

  const anomaliesCount = anomalies.length;

  async function exportTransactionsCsv() {
    try {
      const base = getApiBaseUrl();
      const token = localStorage.getItem('qeads_token');
      const res = await fetch(`${base}/transactions`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : { 'X-Dev-User-Id': 'demo-user' }),
        },
      });
      if (!res.ok) throw new Error(await res.text());
      const data: any[] = await res.json();
      const headers = ['date','merchant','amount','currency','category','status','isAnomaly'];
      const rows = data.map((t) => [
        new Date(t.timestamp).toISOString().slice(0,10),
        (t.merchant||'').toString().replace(/,/g,' '),
        t.amount,
        t.currency,
        t.category,
        t.status,
        t.isAnomaly,
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      downloadText(`qeads-transactions-${Date.now()}.csv`, csv, 'text/csv');
      toast({ title: 'Exported CSV', description: `Saved ${rows.length} transactions.` });
    } catch (e: any) {
      toast({ title: 'Export failed', description: e.message || 'Could not export transactions', variant: 'destructive' });
    }
  }

  function scrollToFeed() {
    const el = document.getElementById('feed');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
        {/* Total Balance */}
  <StatCard
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
              <button type="button" className={`${buttonVariants({ variant: 'ghost', size: 'sm' })} h-8 w-8 p-0 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10`}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={scrollToFeed}>View Details</DropdownMenuItem>
              <DropdownMenuItem onClick={exportTransactionsCsv}>Export Data</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: 'Alerts enabled', description: 'We will notify you on large deviations and anomalies.' })}>Set Alerts</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        {/* Monthly Spending */}
  <StatCard
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
        title="Anomalies Detected"
        value={String(anomaliesCount)}
        subtitle="Last 30 days"
        icon={<AlertTriangle className="w-5 h-5" />}
        action={
          <button type="button" className={`${buttonVariants({ variant: 'outline', size: 'sm' })} h-7 px-3 text-xs border-warning/30 text-warning hover:bg-warning/10`}>
            Review
          </button>
        }
        />
      </div>
    </div>
  );
};