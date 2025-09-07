import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  supplier?: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  unit_cost: number;
  total_value: number;
  last_restocked?: string;
  expiry_date?: string;
  status: 'good' | 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired';
  canteen_id: string;
  created_at: string;
  updated_at: string;
}

export const useInventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  // Mock data for now since we don't have inventory table yet
  const mockInventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Ground Beef',
      description: 'Fresh ground beef for burgers',
      category: 'Meat',
      supplier: 'Local Farm Co.',
      current_stock: 45,
      min_stock: 20,
      max_stock: 100,
      unit_cost: 8.50,
      total_value: 382.50,
      last_restocked: '2024-01-10',
      expiry_date: '2024-01-20',
      status: 'good',
      canteen_id: profile?.canteen_id || '',
      created_at: '2024-01-01',
      updated_at: '2024-01-10'
    },
    {
      id: '2',
      name: 'Burger Buns',
      description: 'Sesame seed burger buns',
      category: 'Bakery',
      supplier: 'City Bakery',
      current_stock: 15,
      min_stock: 25,
      max_stock: 150,
      unit_cost: 0.75,
      total_value: 11.25,
      last_restocked: '2024-01-08',
      expiry_date: '2024-01-18',
      status: 'low_stock',
      canteen_id: profile?.canteen_id || '',
      created_at: '2024-01-01',
      updated_at: '2024-01-08'
    },
    {
      id: '3',
      name: 'Lettuce',
      description: 'Fresh iceberg lettuce',
      category: 'Vegetables',
      supplier: 'Green Valley Farm',
      current_stock: 0,
      min_stock: 10,
      max_stock: 50,
      unit_cost: 2.25,
      total_value: 0,
      last_restocked: '2024-01-05',
      expiry_date: '2024-01-16',
      status: 'out_of_stock',
      canteen_id: profile?.canteen_id || '',
      created_at: '2024-01-01',
      updated_at: '2024-01-05'
    },
    {
      id: '4',
      name: 'Milk',
      description: '2% whole milk',
      category: 'Dairy',
      supplier: 'Dairy Fresh',
      current_stock: 25,
      min_stock: 15,
      max_stock: 60,
      unit_cost: 3.99,
      total_value: 99.75,
      last_restocked: '2024-01-12',
      expiry_date: '2024-01-17',
      status: 'expiring_soon',
      canteen_id: profile?.canteen_id || '',
      created_at: '2024-01-01',
      updated_at: '2024-01-12'
    }
  ];

  const fetchInventoryItems = async () => {
    if (!profile?.canteen_id) return;

    try {
      // For now, use mock data since we don't have inventory table
      // In the future, this would be:
      // const { data, error } = await supabase
      //   .from('inventory_items')
      //   .select('*')
      //   .eq('canteen_id', profile.canteen_id);
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setInventoryItems(mockInventoryItems);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'canteen_id' | 'total_value'>) => {
    try {
      const newItem: InventoryItem = {
        ...item,
        id: Date.now().toString(),
        total_value: item.current_stock * item.unit_cost,
        canteen_id: profile?.canteen_id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setInventoryItems(prev => [...prev, newItem]);
      
      toast({
        title: 'Success',
        description: 'Inventory item added successfully',
      });
      
      return newItem;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      setInventoryItems(prev => prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              ...updates, 
              total_value: (updates.current_stock || item.current_stock) * (updates.unit_cost || item.unit_cost),
              updated_at: new Date().toISOString() 
            }
          : item
      ));
      
      toast({
        title: 'Success',
        description: 'Inventory item updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const restockItem = async (id: string, quantity: number) => {
    try {
      const item = inventoryItems.find(item => item.id === id);
      if (!item) throw new Error('Item not found');

      const newStock = item.current_stock + quantity;
      let newStatus: InventoryItem['status'] = 'good';
      
      if (newStock === 0) newStatus = 'out_of_stock';
      else if (newStock <= item.min_stock) newStatus = 'low_stock';

      await updateInventoryItem(id, {
        current_stock: newStock,
        status: newStatus,
        last_restocked: new Date().toISOString().split('T')[0]
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      setInventoryItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Success',
        description: 'Inventory item deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    const loadInventory = async () => {
      setLoading(true);
      await fetchInventoryItems();
      setLoading(false);
    };

    if (profile?.canteen_id) {
      loadInventory();
    }
  }, [profile?.canteen_id]);

  return {
    inventoryItems,
    loading,
    fetchInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    restockItem,
    deleteInventoryItem,
  };
};