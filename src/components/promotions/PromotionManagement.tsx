import { useState } from "react";
import { Plus, Edit, Trash2, Percent, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePromotionDialog } from "./CreatePromotionDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePromotions } from "@/hooks/usePromotions";

export const PromotionManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { promotions, loading, addPromotion, deletePromotion } = usePromotions();

  const getStatus = (promotion: any) => {
    const now = new Date();
    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);
    if (now < startDate) return "scheduled";
    if (now > endDate) return "expired";
    return "active";
  }

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (promotion.description && promotion.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || getStatus(promotion) === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "expired": return "bg-red-100 text-red-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "percentage" ? "%" : "₹";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Promotions & Discounts</h1>
          <p className="text-muted-foreground">Manage promotional offers and discounts</p>
        </div>
        <CreatePromotionDialog onCreate={addPromotion} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Promotions</p>
                <p className="text-xl font-bold">{promotions.filter(p => getStatus(p) === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Percent className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Promotions</p>
                <p className="text-xl font-bold">{promotions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-xl font-bold">{promotions.filter(p => getStatus(p) === 'scheduled').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-xl font-bold">{promotions.filter(p => getStatus(p) === 'expired').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search promotions..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Promotions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPromotions.map((promotion) => (
          <Card key={promotion.id} className="hover:shadow-card transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{promotion.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {promotion.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(getStatus(promotion))}>
                    {getStatus(promotion)}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => console.log('Edit promotion:', promotion.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => console.log('Delete promotion:', promotion.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">
                        {getTypeIcon(promotion.type || 'percentage')}
                      </span>
                    </div>
                    <span className="font-semibold text-lg">
                      {promotion.type === "percentage" ? `${promotion.value}%` : `₹${promotion.value}`}
                    </span>
                    <span className="text-muted-foreground">discount</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{promotion.start_date ? new Date(promotion.start_date).toLocaleDateString('en-IN') : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">{promotion.end_date ? new Date(promotion.end_date).toLocaleDateString('en-IN') : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Times Used</p>
                    <p className="font-medium">0</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Target</p>
                    <p className="font-medium capitalize">{promotion.target}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPromotions.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Percent className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No promotions found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Create your first promotion to attract more customers"}
            </p>
            <CreatePromotionDialog onCreate={addPromotion} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};