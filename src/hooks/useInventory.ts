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

  const fetchInventoryItems = async () => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('canteen_id', profile.canteen_id)
        .eq('is_active', true);
      
      if (error) throw error;
      setInventoryItems((data as InventoryItem[]) || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'canteen_id' | 'total_value'>) => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([{ ...item, canteen_id: profile.canteen_id }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Inventory item added successfully',
      });
      
      await fetchInventoryItems();
      return data;
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
      const { error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Inventory item updated successfully',
      });
      
      await fetchInventoryItems();
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
      const { data: currentItem, error: fetchError } = await supabase
        .from('inventory_items')
        .select('current_stock, min_stock')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const newStock = currentItem.current_stock + quantity;

      const { error } = await supabase
        .from('inventory_items')
        .update({
          current_stock: newStock,
          last_restocked: new Date().toISOString().split('T')[0]
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Item restocked successfully',
      });
      
      await fetchInventoryItems();
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
      const { error } = await supabase
        .from('inventory_items')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Inventory item deleted successfully',
      });
      
      await fetchInventoryItems();
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