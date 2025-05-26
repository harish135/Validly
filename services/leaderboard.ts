import { supabase } from '../supabase';

// Fetch the top N users from the leaderboard
export async function fetchLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('points', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// Fetch the current user's points
export async function fetchUserPoints(user_id: string) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('points')
    .eq('user_id', user_id)
    .single();

  if (error) throw error;
  return data?.points ?? 0;
}

// Upsert (insert or update) the user's points
export async function upsertUserPoints({ user_id, user_name, user_email, avatar_url, points }: {
  user_id: string;
  user_name: string;
  user_email: string;
  avatar_url?: string;
  points: number;
}) {
  const { data, error } = await supabase
    .from('leaderboard')
    .upsert([
      { user_id, user_name, user_email, avatar_url, points }
    ], { onConflict: 'user_id' });

  if (error) throw error;
  return data;
} 