import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

export type Promotion = Database['public']['Tables']['promotions']['Row'];

export const usePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchPromotions = async () => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('canteen_id', profile.canteen_id);

      if (error) throw error;
      setPromotions(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching promotions',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPromotions();
      setLoading(false);
    };

    if (profile?.canteen_id) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [profile?.canteen_id]);

  const addPromotion = async (item: Omit<Promotion, 'id' | 'created_at' | 'updated_at' | 'canteen_id'>) => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('promotions')
        .insert([{ ...item, canteen_id: profile.canteen_id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Promotion added successfully',
      });

      await fetchPromotions();
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

  const updatePromotion = async (id: string, updates: Partial<Promotion>) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Promotion updated successfully',
      });

      await fetchPromotions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deletePromotion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Promotion deleted successfully',
      });

      await fetchPromotions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    promotions,
    loading,
    fetchPromotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
  };
};
