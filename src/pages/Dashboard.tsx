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
import { MenuManagement } from "@/components/menu/MenuManagement";
import { OrderManagement } from "@/components/orders/OrderManagement";
import { InventoryManagement } from "@/components/inventory/InventoryManagement";
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
        return <ComingSoon title="Promotions & Discounts" description="Manage discounts, coupons, and promotional campaigns" />;
      case "clearance":
        return <ComingSoon title="Clearance Sale Management" description="Handle expiring items and clearance sales" />;
      case "billing":
        return <ComingSoon title="Billing & Payment" description="Process payments and generate bills" />;
      case "reports":
        return <ComingSoon title="Reports & Analytics" description="View sales reports and business analytics" />;
      case "feedback":
        return <ComingSoon title="Feedback & Support" description="Customer feedback and support system" />;
      case "users":
        return <ComingSoon title="User Management" description="Manage staff, students, and visitor accounts" />;
      case "settings":
        return <ComingSoon title="System Settings" description="Configure system preferences and settings" />;
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

const ComingSoon = ({ title, description }: { title: string; description: string }) => (
  <div className="space-y-6 p-6">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold">{title}</h2>
      <Badge variant="outline">Coming Soon</Badge>
    </div>
    <Card className="shadow-card">
      <CardContent className="p-12 text-center">
        <div className="space-y-4">
          <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
            <Zap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">{description}</p>
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              This feature requires backend integration with Supabase for full functionality.
            </p>
            <Button className="bg-gradient-primary text-primary-foreground shadow-elegant">
              Set Up Backend Integration
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Dashboard;