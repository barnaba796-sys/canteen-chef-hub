import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MenuManagement } from "@/components/menu/MenuManagement";
import { OrderManagement } from "@/components/orders/OrderManagement";
import { InventoryManagement } from "@/components/inventory/InventoryManagement";
import { PromotionManagement } from "@/components/promotions/PromotionManagement";
import { ClearanceManagement } from "@/components/clearance/ClearanceManagement";
import { BillingManagement } from "@/components/billing/BillingManagement";
import { ReportsAnalytics } from "@/components/reports/ReportsAnalytics";
import { FeedbackManagement } from "@/components/feedback/FeedbackManagement";
import { UserManagement } from "@/components/users/UserManagement";
import { SettingsManagement } from "@/components/settings/SettingsManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  AlertTriangle,
  Zap
} from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "menu":
        return <MenuManagement />;
      case "orders":
        return <OrderManagement />;
      case "inventory":
        return <InventoryManagement />;
      case "promotions":
        return <PromotionManagement />;
      case "clearance":
        return <ClearanceManagement />;
      case "billing":
        return <BillingManagement />;
      case "reports":
        return <ReportsAnalytics />;
      case "feedback":
        return <FeedbackManagement />;
      case "users":
        return <UserManagement />;
      case "settings":
        return <SettingsManagement />;
      default:
        return (
          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome to CanteenPro Management System</p>
              </div>
              <Badge className="bg-gradient-primary text-primary-foreground px-4 py-2 text-sm">
                <Zap className="h-4 w-4 mr-1" />
                Live System
              </Badge>
            </div>
            
            <DashboardStats />
            
            <div className="grid gap-6 md:grid-cols-2">
              <RecentOrders />
              <QuickActions onActionClick={setActiveTab} />
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Sales Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">+15.2%</div>
                  <p className="text-sm text-muted-foreground">vs last week</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Daily Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                  <p className="text-sm text-muted-foreground">served today</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">5</div>
                  <p className="text-sm text-muted-foreground">items need attention</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        user={{
          name: "Admin User",
          role: "System Administrator"
        }}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;