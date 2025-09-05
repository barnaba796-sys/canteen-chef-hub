import { useState } from "react";
import { Users, Plus, Edit, Trash2, Shield, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddUserDialog } from "./AddUserDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useUsers } from "@/hooks/useUsers";

const rolePermissions = {
  owner: ["All Permissions", "Manage Users", "Manage Settings", "View Reports"],
  manager: ["Manage Menu", "Manage Orders", "View Reports", "Manage Inventory"],
  chef: ["View Orders", "Update Order Status", "Manage Menu Items"],
  cashier: ["Process Orders", "Handle Payments", "View Menu"]
};

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { users, loading, addUser, updateUser, deleteUser } = useUsers();
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && user.is_active) ||
                         (filterStatus === "inactive" && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner": return "bg-purple-100 text-purple-800";
      case "manager": return "bg-blue-100 text-blue-800";
      case "chef": return "bg-green-100 text-green-800";
      case "cashier": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const toggleUserStatus = (id: string, isActive: boolean) => {
    updateUser(id, { is_active: !isActive });
  };

  const roleStats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    owner: users.filter(u => u.role === "owner").length,
    manager: users.filter(u => u.role === "manager").length,
    chef: users.filter(u => u.role === "chef").length,
    cashier: users.filter(u => u.role === "cashier").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage staff accounts and permissions</p>
        </div>
        <AddUserDialog onAddUser={addUser} />
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-xl font-bold">{roleStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-bold">{roleStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Owners</p>
            <p className="text-xl font-bold">{roleStats.owner}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Managers</p>
            <p className="text-xl font-bold">{roleStats.manager}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Chefs</p>
            <p className="text-xl font-bold">{roleStats.chef}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Cashiers</p>
            <p className="text-xl font-bold">{roleStats.cashier}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="chef">Chef</SelectItem>
            <SelectItem value="cashier">Cashier</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? <p>Loading users...</p> : filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-card transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar_url || ""} />
                    <AvatarFallback>{user.full_name ? user.full_name.charAt(0) : user.email.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{user.full_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={user.is_active || false}
                    onCheckedChange={() => toggleUserStatus(user.id, user.is_active || false)}
                    aria-label="Toggle user status"
                  />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => console.log('Edit user:', user.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {user.role !== "owner" && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteUser(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Joined</p>
                    <p className="font-medium">{new Date(user.created_at).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Login</p>
                    <p className="font-medium">{new Date(user.updated_at).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Permissions</p>
                  <div className="flex flex-wrap gap-1">
                    {rolePermissions[user.role as keyof typeof rolePermissions]?.slice(0, 3).map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                    {rolePermissions[user.role as keyof typeof rolePermissions]?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{rolePermissions[user.role as keyof typeof rolePermissions].length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterRole !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No users have been added yet"}
            </p>
            <AddUserDialog onAddUser={addUser} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};