import { ReactNode } from "react";
import { clsx } from "clsx";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: "primary" | "accent" | "blue" | "orange";
}

export function StatCard({ title, value, icon, trend, trendUp, color = "primary" }: StatCardProps) {
  const colorStyles = {
    primary: "bg-primary/5 text-primary",
    accent: "bg-accent/10 text-accent-foreground",
    blue: "bg-blue-500/10 text-blue-600",
    orange: "bg-orange-500/10 text-orange-600",
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold font-display mt-2 text-foreground">{value}</h3>
          
          {trend && (
            <p className={clsx("text-xs font-medium mt-1 flex items-center gap-1", 
              trendUp ? "text-green-600" : "text-red-500"
            )}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className={clsx("p-3 rounded-xl", colorStyles[color])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
