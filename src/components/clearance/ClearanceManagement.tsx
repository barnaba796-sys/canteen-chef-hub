import { useState } from "react";
import { Calendar, Clock, AlertTriangle, IndianRupee, Package2, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const mockClearanceItems = [
  {
    id: 1,
    name: "Chicken Sandwich",
    category: "Main Course",
    originalPrice: 120,
    discountedPrice: 80,
    expiryDate: "2024-01-16",
    stock: 8,
    shelfLife: 2, // days remaining
    status: "active",
    discount: 33
  },
  {
    id: 2,
    name: "Fresh Fruit Salad",
    category: "Healthy",
    originalPrice: 90,
    discountedPrice: 60,
    expiryDate: "2024-01-15",
    stock: 5,
    shelfLife: 1,
    status: "urgent",
    discount: 33
  },
  {
    id: 3,
    name: "Vegetable Curry",
    category: "Main Course",
    originalPrice: 100,
    discountedPrice: 50,
    expiryDate: "2024-01-17",
    stock: 12,
    shelfLife: 3,
    status: "scheduled",
    discount: 50
  }
];

export const ClearanceManagement = () => {
  const [items, setItems] = useState(mockClearanceItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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

  const totalRevenue = items.reduce((sum, item) => sum + (item.discountedPrice * item.stock), 0);
  const totalSavings = items.reduce((sum, item) => sum + ((item.originalPrice - item.discountedPrice) * item.stock), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clearance Sale</h1>
          <p className="text-muted-foreground">Manage expiring items and shelf life</p>
        </div>
        <Button className="gap-2">
          <Clock className="h-4 w-4" />
          Add to Clearance
        </Button>
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
                <p className="text-xl font-bold text-red-600">1</p>
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
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-card transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>{item.category}</CardDescription>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Price Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Original Price</p>
                    <p className="text-lg line-through text-muted-foreground">₹{item.originalPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Sale Price</p>
                    <p className="text-lg font-bold text-primary">₹{item.discountedPrice}</p>
                  </div>
                </div>

                {/* Discount Badge */}
                <div className="flex items-center justify-center">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {item.discount}% OFF
                  </Badge>
                </div>

                {/* Stock and Expiry */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Stock</p>
                    <p className="font-medium">{item.stock} units</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expiry</p>
                    <p className="font-medium">{new Date(item.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Shelf Life Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Shelf Life</p>
                    <p className={`text-sm font-medium ${getShelfLifeColor(item.shelfLife)}`}>
                      {item.shelfLife} day{item.shelfLife !== 1 ? 's' : ''} left
                    </p>
                  </div>
                  <Progress 
                    value={(item.shelfLife / 7) * 100} 
                    className={`h-2 ${item.shelfLife <= 1 ? 'bg-red-100' : item.shelfLife <= 2 ? 'bg-orange-100' : 'bg-green-100'}`}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit Price
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1">
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No clearance items found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "No items are currently on clearance sale"}
            </p>
            <Button>
              <Clock className="h-4 w-4 mr-2" />
              Add Items to Clearance
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};