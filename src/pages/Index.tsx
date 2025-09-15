import React from "react";
import { Header } from "@/components/layout/header";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { TransactionFeed } from "@/components/dashboard/transaction-feed";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { GreenScoreWidget } from "@/components/dashboard/green-score-widget";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Good morning, Arjun!</h2>
          <p className="text-muted-foreground">
            Here's your financial overview and recent anomaly detections
          </p>
        </div>

        {/* Overview Stats */}
        <OverviewStats />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Side - Charts and Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Spending Chart */}
            <SpendingChart />
            
            {/* Transaction Feed */}
            <TransactionFeed />
          </div>

          {/* Right Side - Green Score Widget */}
          <div className="lg:col-span-1">
            <GreenScoreWidget />
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>QEADS v2.1.0 | AI-Powered Financial Monitoring | Last sync: 2 minutes ago</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
