import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Search, 
  Filter,
  Printer,
  MoreVertical
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    customerType: "staff",
    items: [
      { name: "Classic Burger", quantity: 2, price: 8.99 },
      { name: "Fries", quantity: 1, price: 3.99 },
      { name: "Coke", quantity: 1, price: 2.50 }
    ],
    total: 24.47,
    status: "preparing",
    timestamp: "2024-01-15 10:30 AM",
    estimatedTime: "5 mins"
  },
  {
    id: "ORD-002", 
    customer: "Sarah Smith",
    customerType: "student",
    items: [
      { name: "Chicken Sandwich", quantity: 1, price: 7.50 },
      { name: "Coffee", quantity: 1, price: 2.99 }
    ],
    total: 10.49,
    status: "ready",
    timestamp: "2024-01-15 10:25 AM",
    estimatedTime: "Ready"
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson", 
    customerType: "visitor",
    items: [
      { name: "Pizza Slice", quantity: 3, price: 4.99 },
      { name: "Soft Drink", quantity: 2, price: 2.25 }
    ],
    total: 19.47,
    status: "completed",
    timestamp: "2024-01-15 10:15 AM",
    estimatedTime: "Completed"
  },
  {
    id: "ORD-004",
    customer: "Emily Brown",
    customerType: "staff", 
    items: [
      { name: "Caesar Salad", quantity: 1, price: 6.99 },
      { name: "Fresh Juice", quantity: 1, price: 3.50 }
    ],
    total: 10.49,
    status: "cancelled",
    timestamp: "2024-01-15 10:10 AM",
    estimatedTime: "Cancelled"
  }
];

const statusFilters = ["All", "Preparing", "Ready", "Completed", "Cancelled"];

export const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || 
                         order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

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
      case "completed":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
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

  const getCustomerTypeBadge = (type: string) => {
    const colors = {
      staff: "bg-secondary text-secondary-foreground",
      student: "bg-accent text-accent-foreground", 
      visitor: "bg-muted text-muted-foreground"
    };
    return (
      <Badge className={colors[type as keyof typeof colors] || colors.visitor}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Order Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print Orders
          </Button>
          <Button className="bg-gradient-primary text-primary-foreground shadow-elegant">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search orders by ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((filter) => (
            <Button
              key={filter}
              variant={statusFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(filter)}
              className={statusFilter === filter ? "bg-gradient-primary text-primary-foreground" : ""}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="shadow-card hover:shadow-elegant transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">{order.customer}</span>
                      {getCustomerTypeBadge(order.customerType)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <h4 className="font-medium mb-2">Order Items:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.quantity * item.price).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total:</span>
                    <span className="font-semibold text-primary">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Time:</span>
                    <span className="text-muted-foreground">{order.timestamp}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>ETA:</span>
                    <span className="font-medium">{order.estimatedTime}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No orders found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
};