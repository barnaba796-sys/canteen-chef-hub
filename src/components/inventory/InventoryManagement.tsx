import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Search, 
  TrendingDown,
  TrendingUp,
  Calendar,
  Edit
} from "lucide-react";
import { useState } from "react";
import { AddInventoryItemDialog } from "./AddInventoryItemDialog";

const inventoryItems = [
  {
    id: 1,
    name: "Ground Beef",
    category: "Meat",
    currentStock: 2.5,
    minStock: 5,
    maxStock: 25,
    unit: "kg",
    costPerUnit: 550,
    supplier: "Fresh Foods Co.",
    lastRestocked: "2024-01-10",
    expiryDate: "2024-01-20",
    status: "low_stock"
  },
  {
    id: 2,
    name: "Chicken Breast",
    category: "Meat", 
    currentStock: 10,
    minStock: 7,
    maxStock: 30,
    unit: "kg",
    costPerUnit: 680,
    supplier: "Fresh Foods Co.",
    lastRestocked: "2024-01-12",
    expiryDate: "2024-01-25",
    status: "normal"
  },
  {
    id: 3,
    name: "Fresh Lettuce",
    category: "Vegetables",
    currentStock: 2,
    minStock: 8,
    maxStock: 30,
    unit: "heads",
    costPerUnit: 2.50,
    supplier: "Green Valley Farms",
    lastRestocked: "2024-01-08",
    expiryDate: "2024-01-18",
    status: "critical"
  },
  {
    id: 4,
    name: "Burger Buns",
    category: "Bakery",
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    unit: "pcs",
    costPerUnit: 0.75,
    supplier: "City Bakery",
    lastRestocked: "2024-01-13",
    expiryDate: "2024-01-16",
    status: "expiring_soon"
  },
  {
    id: 5,
    name: "Tomatoes",
    category: "Vegetables",
    currentStock: 8,
    minStock: 5,
    maxStock: 20,
    unit: "kg",
    costPerUnit: 260,
    supplier: "Green Valley Farms",
    lastRestocked: "2024-01-11",
    expiryDate: "2024-01-22",
    status: "normal"
  }
];

const categories = ["All", "Meat", "Vegetables", "Bakery", "Dairy", "Beverages"];

export const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState(inventoryItems);

  const handleAddItem = (item: any) => {
    const newItem = {
      ...item,
      id: items.length + 1,
      lastRestocked: new Date().toISOString().split('T')[0],
      status: "normal",
    };
    setItems([...items, newItem]);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return (
          <Badge className="bg-destructive text-destructive-foreground">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical
          </Badge>
        );
      case "low_stock":
        return (
          <Badge className="bg-warning text-warning-foreground">
            <TrendingDown className="h-3 w-3 mr-1" />
            Low Stock
          </Badge>
        );
      case "expiring_soon":
        return (
          <Badge className="bg-accent-light text-accent-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            Expiring Soon
          </Badge>
        );
      case "normal":
        return (
          <Badge className="bg-success text-success-foreground">
            <TrendingUp className="h-3 w-3 mr-1" />
            Normal
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStockPercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  const getProgressColor = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100;
    if (current <= min * 0.5) return "bg-destructive";
    if (current <= min) return "bg-warning";
    return "bg-success";
  };

  const criticalItems = inventoryItems.filter(item => item.status === "critical").length;
  const lowStockItems = inventoryItems.filter(item => item.status === "low_stock").length;
  const expiringItems = inventoryItems.filter(item => item.status === "expiring_soon").length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Inventory Management</h2>
        <AddInventoryItemDialog onAddItem={handleAddItem} />
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
              <div className="h-10 w-10 bg-accent rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-foreground">{expiringItems}</p>
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
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                  <Button variant="ghost" size="icon" onClick={() => console.log('Edit item:', item.id)}>
                    <Edit className="h-4 w-4" />
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
                        <span>{item.currentStock} / {item.maxStock} {item.unit}</span>
                      </div>
                      <Progress 
                        value={getStockPercentage(item.currentStock, item.maxStock)} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Min: {item.minStock}</span>
                        <span>Max: {item.maxStock}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Cost/Unit:</span>
                      <span className="font-medium">₹{item.costPerUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Value:</span>
                      <span className="font-medium text-primary">
                        ₹{(item.currentStock * item.costPerUnit).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Restocked:</span>
                      <span className="text-muted-foreground">{item.lastRestocked}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Expiry Date:</span>
                      <span className={item.status === "expiring_soon" ? "text-warning font-medium" : "text-muted-foreground"}>
                        {item.expiryDate}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => console.log('Restock item:', item.id)}>
                        Restock
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => console.log('Update item:', item.id)}>
                        Update
                      </Button>
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
    </div>
  );
};