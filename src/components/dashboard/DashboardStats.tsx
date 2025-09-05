import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Users, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "Total Revenue",
    value: "₹12,480",
    change: "+12.5%",
    trend: "up",
    icon: IndianRupee,
    description: "vs last month"
  },
  {
    title: "Orders Today",
    value: "248",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    description: "vs yesterday"
  },
  {
    title: "Active Customers",
    value: "1,420",
    change: "+2.1%",
    trend: "up",
    icon: Users,
    description: "this week"
  },
  {
    title: "Low Stock Items",
    value: "12",
    change: "-3",
    trend: "down",
    icon: Package,
    description: "items need restock"
  }
];

export const DashboardStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
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