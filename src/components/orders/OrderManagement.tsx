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
  MoreVertical,
  Users,
  Phone
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrders } from "@/hooks/useOrders";
import { OrderStatusDialog } from "./OrderStatusDialog";

const statusFilters = ["All", "pending", "preparing", "ready", "completed", "cancelled"];

export const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { orders, loading } = useOrders();

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customer_phone && order.customer_phone.includes(searchTerm));
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500 text-white", icon: Clock, label: "Pending" },
      preparing: { color: "bg-blue-500 text-white", icon: Clock, label: "Preparing" },
      ready: { color: "bg-green-500 text-white", icon: CheckCircle, label: "Ready" },
      completed: { color: "bg-green-600 text-white", icon: CheckCircle, label: "Completed" },
      cancelled: { color: "bg-red-500 text-white", icon: XCircle, label: "Cancelled" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getCustomerTypeBadge = (type: string) => {
    const colors = {
      dine_in: "bg-blue-100 text-blue-800",
      takeaway: "bg-green-100 text-green-800",
      delivery: "bg-purple-100 text-purple-800",
    };
    return (
      <Badge className={colors[type as keyof typeof colors] || colors.dine_in}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Order Management</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

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
              {filter === "All" ? filter : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="shadow-card hover:shadow-elegant transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">#{order.id.slice(-6)}</CardTitle>
                    {getCustomerTypeBadge(order.order_type)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{order.customer_name || 'Walk-in Customer'}</span>
                    {order.customer_phone && (
                      <>
                        <Phone className="h-4 w-4 ml-2" />
                        <span>{order.customer_phone}</span>
                      </>
                    )}
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
                    {order.order_items?.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.quantity}x {item.menu_items?.name || 'Item'}</span>
                        <span>${item.total_price}</span>
                      </li>
                    )) || (
                      <li className="text-muted-foreground">No items</li>
                    )}
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total:</span>
                    <span className="font-semibold text-primary">${order.total_amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Time:</span>
                    <span className="text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment:</span>
                    <span className="font-medium">{order.payment_method || 'Cash'}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <OrderStatusDialog order={order}>
                      <Button variant="outline" size="sm" className="flex-1">
                        Update Status
                      </Button>
                    </OrderStatusDialog>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              {order.notes && (
                <div className="mt-3 text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                  <strong>Notes:</strong> {order.notes}
                </div>
              )}
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