import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, DollarSign, Package } from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    category: "Main Course",
    price: 8.99,
    stock: 25,
    status: "available",
    image: "/api/placeholder/100/100"
  },
  {
    id: 2,
    name: "Chicken Sandwich",
    category: "Main Course", 
    price: 7.50,
    stock: 18,
    status: "available",
    image: "/api/placeholder/100/100"
  },
  {
    id: 3,
    name: "Caesar Salad",
    category: "Salads",
    price: 6.99,
    stock: 12,
    status: "available",
    image: "/api/placeholder/100/100"
  },
  {
    id: 4,
    name: "Fresh Orange Juice",
    category: "Beverages",
    price: 3.50,
    stock: 5,
    status: "low_stock",
    image: "/api/placeholder/100/100"
  },
  {
    id: 5,
    name: "Chocolate Cake",
    category: "Desserts",
    price: 4.99,
    stock: 0,
    status: "out_of_stock",
    image: "/api/placeholder/100/100"
  }
];

const categories = ["All", "Main Course", "Salads", "Beverages", "Desserts"];

export const MenuManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string, stock: number) => {
    if (status === "out_of_stock" || stock === 0) {
      return <Badge className="bg-destructive text-destructive-foreground">Out of Stock</Badge>;
    }
    if (status === "low_stock" || stock <= 10) {
      return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
    }
    return <Badge className="bg-success text-success-foreground">Available</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Menu Management</h2>
        <Button className="bg-gradient-primary text-primary-foreground shadow-elegant">
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search menu items..."
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="shadow-card hover:shadow-elegant transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
                {getStatusBadge(item.status, item.stock)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">${item.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{item.stock} left</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No items found matching your search criteria.</p>
        </Card>
      )}
    </div>
  );
};