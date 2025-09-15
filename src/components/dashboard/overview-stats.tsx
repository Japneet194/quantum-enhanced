import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, AlertTriangle, Smartphone, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const OverviewStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Balance */}
      <StatCard
        variant="primary"
        title="Total Balance"
        value="₹2,45,670"
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

      {/* Monthly Spending */}
      <StatCard
        variant="elevated"
        title="Monthly Spending"
        value="₹48,920"
        subtitle="February 2024"
        icon={<CreditCard className="w-5 h-5" />}
        trend={{
          value: 12.5,
          isPositive: false,
          label: "above average"
        }}
      />

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

      {/* Anomalies Detected */}
      <StatCard
        variant="warning"
        title="Anomalies Detected"
        value="3"
        subtitle="Requiring attention"
        icon={<AlertTriangle className="w-5 h-5" />}
        action={
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-warning/30 text-warning hover:bg-warning/10">
            Review
          </Button>
        }
      />
    </div>
  );
};