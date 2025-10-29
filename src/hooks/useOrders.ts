import { useState, useEffect } from 'react';
import { mongodb } from '@/integrations/mongodb/client';
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
      // Fetch orders
      const { data: ordersData, error: ordersError } = await mongodb
        .from('orders')
        .select('*')
        .eq('canteen_id', profile.canteen_id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: items, error: itemsError } = await mongodb
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          if (itemsError) throw itemsError;

          // Fetch menu item details for each order item
          const itemsWithDetails = await Promise.all(
            (items || []).map(async (item) => {
              const { data: menuItem, error: menuError } = await mongodb
                .from('menu_items')
                .select('name, price')
                .eq('id', item.menu_item_id)
                .maybeSingle();

              if (menuError) throw menuError;

              return {
                ...item,
                menu_items: menuItem
              };
            })
          );

          return {
            ...order,
            order_items: itemsWithDetails
          };
        })
      );

      setOrders(ordersWithItems);
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
      const { error } = await mongodb
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
      const { data: order, error: orderError } = await mongodb
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

      const { error: itemsError } = await mongodb
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
