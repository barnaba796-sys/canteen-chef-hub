import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

export type Canteen = Database['public']['Tables']['canteens']['Row'];

export const useCanteen = () => {
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchCanteen = useCallback(async () => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('canteens')
        .select('*')
        .eq('id', profile.canteen_id)
        .single();

      if (error) throw error;
      setCanteen(data || null);
    } catch (error: any) {
      toast({
        title: 'Error fetching canteen data',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [profile?.canteen_id, toast]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCanteen();
      setLoading(false);
    };

    if (profile?.canteen_id) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [profile?.canteen_id]);

  const updateCanteen = useCallback(async (updates: Partial<Canteen>) => {
    if (!canteen) return;

    try {
      const { error } = await supabase
        .from('canteens')
        .update(updates)
        .eq('id', canteen.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Canteen settings updated successfully',
      });

      await fetchCanteen();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  }, [canteen, toast, fetchCanteen]);

  return {
    canteen,
    loading,
    fetchCanteen,
    updateCanteen,
  };
};
