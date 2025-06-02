/*
  # Fix Usage Tracking Function
  
  1. Changes
    - Drop and recreate get_user_plan_and_usage with proper type casting
    - Add explicit schema references
    - Fix return type consistency
  
  2. Security
    - Add proper security definer settings
    - Set search path explicitly
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_user_plan_and_usage(uuid);

-- Recreate the function with proper permissions and type casting
CREATE OR REPLACE FUNCTION public.get_user_plan_and_usage(p_user_id uuid)
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
        SELECT COALESCE(CAST(SUM(usage_count) AS integer), 0) as total_minutes
        FROM public.feature_usage_tracking
        WHERE user_id = p_user_id
        AND used_at >= CURRENT_DATE
    )
    SELECT 
        sp.name::text as plan_name,
        CAST(sp.daily_time_allowance_minutes AS integer) as daily_limit,
        (sp.daily_time_allowance_minutes IS NULL)::boolean as is_unlimited,
        CAST(COALESCE(du.total_minutes, 0) AS integer) as minutes_used,
        CAST(
            CASE 
                WHEN sp.daily_time_allowance_minutes IS NULL THEN -1
                ELSE GREATEST(0, sp.daily_time_allowance_minutes - COALESCE(du.total_minutes, 0))
            END 
        AS integer) as requests_remaining
    FROM public.user_subscriptions us
    JOIN public.subscription_plans sp ON us.plan_id = sp.id
    LEFT JOIN daily_usage du ON true
    WHERE us.user_id = p_user_id
    AND us.status = 'active'
    AND (us.expires_at IS NULL OR us.expires_at > now())
    LIMIT 1;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_user_plan_and_usage(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_plan_and_usage(uuid) TO anon;