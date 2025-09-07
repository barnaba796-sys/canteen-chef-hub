import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

export type Invoice = Database['public']['Tables']['orders']['Row'];
export type InvoiceInsert = Database['public']['Tables']['orders']['Insert'];

export const useBilling = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchInvoices = useCallback(async () => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('canteen_id', profile.canteen_id)
        .eq('status', 'completed'); // Assuming 'completed' orders are paid invoices

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching invoices',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  }, [profile?.canteen_id, toast]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchInvoices();
      setLoading(false);
    };

    if (profile?.canteen_id) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [profile?.canteen_id, fetchInvoices]);

  const createInvoice = useCallback(async (invoiceData: InvoiceInsert) => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          ...invoiceData,
          canteen_id: profile.canteen_id,
          status: 'completed'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Invoice created successfully',
      });

      await fetchInvoices();
      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
      throw error;
    }
  }, [profile?.canteen_id, toast, fetchInvoices]);

  return {
    invoices,
    loading,
    fetchInvoices,
    createInvoice,
  };
};
