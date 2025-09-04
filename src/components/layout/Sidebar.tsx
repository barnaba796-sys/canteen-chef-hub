import { 
  Home, 
  UtensilsCrossed, 
  ShoppingCart, 
  Package, 
  Percent, 
  Clock, 
  CreditCard, 
  BarChart3, 
  MessageSquare,
  Users,
  Settings,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, badge: null },
  { id: "menu", label: "Menu Management", icon: UtensilsCrossed, badge: null },
  { id: "orders", label: "Orders", icon: ShoppingCart, badge: "12" },
  { id: "inventory", label: "Inventory", icon: Package, badge: "5" },
  { id: "promotions", label: "Promotions", icon: Percent, badge: null },
  { id: "clearance", label: "Clearance Sale", icon: Clock, badge: "3" },
  { id: "billing", label: "Billing", icon: CreditCard, badge: null },
  { id: "reports", label: "Reports", icon: BarChart3, badge: null },
  { id: "feedback", label: "Feedback", icon: MessageSquare, badge: "2" },
  { id: "users", label: "Users", icon: Users, badge: null },
  { id: "settings", label: "Settings", icon: Settings, badge: null },
];

export const Sidebar = ({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 lg:hidden">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  activeTab === item.id && "bg-gradient-primary text-primary-foreground shadow-elegant"
                )}
                onClick={() => {
                  onTabChange(item.id);
                  if (window.innerWidth < 1024) {
                    onClose?.();
                  }
                }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge className="ml-auto bg-destructive text-destructive-foreground">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
};