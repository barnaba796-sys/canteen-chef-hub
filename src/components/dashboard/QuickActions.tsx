import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Percent, AlertTriangle, BarChart3, Users } from "lucide-react";

const quickActions = [
  {
    title: "Add New Item",
    description: "Add a new menu item",
    icon: Plus,
    color: "bg-gradient-primary",
    action: "menu"
  },
  {
    title: "Check Inventory",
    description: "View stock levels",
    icon: Package,
    color: "bg-gradient-secondary",
    action: "inventory"
  },
  {
    title: "Create Promotion",
    description: "Setup new discount",
    icon: Percent,
    color: "bg-gradient-warm",
    action: "promotions"
  },
  {
    title: "Low Stock Alert",
    description: "12 items need attention",
    icon: AlertTriangle,
    color: "bg-warning",
    action: "clearance"
  },
  {
    title: "View Reports",
    description: "Check sales analytics",
    icon: BarChart3,
    color: "bg-gradient-primary",
    action: "reports"
  },
  {
    title: "Manage Users",
    description: "User permissions",
    icon: Users,
    color: "bg-gradient-secondary",
    action: "users"
  }
];

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

export const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className="h-auto p-4 flex flex-col items-start text-left gap-2 hover:bg-muted/50 transition-all duration-200 hover:shadow-card"
              onClick={() => onActionClick(action.action)}
            >
              <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};