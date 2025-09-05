import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export const useUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchUsers = async () => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('canteen_id', profile.canteen_id);

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching users',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUsers();
      setLoading(false);
    };

    if (profile?.canteen_id) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [profile?.canteen_id]);

  // Note: In a real application, these admin-level functions should be handled
  // through secure server-side functions, not directly on the client.
  const addUser = async (userData: any) => {
    // This is a placeholder. In a real app, you would have a secure way to invite users.
    console.log("Adding user:", userData);
    toast({
      title: 'Success',
      description: 'User added successfully (simulated).',
    });
    await fetchUsers();
  };

  const updateUser = async (id: string, updates: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User updated successfully',
      });

      await fetchUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    // This is a placeholder. In a real app, you would have a secure way to delete users.
    console.log("Deleting user:", id);
     toast({
      title: 'Success',
      description: 'User deleted successfully (simulated).',
    });
    await fetchUsers();
  };

  return {
    users,
    loading,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
  };
};
