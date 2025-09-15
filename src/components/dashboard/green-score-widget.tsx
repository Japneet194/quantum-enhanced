import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, TreePine, Recycle, Zap, TrendingUp, TrendingDown } from "lucide-react";

interface GreenMetric {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  trend: number;
  color: string;
}

const greenMetrics: GreenMetric[] = [
  {
    icon: <Leaf className="w-4 h-4" />,
    label: "Carbon Score",
    value: 72,
    unit: "pts",
    trend: -5.2,
    color: "text-success"
  },
  {
    icon: <TreePine className="w-4 h-4" />,
    label: "Trees Equivalent",
    value: 2.3,
    unit: "trees",
    trend: 12.1,
    color: "text-success"
  },
  {
    icon: <Recycle className="w-4 h-4" />,
    label: "Eco Purchases",
    value: 18,
    unit: "%",
    trend: 8.7,
    color: "text-success"
  },
  {
    icon: <Zap className="w-4 h-4" />,
    label: "Energy Impact",
    value: 45,
    unit: "kWh",
    trend: -15.3,
    color: "text-warning"
  }
];

const sustainableRecommendations = [
  {
    category: "Transport",
    suggestion: "Use public transport for trips >5km",
    impact: "Save ₹500/month, reduce 15kg CO₂"
  },
  {
    category: "Shopping",
    suggestion: "Choose local vendors over online",
    impact: "Support community, reduce 8kg CO₂"
  },
  {
    category: "Energy",
    suggestion: "Switch to renewable energy plans",
    impact: "Save ₹800/month, reduce 25kg CO₂"
  }
];

export const GreenScoreWidget: React.FC = () => {
  const overallScore = 72;
  const monthlyGoal = 80;
  const progress = (overallScore / monthlyGoal) * 100;

  return (
    <div className="grid gap-6 animate-slide-in-right">
      {/* Main Green Score Card */}
      <Card className="bg-gradient-to-br from-success/10 to-accent/5 border-success/20 transition-all duration-300 hover:shadow-xl hover:shadow-success/20 hover:-translate-y-1">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-success">
            <Leaf className="w-5 h-5 animate-float" />
            Environmental Impact Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Score Circle */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-8 border-success/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-success/20">
                <div className="text-center">
                  <div className="text-4xl font-bold text-success transition-all duration-500 group-hover:scale-125">{overallScore}</div>
                  <div className="text-sm text-muted-foreground">/ 100</div>
                </div>
              </div>
              {/* Progress arc overlay */}
              <svg className="absolute inset-0 w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="hsl(var(--success))"
                  strokeWidth="8"
                  strokeDasharray={`${(overallScore / 100) * 351.86} 351.86`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out animate-progress-fill"
                />
              </svg>
            </div>
          </div>

          {/* Progress to Goal */}
          <div className="space-y-2 mb-6 group">
            <div className="flex justify-between text-sm">
              <span className="transition-colors duration-300 group-hover:text-success">Monthly Goal Progress</span>
              <span className="font-medium transition-all duration-300 group-hover:scale-110">{overallScore}/{monthlyGoal}</span>
            </div>
            <Progress value={progress} className="h-2 transition-all duration-500 hover:h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Current: {overallScore}pts</span>
              <span>Target: {monthlyGoal}pts</span>
            </div>
          </div>

          {/* Action Button */}
          <Button className="w-full bg-success hover:bg-success/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-success/20">
            View Eco Insights
          </Button>
        </CardContent>
      </Card>

      {/* Green Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {greenMetrics.map((metric, index) => (
          <Card key={index} className="p-4 group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:shadow-success/10 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div className={`${metric.color} transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12`}>
                {metric.icon}
              </div>
              <Badge 
                variant={metric.trend > 0 ? "default" : "secondary"}
                className="text-xs transition-all duration-300 group-hover:scale-110"
              >
                {metric.trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(metric.trend)}%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold transition-all duration-300 group-hover:scale-105">
                {metric.value}<span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
              </p>
              <p className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">{metric.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Sustainable Recommendations */}
      <Card className="animate-fade-in" style={{ animationDelay: '500ms' }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-base transition-colors duration-300 hover:text-primary">💡 Smart Eco Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sustainableRecommendations.map((rec, index) => (
            <div key={index} className="p-3 rounded-lg bg-muted/50 space-y-2 group transition-all duration-300 hover:bg-muted/70 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs transition-all duration-300 group-hover:scale-105">
                  {rec.category}
                </Badge>
              </div>
              <p className="text-sm font-medium transition-colors duration-300 group-hover:text-primary">{rec.suggestion}</p>
              <p className="text-xs text-success transition-all duration-300 group-hover:font-medium">{rec.impact}</p>
            </div>
          ))}
          
          <Button variant="outline" size="sm" className="w-full mt-4 transition-all duration-300 hover:scale-105 hover:bg-success/5 hover:border-success">
            See All Recommendations
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};