import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export const DashboardStats = () => {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-card">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "total earnings"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      description: "all time orders"
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders.toString(),
      change: "+2.1%",
      trend: "up",
      icon: Users,
      description: "orders today"
    },
    {
      title: "Menu Items",
      value: stats.activeMenuItems.toString(),
      change: "+0",
      trend: "up",
      icon: Package,
      description: "active items"
    }
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="shadow-card hover:shadow-elegant transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <stat.icon className="h-4 w-4 text-primary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge 
                variant={stat.trend === "up" ? "default" : "destructive"}
                className={cn(
                  "flex items-center gap-1",
                  stat.trend === "up" 
                    ? "bg-success text-success-foreground" 
                    : "bg-warning text-warning-foreground"
                )}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.change}
              </Badge>
              <span>{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}