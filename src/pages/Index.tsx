import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Users, BarChart3, ShoppingCart } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="h-6 w-6 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-elegant">
              <span className="text-primary-foreground font-bold text-2xl">C</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CanteenPro
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your canteen operations with our comprehensive management system. 
            Handle orders, inventory, and analytics all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary text-primary-foreground shadow-elegant hover:shadow-lg transition-all duration-300"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          <Card className="shadow-card hover:shadow-elegant transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="h-12 w-12 bg-gradient-warm rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Order Management</h3>
              <p className="text-muted-foreground">
                Efficiently track and manage customer orders from start to finish.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="h-12 w-12 bg-gradient-cool rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Staff Management</h3>
              <p className="text-muted-foreground">
                Manage your team with role-based access and performance tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics & Reports</h3>
              <p className="text-muted-foreground">
                Get insights into your business with comprehensive analytics.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
