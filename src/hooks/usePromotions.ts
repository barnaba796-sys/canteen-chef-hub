import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

export type Promotion = Database['public']['Tables']['promotions']['Row'];
export type PromotionInsert = Database['public']['Tables']['promotions']['Insert'];
export type PromotionUpdate = Database['public']['Tables']['promotions']['Update'];


export const usePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchPromotions = useCallback(async () => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('canteen_id', profile.canteen_id);

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching promotions',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  }, [profile?.canteen_id, toast]);

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
  }, [profile?.canteen_id, fetchPromotions]);

  const addPromotion = useCallback(async (item: PromotionInsert) => {
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
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
      throw error;
    }
  }, [profile?.canteen_id, toast, fetchPromotions]);

  const updatePromotion = useCallback(async (id: number, updates: PromotionUpdate) => {
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
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, fetchPromotions]);

  const deletePromotion = useCallback(async (id: number) => {
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
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, fetchPromotions]);

  return {
    promotions,
    loading,
    fetchPromotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
  };
};
