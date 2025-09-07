import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  menu_items?: {
    name: string;
    price: number;
  };
}

export interface Order {
  id: string;
  canteen_id: string;
  customer_name?: string;
  customer_phone?: string;
  status: string;
  order_type: string;
  payment_method?: string;
  total_amount: number;
  notes?: string;
  served_by?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (
              name,
              price
            )
          )
        `)
        .eq('canteen_id', profile.canteen_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status, 
          updated_at: new Date().toISOString(),
          ...(status === 'completed' && { served_by: profile?.user_id })
        })
        .eq('id', orderId);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });
      
      await fetchOrders();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'canteen_id'>, orderItems: Omit<OrderItem, 'id' | 'order_id'>[]) => {
    if (!profile?.canteen_id) return;

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{ ...orderData, canteen_id: profile.canteen_id }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItemsWithOrderId = orderItems.map(item => ({
        ...item,
        order_id: order.id
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsWithOrderId);

      if (itemsError) throw itemsError;
      
      toast({
        title: 'Success',
        description: 'Order created successfully',
      });
      
      await fetchOrders();
      return order;
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
    const loadOrders = async () => {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
    };

    if (profile?.canteen_id) {
      loadOrders();
    }
  }, [profile?.canteen_id]);

  return {
    orders,
    loading,
    fetchOrders,
    updateOrderStatus,
    createOrder,
  };
};