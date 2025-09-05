import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

export type InventoryItem = Database['public']['Tables']['inventory_items']['Row'];

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
        .eq('canteen_id', profile.canteen_id);

      if (error) throw error;
      setInventoryItems(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching inventory items',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchInventoryItems();
      setLoading(false);
    };

    if (profile?.canteen_id) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [profile?.canteen_id]);

  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'canteen_id'>) => {
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

  const deleteInventoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
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

  const fetchClearanceItems = async () => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('canteen_id', profile.canteen_id)
        .eq('is_on_clearance', true);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast({
        title: 'Error fetching clearance items',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    }
  };

  return {
    inventoryItems,
    loading,
    fetchInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    fetchClearanceItems,
  };
};
