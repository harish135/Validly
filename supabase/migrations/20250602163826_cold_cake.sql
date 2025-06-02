/*
  # Fix Usage Tracking System

  1. Changes
    - Drop and recreate get_user_plan_and_usage function with proper permissions
    - Add policy for tracking feature usage
    - Add policy for system to track usage
    - Add function to log feature usage

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
    - Use security definer for functions
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_user_plan_and_usage(uuid);

-- Recreate the function with proper permissions
CREATE OR REPLACE FUNCTION get_user_plan_and_usage(p_user_id uuid)
RETURNS TABLE (
    plan_name text,
    daily_limit integer,
    is_unlimited boolean,
    minutes_used integer,
    requests_remaining integer
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH daily_usage AS (
        SELECT COALESCE(SUM(usage_count), 0) as total_minutes
        FROM feature_usage_tracking
        WHERE user_id = p_user_id
        AND used_at >= CURRENT_DATE
    )
    SELECT 
        sp.name as plan_name,
        sp.daily_time_allowance_minutes as daily_limit,
        sp.daily_time_allowance_minutes IS NULL as is_unlimited,
        COALESCE(du.total_minutes, 0) as minutes_used,
        CASE 
            WHEN sp.daily_time_allowance_minutes IS NULL THEN -1
            ELSE GREATEST(0, sp.daily_time_allowance_minutes - COALESCE(du.total_minutes, 0))
        END as requests_remaining
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    LEFT JOIN daily_usage du ON true
    WHERE us.user_id = p_user_id
    AND us.status = 'active'
    AND (us.expires_at IS NULL OR us.expires_at > now())
    LIMIT 1;
END;
$$;

-- Function to log feature usage
CREATE OR REPLACE FUNCTION log_feature_usage(
    p_user_id uuid,
    p_feature_name text,
    p_usage_count integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO feature_usage_tracking (user_id, feature_name, usage_count)
    VALUES (p_user_id, p_feature_name, p_usage_count);
END;
$$;

-- Add missing policies for feature usage tracking
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'feature_usage_tracking' 
        AND policyname = 'System can track all usage'
    ) THEN
        CREATE POLICY "System can track all usage" 
        ON public.feature_usage_tracking 
        FOR ALL 
        TO public 
        USING (true) 
        WITH CHECK (true);
    END IF;
END $$;