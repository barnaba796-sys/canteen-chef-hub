import { useState, useEffect } from "react";
import { Settings, Save, Bell, Shield, Palette, Database, Wifi, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCanteen } from "@/hooks/useCanteen";

interface Canteen {
  id: number;
  name: string;
  phone: string;
  address: string;
  description: string;
}

export const SettingsManagement = () => {
  const { canteen, loading, updateCanteen } = useCanteen();
  const [settings, setSettings] = useState<Partial<Canteen>>(canteen || {});

  useEffect(() => {
    if (canteen) {
      setSettings(canteen);
    }
  }, [canteen]);

  const handleInputChange = (key: keyof Canteen, value: string | number | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    if (settings) {
      updateCanteen(settings);
    }
  };

  if (loading) {
    return <p>Loading settings...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your canteen configuration and preferences</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Canteen Information
              </CardTitle>
              <CardDescription>
                Basic information about your canteen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="canteenName">Canteen Name</Label>
                  <Input
                    id="canteenName"
                    value={settings?.name || ''}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings?.phone || ''}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={settings?.address || ''}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings?.description || ''}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description about your canteen"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>
    </div>
  );
};