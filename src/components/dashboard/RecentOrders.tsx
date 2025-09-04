import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Clock, CheckCircle, XCircle } from "lucide-react";

const orders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    items: "2x Burger, 1x Fries, 1x Coke",
    total: "$15.99",
    status: "preparing",
    time: "5 min ago"
  },
  {
    id: "#ORD-002",
    customer: "Sarah Smith",
    items: "1x Sandwich, 1x Coffee",
    total: "$8.50",
    status: "ready",
    time: "8 min ago"
  },
  {
    id: "#ORD-003",
    customer: "Mike Johnson",
    items: "3x Pizza Slice, 2x Drinks",
    total: "$22.00",
    status: "delivered",
    time: "12 min ago"
  },
  {
    id: "#ORD-004",
    customer: "Emily Brown",
    items: "1x Salad, 1x Juice",
    total: "$12.75",
    status: "cancelled",
    time: "15 min ago"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "preparing":
      return (
        <Badge className="bg-warning text-warning-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Preparing
        </Badge>
      );
    case "ready":
      return (
        <Badge className="bg-primary text-primary-foreground">
          <CheckCircle className="h-3 w-3 mr-1" />
          Ready
        </Badge>
      );
    case "delivered":
      return (
        <Badge className="bg-success text-success-foreground">
          <CheckCircle className="h-3 w-3 mr-1" />
          Delivered
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-destructive text-destructive-foreground">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export const RecentOrders = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Orders
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{order.id}</span>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-muted-foreground">{order.customer}</p>
                <p className="text-xs text-muted-foreground">{order.items}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">{order.total}</p>
                <p className="text-xs text-muted-foreground">{order.time}</p>
                <Button variant="ghost" size="sm" className="mt-1">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};