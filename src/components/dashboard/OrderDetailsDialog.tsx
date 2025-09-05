import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Order = {
  id: string;
  customer: string;
  items: string;
  total: string;
  status: string;
  time: string;
};

interface OrderDetailsDialogProps {
  order: Order;
  onOpenChange: (open: boolean) => void;
}

export const OrderDetailsDialog = ({ order, onOpenChange }: OrderDetailsDialogProps) => {
  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Details for order {order.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Customer</h4>
            <p>{order.customer}</p>
          </div>
          <div>
            <h4 className="font-semibold">Items</h4>
            <p>{order.items}</p>
          </div>
          <div>
            <h4 className="font-semibold">Total</h4>
            <p>{order.total}</p>
          </div>
          <div>
            <h4 className="font-semibold">Status</h4>
            <Badge>{order.status}</Badge>
          </div>
          <div>
            <h4 className="font-semibold">Time</h4>
            <p>{order.time}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
