import { supabase } from '../supabase';
import type { LeaderboardEntry } from '../types';

/**
 * Fetches leaderboard data from Supabase validly_leaderboard table
 */
export async function fetchLeaderboardWithUserData(): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('validly_leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    // Get the current user's ID from the session
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;

    // Transform the Supabase data to match LeaderboardEntry interface
    const leaderboardEntries: LeaderboardEntry[] = data.map((row: any) => ({
      id: row.user_id,
      userName: row.user_name,
      userEmail: row.user_email,
      avatarUrl: row.avatar_url || '',
      score: row.score,
      isCurrentUser: row.user_id === currentUserId
    }));

    return leaderboardEntries;
  } catch (error) {
    console.error('Failed to fetch leaderboard data:', error);
    return [];
  }
}

/**
 * Updates or inserts a user's score in the leaderboard
 */
export async function updateUserScore(
  userId: string,
  userName: string,
  userEmail: string,
  score: number
): Promise<void> {
  try {
    const { error } = await supabase
      .from('validly_leaderboard')
      .upsert({
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        score: score,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error updating user score:', error);
    throw error;
  }
}

/**
 * Gets a specific user's rank in the leaderboard
 */
export async function getUserRank(userId: string): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from('calidly_leaderboard')
      .select('user_id, points')
      .order('points', { ascending: false });

    if (error) {
      console.error('Error fetching user rank:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    const userIndex = data.findIndex(row => row.user_id === userId);
    return userIndex >= 0 ? userIndex + 1 : null;
  } catch (error) {
    console.error('Failed to get user rank:', error);
    return null;
  }
}