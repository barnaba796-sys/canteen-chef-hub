import { useState, useEffect } from "react";
import { Calendar, Clock, AlertTriangle, IndianRupee, Package2, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToClearanceDialog } from "./AddToClearanceDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useInventory } from "@/hooks/useInventory";

export const ClearanceManagement = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { fetchClearanceItems, updateInventoryItem } = useInventory();
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const loadClearanceItems = async () => {
      setIsLoading(true);
      const clearanceItems = await fetchClearanceItems();
      setItems(clearanceItems);
      setIsLoading(false);
    };
    loadClearanceItems();
  }, [fetchClearanceItems]);


  const handleAddItem = (item: any) => {
    // This should ideally be handled by the backend, by setting is_on_clearance to true
    // and setting a discounted price. For now, we will just log it.
    console.log("Adding item to clearance:", item);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || getStatus(item) === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatus = (item: any) => {
    if (item.expiry_date && new Date(item.expiry_date) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)) return "urgent";
    return "active";
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent": return "bg-red-100 text-red-800";
      case "active": return "bg-orange-100 text-orange-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getShelfLifeColor = (days: number) => {
    if (days <= 1) return "text-red-600";
    if (days <= 2) return "text-orange-600";
    return "text-green-600";
  };

  const totalRevenue = items.reduce((sum, item) => sum + (item.cost_per_unit * 0.8 * item.current_stock), 0); // Assuming 20% discount
  const totalSavings = items.reduce((sum, item) => sum + (item.cost_per_unit * 0.2 * item.current_stock), 0); // Assuming 20% discount

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clearance Sale</h1>
          <p className="text-muted-foreground">Manage expiring items and shelf life</p>
        </div>
        <AddToClearanceDialog onAddItem={handleAddItem} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgent Items</p>
                <p className="text-xl font-bold text-red-600">{items.filter(item => getStatus(item) === 'urgent').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package2 className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-xl font-bold">{items.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Potential Revenue</p>
                <p className="text-xl font-bold">₹{totalRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer Savings</p>
                <p className="text-xl font-bold">₹{totalSavings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? <p>Loading clearance items...</p> : filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-card transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>{item.category}</CardDescription>
                </div>
                <Badge className={getStatusColor(getStatus(item))}>
                  {getStatus(item)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Price Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Original Price</p>
                    <p className="text-lg line-through text-muted-foreground">₹{item.cost_per_unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Sale Price</p>
                    <p className="text-lg font-bold text-primary">₹{(item.cost_per_unit * 0.8).toFixed(2)}</p>
                  </div>
                </div>

                {/* Discount Badge */}
                <div className="flex items-center justify-center">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    20% OFF
                  </Badge>
                </div>

                {/* Stock and Expiry */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Stock</p>
                    <p className="font-medium">{item.current_stock} {item.unit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expiry</p>
                    <p className="font-medium">{item.expiry_date ? new Date(item.expiry_date).toLocaleDateString('en-IN') : 'N/A'}</p>
                  </div>
                </div>

                {/* Shelf Life Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Shelf Life</p>
                    <p className={`text-sm font-medium ${getShelfLifeColor(item.expiry_date ? Math.ceil((new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 99)}`}>
                      {item.expiry_date ? `${Math.ceil((new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} days left` : 'N/A'}
                    </p>
                  </div>
                  <Progress 
                    value={item.expiry_date ? (Math.ceil((new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) / 7) * 100 : 100}
                    className={`h-2 ${item.expiry_date && new Date(item.expiry_date) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) ? 'bg-red-100' : 'bg-green-100'}`}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => console.log('Edit price for item:', item.id)}>
                    Edit Price
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1" onClick={() => updateInventoryItem(item.id, { is_on_clearance: false })}>
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No clearance items found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "No items are currently on clearance sale"}
            </p>
            <AddToClearanceDialog onAddItem={handleAddItem} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};