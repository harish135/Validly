import { supabase } from '../supabase';
import type { LeaderboardEntry } from '../types';

/**
 * Fetches leaderboard data from Supabase calidly_leaderboard table
 */
export async function fetchLeaderboardWithUserData(): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('validly_leaderboard')
      .select('*')
      .order('points', { ascending: false })
      .limit(10); // Limit to top 10 users

    if (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // Transform the Supabase data to match LeaderboardEntry interface
    const leaderboardEntries: LeaderboardEntry[] = data.map((row: any) => ({
      id: row.id?.toString() || row.user_id?.toString() || 'unknown',
      userName: row.user_name || row.name || 'Anonymous',
      userEmail: row.user_email || row.email || '',
      avatarUrl: row.avatar_url || '',
      score: row.points || row.score || 0,
      isCurrentUser: false // This will be set later in the component
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
  points: number,
  avatarUrl?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('calidly_leaderboard')
      .upsert({
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        points: points,
        avatar_url: avatarUrl || '',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error updating user score:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to update user score:', error);
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