import * as React from "react";
import { Header } from "@/components/layout/header";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { TransactionFeed } from "@/components/dashboard/transaction-feed";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { GreenScoreWidget } from "@/components/dashboard/green-score-widget";
import { CsvUploadWidget } from "@/components/dashboard/csv-upload";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2 animate-fade-in">
          <h2 className="text-3xl font-bold tracking-tight transition-all duration-500 hover:text-primary hover:scale-105">
            Good morning, Arjun!
          </h2>
          <p className="text-muted-foreground transition-colors duration-300 hover:text-foreground">
            Here's your financial overview and recent anomaly detections
          </p>
        </div>

        {/* Overview Stats */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <OverviewStats />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Side - Charts and Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Spending Chart */}
            <div className="animate-scale-in" style={{ animationDelay: '400ms' }}>
              <SpendingChart />
            </div>
            
            {/* Transaction Feed */}
            <div className="animate-slide-in-left" style={{ animationDelay: '600ms' }}>
              <TransactionFeed />
            </div>
          </div>

          {/* Right Side - Green Score Widget */}
          <div className="lg:col-span-1">
            <div className="animate-slide-in-right" style={{ animationDelay: '800ms' }}>
              <GreenScoreWidget />
            </div>
            <div className="mt-6 animate-slide-in-right" style={{ animationDelay: '1000ms' }}>
              <CsvUploadWidget />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t animate-fade-in transition-all duration-300 hover:text-foreground" style={{ animationDelay: '1000ms' }}>
          <p className="transition-all duration-300 hover:scale-105">
            QEADS v2.1.0 | AI-Powered Financial Monitoring | Last sync: 2 minutes ago
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
