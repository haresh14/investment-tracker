import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { SIP } from '../types';

// API Functions
export const sipAPI = {
  // Get all SIPs for the current user
  async getSIPs(): Promise<SIP[]> {
    const { data, error } = await supabase
      .from('sips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create a new SIP
  async createSIP(sip: Omit<SIP, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<SIP> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('sips')
      .insert([{ ...sip, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a SIP
  async updateSIP(id: string, updates: Partial<Omit<SIP, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<SIP> {
    const { data, error } = await supabase
      .from('sips')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a SIP
  async deleteSIP(id: string): Promise<void> {
    const { error } = await supabase
      .from('sips')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// React Query Hooks
export const useSIPs = () => {
  return useQuery({
    queryKey: ['sips'],
    queryFn: sipAPI.getSIPs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateSIP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sipAPI.createSIP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sips'] });
    },
  });
};

export const useUpdateSIP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<SIP, 'id' | 'user_id' | 'created_at' | 'updated_at'>> }) =>
      sipAPI.updateSIP(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sips'] });
    },
  });
};

export const useDeleteSIP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sipAPI.deleteSIP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sips'] });
    },
  });
};

export const usePauseSIP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, pauseDate }: { id: string; pauseDate: string }) => 
      sipAPI.updateSIP(id, { 
        is_paused: true, 
        pause_date: pauseDate
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sips'] });
    },
  });
};

export const useResumeSIP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => 
      sipAPI.updateSIP(id, { 
        is_paused: false, 
        pause_date: null
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sips'] });
    },
  });
};
