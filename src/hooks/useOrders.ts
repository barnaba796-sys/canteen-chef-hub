import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

export type Order = Database['public']['Tables']['orders']['Row'] & {
  order_items: (Database['public']['Tables']['order_items']['Row'] & {
    menu_items: {
      name: string;
    };
  })[];
};

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (
              name
            )
          )
        `)
        .eq('canteen_id', profile.canteen_id);

      if (error) throw error;
      setOrders(data as Order[]);
    } catch (error) {
      toast({
        title: 'Error fetching orders',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  }, [profile?.canteen_id, toast]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
    };

    if (profile?.canteen_id) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [profile?.canteen_id, fetchOrders]);

  return {
    orders,
    loading,
    fetchOrders,
  };
};
