import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeMenuItems: number;
  todayOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    activeMenuItems: 0,
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const fetchStats = async () => {
    if (!profile?.canteen_id) return;

    try {
      // Get total orders and revenue
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, status, created_at')
        .eq('canteen_id', profile.canteen_id);

      if (ordersError) throw ordersError;

      // Get active menu items count
      const { count: menuItemsCount, error: menuError } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true })
        .eq('canteen_id', profile.canteen_id)
        .eq('is_active', true);

      if (menuError) throw menuError;

      // Calculate stats
      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      
      // Today's orders (orders created today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = orders?.filter(order => 
        new Date(order.created_at) >= today
      ).length || 0;

      // Status counts
      const pendingOrders = orders?.filter(order => 
        order.status === 'pending' || order.status === 'preparing'
      ).length || 0;
      
      const completedOrders = orders?.filter(order => 
        order.status === 'completed' || order.status === 'delivered'
      ).length || 0;

      setStats({
        totalOrders,
        totalRevenue,
        activeMenuItems: menuItemsCount || 0,
        todayOrders,
        pendingOrders,
        completedOrders,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.canteen_id) {
      fetchStats();
    }
  }, [profile?.canteen_id]);

  return { stats, loading, refetch: fetchStats };
};