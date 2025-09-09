import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, AlertTriangle, Package, TrendingDown, Edit, Trash2, Calendar } from "lucide-react";
import { useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import { AddInventoryDialog } from "./AddInventoryDialog";
import { RestockDialog } from "./RestockDialog";
import { EditInventoryDialog } from "./EditInventoryDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingItem, setEditingItem] = useState<any>(null);
  const { inventoryItems, loading, deleteInventoryItem } = useInventory();

  const categories = ["All", ...Array.from(new Set(inventoryItems.map(item => item.category)))];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate quick stats
  const criticalItems = inventoryItems.filter(item => item.status === 'out_of_stock').length;
  const lowStockItems = inventoryItems.filter(item => item.status === 'low_stock').length;
  const expiringSoonItems = inventoryItems.filter(item => item.status === 'expiring_soon' || item.status === 'expired').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <Badge className="bg-success text-success-foreground">In Stock</Badge>;
      case 'low_stock':
        return (
          <Badge className="bg-warning text-warning-foreground">
            <TrendingDown className="h-3 w-3 mr-1" />
            Low Stock
          </Badge>
        );
      case 'out_of_stock':
        return (
          <Badge className="bg-destructive text-destructive-foreground">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Out of Stock
          </Badge>
        );
      case 'expiring_soon':
        return (
          <Badge className="bg-orange-500 text-white">
            <Calendar className="h-3 w-3 mr-1" />
            Expiring Soon
          </Badge>
        );
      case 'expired':
        return <Badge className="bg-red-600 text-white">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStockPercentage = (current: number, min: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  const getProgressColor = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100;
    if (current === 0) return "bg-destructive";
    if (current <= min) return "bg-warning";
    if (percentage >= 80) return "bg-success";
    return "bg-primary";
  };

  const handleDelete = async (itemId: string) => {
    await deleteInventoryItem(itemId);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Inventory Management</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Inventory Management</h2>
        <AddInventoryDialog />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-destructive rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{criticalItems}</p>
                <p className="text-sm text-muted-foreground">Critical Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-warning rounded-lg flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-warning-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{lowStockItems}</p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{expiringSoonItems}</p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search inventory items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-gradient-primary text-primary-foreground" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="shadow-card hover:shadow-elegant transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    {item.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{item.category} • {item.supplier}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  )}
                </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stock Level</span>
                        <span>{item.current_stock} / {item.max_stock}</span>
                      </div>
                      <Progress 
                        value={getStockPercentage(item.current_stock, item.min_stock, item.max_stock)} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Min: {item.min_stock}</span>
                        <span>Max: {item.max_stock}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Cost/Unit:</span>
                      <span className="font-medium">₹{item.unit_cost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Value:</span>
                      <span className="font-medium text-primary">
                        ₹{item.total_value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Restocked:</span>
                      <span className="text-muted-foreground">{item.last_restocked || 'Never'}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Expiry Date:</span>
                      <span className={item.status === "expiring_soon" ? "text-warning font-medium" : "text-muted-foreground"}>
                        {item.expiry_date || 'N/A'}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <RestockDialog item={item}>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Package className="h-3 w-3 mr-1" />
                          Restock
                        </Button>
                      </RestockDialog>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditingItem(item)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Update
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Inventory Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No inventory items found matching your criteria.</p>
        </Card>
      )}

      {editingItem && (
        <EditInventoryDialog
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
        />
      )}
    </div>
  );
};