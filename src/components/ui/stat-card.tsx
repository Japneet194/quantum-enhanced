import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statCardVariants = cva(
  "relative overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:scale-105 cursor-pointer group animate-scale-in",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border",
        primary: "bg-gradient-primary text-primary-foreground border-primary/20 shadow-lg",
        success: "bg-success text-success-foreground border-success/20",
        warning: "bg-warning text-warning-foreground border-warning/20",
        danger: "bg-danger text-danger-foreground border-danger/20",
        elevated: "bg-card text-card-foreground border-border card-elevated",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  action?: React.ReactNode;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, variant, size, title, value, subtitle, icon, trend, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(statCardVariants({ variant, size }), className)}
        {...props}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-80" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
                  {icon}
                </div>
              )}
              <div>
                <p className="text-sm font-medium opacity-80 transition-all duration-300 group-hover:opacity-100">{title}</p>
                {subtitle && (
                  <p className="text-xs opacity-60 mt-1 transition-all duration-300 group-hover:opacity-80">{subtitle}</p>
                )}
              </div>
            </div>
            {action}
          </div>

          {/* Value */}
          <div className="mb-3">
            <p className="text-3xl font-bold tracking-tight transition-all duration-300 group-hover:scale-110">{value}</p>
          </div>

          {/* Trend */}
          {trend && (
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                trend.isPositive 
                  ? "bg-success/20 text-success" 
                  : "bg-danger/20 text-danger"
              )}>
                <span>{trend.isPositive ? "↗" : "↘"}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
              {trend.label && (
                <span className="text-xs opacity-60">{trend.label}</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

export { StatCard, statCardVariants };