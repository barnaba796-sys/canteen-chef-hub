import { useState } from "react";
import { BarChart3, TrendingUp, Users, ShoppingCart, Calendar, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockSalesData = [
  { period: "Jan", sales: 15000, orders: 150, customers: 120 },
  { period: "Feb", sales: 18000, orders: 180, customers: 145 },
  { period: "Mar", sales: 22000, orders: 220, customers: 180 },
  { period: "Apr", sales: 19000, orders: 190, customers: 155 },
  { period: "May", sales: 25000, orders: 250, customers: 200 },
  { period: "Jun", sales: 28000, orders: 280, customers: 225 }
];

const topProducts = [
  { name: "Chicken Biryani", sold: 145, revenue: 21750 },
  { name: "Paneer Butter Masala", sold: 120, revenue: 18000 },
  { name: "Dal Tadka", sold: 98, revenue: 9800 },
  { name: "Mixed Veg Curry", sold: 87, revenue: 8700 },
  { name: "Jeera Rice", sold: 156, revenue: 7800 }
];

const customerInsights = [
  { metric: "New Customers", value: 45, change: "+12%" },
  { metric: "Returning Customers", value: 180, change: "+8%" },
  { metric: "Average Order Value", value: "₹185", change: "+15%" },
  { metric: "Customer Satisfaction", value: "4.7/5", change: "+0.3" }
];

export const ReportsAnalytics = () => {
  const [timeRange, setTimeRange] = useState("6months");
  const [reportType, setReportType] = useState("sales");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold">₹1,27,750</p>
                <p className="text-xs text-green-600">+18% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold">1,270</p>
                <p className="text-xs text-blue-600">+12% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-xl font-bold">1,025</p>
                <p className="text-xs text-purple-600">+25% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                <p className="text-xl font-bold">₹185</p>
                <p className="text-xs text-orange-600">+5% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="products">Product Analytics</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>Revenue and orders over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSalesData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="font-medium">{data.period}</div>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">Sales: </span>
                        <span className="font-semibold">₹{data.sales.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Orders: </span>
                        <span className="font-semibold">{data.orders}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Customers: </span>
                        <span className="font-semibold">{data.customers}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling items and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sold} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{product.revenue.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>Customer behavior and satisfaction metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customerInsights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">{insight.metric}</p>
                      <Badge className="bg-green-100 text-green-800">
                        {insight.change}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold">{insight.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Segmentation</CardTitle>
              <CardDescription>Customer groups based on order frequency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">65%</p>
                    <p className="text-sm text-muted-foreground">Regular Customers</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">25%</p>
                    <p className="text-sm text-muted-foreground">Occasional Customers</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">10%</p>
                    <p className="text-sm text-muted-foreground">New Customers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Fulfillment</CardTitle>
                <CardDescription>Average times and efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg. Preparation Time</span>
                    <span className="font-semibold">12 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg. Serving Time</span>
                    <span className="font-semibold">15 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Order Accuracy</span>
                    <span className="font-semibold text-green-600">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">On-time Delivery</span>
                    <span className="font-semibold text-blue-600">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staff Performance</CardTitle>
                <CardDescription>Team efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Orders per Hour</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Staff</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Efficiency Score</span>
                    <span className="font-semibold text-green-600">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Customer Rating</span>
                    <span className="font-semibold text-yellow-600">4.7/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};