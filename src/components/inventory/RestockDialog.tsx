import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { useInventory, InventoryItem } from "@/hooks/useInventory";

const restockSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

type RestockForm = z.infer<typeof restockSchema>;

interface RestockDialogProps {
  item: InventoryItem;
  children: React.ReactNode;
}

export const RestockDialog = ({ item, children }: RestockDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { restockItem } = useInventory();

  const form = useForm<RestockForm>({
    resolver: zodResolver(restockSchema),
    defaultValues: {
      quantity: 0,
    },
  });

  const onSubmit = async (values: RestockForm) => {
    setLoading(true);
    try {
      await restockItem(item.id, values.quantity);
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  const newTotal = item.current_stock + (form.watch("quantity") || 0);
  const newValue = newTotal * item.unit_cost;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Restock Item</DialogTitle>
          <DialogDescription>
            Add stock to {item.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">Current Stock:</span>
              <div className="font-medium">{item.current_stock} units</div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Current Value:</span>
              <div className="font-medium">₹{item.total_value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity to Add</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("quantity") > 0 && (
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">New Stock:</span>
                    <div className="font-medium">{newTotal} units</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">New Value:</span>
                    <div className="font-medium">₹{newValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !form.watch("quantity")}
                  className="flex-1"
                >
                  {loading ? "Restocking..." : "Restock"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};