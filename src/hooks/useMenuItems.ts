import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  canteen_id: string;
  image_url?: string;
  is_available: boolean;
  is_active: boolean;
  preparation_time?: number;
  stock_quantity?: number;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  canteen_id: string;
  is_active: boolean;
}

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchMenuItems = async () => {
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
      setMenuItems(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const fetchCategories = async () => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('canteen_id', profile.canteen_id)
        .eq('is_active', true);

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at' | 'canteen_id'>) => {
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
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
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
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteMenuItem = async (id: string) => {
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
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMenuItems(), fetchCategories()]);
      setLoading(false);
    };

    if (profile?.canteen_id) {
      loadData();
    }
  }, [profile?.canteen_id]);

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