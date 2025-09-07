import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

export type InventoryItem = Database['public']['Tables']['inventory_items']['Row'];
export type InventoryItemInsert = Database['public']['Tables']['inventory_items']['Insert'];
export type InventoryItemUpdate = Database['public']['Tables']['inventory_items']['Update'];

export const useInventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchInventoryItems = useCallback(async () => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('canteen_id', profile.canteen_id);

      if (error) throw error;
      setInventoryItems(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching inventory items',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  }, [profile?.canteen_id, toast]);

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
  }, [profile?.canteen_id, fetchInventoryItems]);

  const addInventoryItem = useCallback(async (item: InventoryItemInsert) => {
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
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
      throw error;
    }
  }, [profile?.canteen_id, toast, fetchInventoryItems]);

  const updateInventoryItem = useCallback(async (id: number, updates: InventoryItemUpdate) => {
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
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, fetchInventoryItems]);

  const deleteInventoryItem = useCallback(async (id: number) => {
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
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, fetchInventoryItems]);

  const fetchClearanceItems = useCallback(async () => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('canteen_id', profile.canteen_id)
        .eq('is_on_clearance', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      toast({
        title: 'Error fetching clearance items',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
      return [];
    }
  }, [profile?.canteen_id, toast]);

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
