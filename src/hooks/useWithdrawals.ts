import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Withdrawal } from '../types';

// API Functions
export const withdrawalAPI = {
  // Get all withdrawals for the current user
  async getWithdrawals(): Promise<Withdrawal[]> {
    const { data, error } = await supabase
      .from('withdrawals')
      .select(`
        *,
        sips (
          id,
          name
        )
      `)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create a new withdrawal
  async createWithdrawal(withdrawal: Omit<Withdrawal, 'id' | 'user_id' | 'created_at'>): Promise<Withdrawal> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('withdrawals')
      .insert([{ ...withdrawal, user_id: user.id }])
      .select(`
        *,
        sips (
          id,
          name
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Update a withdrawal
  async updateWithdrawal(id: string, updates: Partial<Omit<Withdrawal, 'id' | 'user_id' | 'created_at'>>): Promise<Withdrawal> {
    const { data, error } = await supabase
      .from('withdrawals')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        sips (
          id,
          name
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a withdrawal
  async deleteWithdrawal(id: string): Promise<void> {
    const { error } = await supabase
      .from('withdrawals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// React Query Hooks
export const useWithdrawals = () => {
  return useQuery({
    queryKey: ['withdrawals'],
    queryFn: withdrawalAPI.getWithdrawals,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdrawalAPI.createWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      // Also invalidate SIPs to refresh portfolio calculations
      queryClient.invalidateQueries({ queryKey: ['sips'] });
    },
  });
};

export const useUpdateWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Withdrawal, 'id' | 'user_id' | 'created_at'>> }) =>
      withdrawalAPI.updateWithdrawal(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['sips'] });
    },
  });
};

export const useDeleteWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdrawalAPI.deleteWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['sips'] });
    },
  });
};
