import { useState } from "react";
import { CreditCard, FileText, Download, Eye, IndianRupee, TrendingUp, Calendar, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const mockInvoices = [
  {
    id: "INV-001",
    customerName: "John Doe",
    date: "2024-01-15",
    amount: 450,
    paymentMethod: "Cash",
    status: "paid",
    items: 3,
    orderType: "dine_in"
  },
  {
    id: "INV-002",
    customerName: "Jane Smith",
    date: "2024-01-15",
    amount: 320,
    paymentMethod: "UPI",
    status: "paid",
    items: 2,
    orderType: "takeaway"
  },
  {
    id: "INV-003",
    customerName: "Bob Wilson",
    date: "2024-01-14",
    amount: 180,
    paymentMethod: "Card",
    status: "pending",
    items: 1,
    orderType: "dine_in"
  }
];

const paymentMethods = [
  { name: "Cash", count: 45, amount: 15650, color: "bg-green-100 text-green-800" },
  { name: "UPI", count: 32, amount: 12340, color: "bg-blue-100 text-blue-800" },
  { name: "Card", count: 18, amount: 8970, color: "bg-purple-100 text-purple-800" },
  { name: "Online", count: 5, amount: 2340, color: "bg-orange-100 text-orange-800" }
];

export const BillingManagement = () => {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
    const matchesPayment = filterPayment === "all" || invoice.paymentMethod.toLowerCase() === filterPayment.toLowerCase();
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const todayRevenue = invoices
    .filter(invoice => invoice.date === "2024-01-15")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing & Payment</h1>
          <p className="text-muted-foreground">Manage invoices and track payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Revenue</p>
                <p className="text-xl font-bold">₹{todayRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold">₹{totalRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Receipt className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-xl font-bold">{invoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods Overview</CardTitle>
          <CardDescription>Breakdown of payment methods used today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods.map((method) => (
              <div key={method.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{method.name}</span>
                  <Badge className={method.color}>
                    {method.count}
                  </Badge>
                </div>
                <p className="text-2xl font-bold">₹{method.amount}</p>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div 
                    className="h-2 bg-primary rounded-full"
                    style={{ width: `${(method.amount / totalRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPayment} onValueChange={setFilterPayment}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="online">Online</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{invoice.id}</h4>
                      <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">₹{invoice.amount}</p>
                      <p className="text-sm text-muted-foreground">{invoice.paymentMethod}</p>
                    </div>
                    
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>Date: {new Date(invoice.date).toLocaleDateString()}</div>
                  <div>Items: {invoice.items}</div>
                  <div>Type: {invoice.orderType.replace('_', ' ')}</div>
                </div>
              </div>
            ))}
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== "all" || filterPayment !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No invoices have been created yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};