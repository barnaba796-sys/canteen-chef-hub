import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

type MenuItemRow = Database['public']['Tables']['menu_items']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];

export type MenuItem = MenuItemRow & {
  categories?: { name: string; } | null;
};
export type Category = CategoryRow;
export type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert'];
export type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update'];

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchMenuItems = useCallback(async () => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('canteen_id', profile.canteen_id)
        .eq('is_active', true);

      if (error) throw error;
      setMenuItems(data as MenuItem[] || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  }, [profile?.canteen_id, toast]);

  const fetchCategories = useCallback(async () => {
    if (!profile?.canteen_id) return;

    try {
      let { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('canteen_id', profile.canteen_id)
        .eq('is_active', true);

      if (error) throw error;

      if (data && data.length === 0) {
        // No categories found, let's insert the default ones
        const defaultCategories = [
          { name: 'Main Course', description: 'The main dishes of your menu.', canteen_id: profile.canteen_id, is_active: true },
          { name: 'Beverages', description: 'Drinks and other beverages.', canteen_id: profile.canteen_id, is_active: true },
          { name: 'Snacks', description: 'Light meals and snacks.', canteen_id: profile.canteen_id, is_active: true },
          { name: 'Desserts', description: 'Sweet dishes and desserts.', canteen_id: profile.canteen_id, is_active: true },
        ];

        const { error: insertError } = await supabase.from('categories').insert(defaultCategories);
        if (insertError) throw insertError;

        // Re-fetch the categories
        const { data: newData, error: newError } = await supabase
          .from('categories')
          .select('*')
          .eq('canteen_id', profile.canteen_id)
          .eq('is_active', true);

        if (newError) throw newError;
        data = newData;
      }

      setCategories(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  }, [profile?.canteen_id, toast]);

  const addMenuItem = useCallback(async (item: MenuItemInsert) => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([{ ...item, canteen_id: profile.canteen_id }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Menu item added successfully',
      });
      
      await fetchMenuItems();
      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
      throw error;
    }
  }, [profile?.canteen_id, toast, fetchMenuItems]);

  const updateMenuItem = useCallback(async (id: string, updates: MenuItemUpdate) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Menu item updated successfully',
      });
      
      await fetchMenuItems();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, fetchMenuItems]);

  const deleteMenuItem = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Menu item deleted successfully',
      });
      
      await fetchMenuItems();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, fetchMenuItems]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMenuItems(), fetchCategories()]);
      setLoading(false);
    };

    if (profile?.canteen_id) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [profile?.canteen_id, fetchMenuItems, fetchCategories]);

  return {
    menuItems,
    categories,
    loading,
    fetchMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  };
};