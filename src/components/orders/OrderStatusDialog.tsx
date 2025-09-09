import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrders, Order } from "@/hooks/useOrders";
import { Clock, CheckCircle, XCircle, Truck } from "lucide-react";

interface OrderStatusDialogProps {
  order: Order;
  children: React.ReactNode;
}

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-500' },
  { value: 'preparing', label: 'Preparing', icon: Clock, color: 'bg-blue-500' },
  { value: 'ready', label: 'Ready', icon: CheckCircle, color: 'bg-green-500' },
  { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'bg-green-600' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-500' },
];

export const OrderStatusDialog = ({ order, children }: OrderStatusDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const { updateOrderStatus } = useOrders();

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) {
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      await updateOrderStatus(order.id, selectedStatus);
      setOpen(false);
    } catch (error) {
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStatusInfo = () => {
    return statusOptions.find(s => s.value === selectedStatus) || statusOptions[0];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Update the status for order #{order.id.slice(-6)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Status</label>
            <Badge className={`${getCurrentStatusInfo().color} text-white`}>
              {getCurrentStatusInfo().label}
            </Badge>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => {
                  const Icon = status.icon;
                  return (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {status.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg p-3 bg-muted/30">
            <h4 className="font-medium mb-2">Order Details</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Customer: {order.customer_name || 'Walk-in Customer'}</p>
              <p>Total: ₹{order.total_amount}</p>
              <p>Type: {order.order_type}</p>
              {order.order_items && (
                <p>Items: {order.order_items.length} item(s)</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate} 
              disabled={loading || selectedStatus === order.status}
              className="flex-1"
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};