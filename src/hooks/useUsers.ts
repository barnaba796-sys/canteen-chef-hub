import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];


export const useUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    if (!profile?.canteen_id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('canteen_id', profile.canteen_id);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching users',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  }, [profile?.canteen_id, toast]);

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
  }, [profile?.canteen_id, fetchUsers]);

  // Note: In a real application, these admin-level functions should be handled
  // through secure server-side functions, not directly on the client.
  const addUser = useCallback(async (userData: ProfileInsert) => {
    // This is a placeholder. In a real app, you would have a secure way to invite users.
    console.log("Adding user:", userData);
    toast({
      title: 'Success',
      description: 'User added successfully (simulated).',
    });
    await fetchUsers();
  }, [fetchUsers, toast]);

  const updateUser = useCallback(async (id: string, updates: ProfileUpdate) => {
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
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, fetchUsers]);

  const deleteUser = useCallback(async (id: string) => {
    // This is a placeholder. In a real app, you would have a secure way to delete users.
    console.log("Deleting user:", id);
     toast({
      title: 'Success',
      description: 'User deleted successfully (simulated).',
    });
    await fetchUsers();
  }, [fetchUsers, toast]);

  return {
    users,
    loading,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
  };
};
