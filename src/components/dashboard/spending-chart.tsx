import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const mockSpendingData = [
  { day: "Mon", normal: 1200, actual: 1350, anomaly: false },
  { day: "Tue", normal: 1400, actual: 1200, anomaly: false },
  { day: "Wed", normal: 1100, actual: 2800, anomaly: true },
  { day: "Thu", normal: 1300, actual: 1450, anomaly: false },
  { day: "Fri", normal: 1600, actual: 1520, anomaly: false },
  { day: "Sat", normal: 2200, actual: 1890, anomaly: false },
  { day: "Sun", normal: 1800, actual: 1750, anomaly: false },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="capitalize">{entry.dataKey}:</span>
            <span className="font-medium">₹{entry.value.toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const SpendingChart: React.FC = () => {
  const totalActual = mockSpendingData.reduce((sum, day) => sum + day.actual, 0);
  const totalNormal = mockSpendingData.reduce((sum, day) => sum + day.normal, 0);
  const anomalies = mockSpendingData.filter(day => day.anomaly).length;
  const variance = ((totalActual - totalNormal) / totalNormal) * 100;

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Spending Pattern Analysis</CardTitle>
          <div className="flex items-center gap-2">
            {variance > 10 && (
              <Badge className={`${badgeVariants({ variant: 'destructive' })} gap-1`}>
                <AlertTriangle className="w-3 h-3" />
                High Variance
              </Badge>
            )}
            <Badge className={`${badgeVariants({ variant: 'outline' })} gap-1`}>
              {variance > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(variance).toFixed(1)}%
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>Normal Pattern</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger"></div>
            <span>Actual Spending</span>
          </div>
          <div className="text-warning font-medium">
            {anomalies} anomal{anomalies === 1 ? 'y' : 'ies'} detected
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockSpendingData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="normalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--danger))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--danger))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                className="text-xs"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Normal spending area */}
              <Area
                type="monotone"
                dataKey="normal"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#normalGradient)"
              />
              
              {/* Actual spending line */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--danger))"
                strokeWidth={3}
                dot={(props: any) => {
                  const isAnomaly = mockSpendingData[props.payload?.index]?.anomaly;
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={isAnomaly ? 8 : 4}
                      fill={isAnomaly ? "hsl(var(--warning))" : "hsl(var(--danger))"}
                      stroke={isAnomaly ? "hsl(var(--warning-foreground))" : "hsl(var(--danger))"}
                      strokeWidth={isAnomaly ? 2 : 0}
                      className={isAnomaly ? "animate-pulse-glow" : ""}
                    />
                  );
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-danger">
              ₹{totalActual.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              ₹{totalNormal.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-muted-foreground">Expected</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${variance > 0 ? 'text-danger' : 'text-success'}`}>
              {variance > 0 ? '+' : ''}₹{Math.abs(totalActual - totalNormal).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-muted-foreground">Difference</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};