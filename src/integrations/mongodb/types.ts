// MongoDB TypeScript types for collections

export interface User {
  id: string;
  email: string;
  emailConfirmed?: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: 'owner' | 'manager' | 'chef' | 'cashier' | 'staff';
  canteenId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Canteen {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  canteenId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  canteenId: string;
  imageUrl?: string;
  isAvailable: boolean;
  isActive: boolean;
  preparationTime?: number;
  stockQuantity?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  canteenId: string;
  customerName?: string;
  customerPhone?: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'delivered';
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  paymentMethod?: string;
  totalAmount: number;
  notes?: string;
  servedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
  createdAt: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  supplier?: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  totalValue: number;
  lastRestocked?: Date;
  expiryDate?: Date;
  status: 'good' | 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired';
  canteenId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Database {
  collections: {
    users: User;
    profiles: Profile;
    canteens: Canteen;
    categories: Category;
    menuItems: MenuItem;
    orders: Order;
    orderItems: OrderItem;
    inventoryItems: InventoryItem;
  };
}
