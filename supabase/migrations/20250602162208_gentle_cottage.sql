/*
  # Subscription and Usage Tracking System

  1. New Tables
    - subscription_plans: Defines available plans and their daily time limits
    - user_subscriptions: Tracks user's current subscription plan
    - feature_usage_tracking: Logs feature usage with timestamps
    - feature_usage: Aggregates feature usage stats

  2. Security
    - Enable RLS on all tables
    - Add policies for public viewing and admin management
    - Add policies for user-specific access

  3. Functions
    - get_user_plan_and_usage: Returns user's current plan and remaining daily time
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_user_plan_and_usage(uuid);

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE,
    price numeric(10,2) DEFAULT 0.00 NOT NULL,
    daily_time_allowance_minutes integer, -- NULL for unlimited
    description text,
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

COMMENT ON TABLE public.subscription_plans IS 'Defines available subscription plans and their daily time limits.';
COMMENT ON COLUMN public.subscription_plans.daily_time_allowance_minutes IS 'Total minutes of feature usage allowed per day. NULL for unlimited.';

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id uuid NOT NULL REFERENCES public.subscription_plans(id),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due')),
    subscribed_at timestamptz DEFAULT timezone('utc', now()),
    expires_at timestamptz,
    updated_at timestamptz DEFAULT timezone('utc', now())
);

COMMENT ON TABLE public.user_subscriptions IS 'Tracks a user''s current subscription plan.';

-- Create feature usage tracking table
CREATE TABLE IF NOT EXISTS public.feature_usage_tracking (
    id bigserial PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_name text NOT NULL,
    usage_count integer NOT NULL DEFAULT 1,
    used_at timestamptz DEFAULT timezone('utc', now())
);

COMMENT ON TABLE public.feature_usage_tracking IS 'Logs each time a user consumes a feature, and for how long.';

-- Create feature usage aggregation table
CREATE TABLE IF NOT EXISTS public.feature_usage (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id),
    feature_name text NOT NULL,
    usage_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, feature_name)
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscription_plans' 
        AND policyname = 'Subscription plans are publicly viewable'
    ) THEN
        CREATE POLICY "Subscription plans are publicly viewable" ON public.subscription_plans
            FOR SELECT TO anon, authenticated USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscription_plans' 
        AND policyname = 'Admins can manage subscription plans'
    ) THEN
        CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans
            FOR ALL TO public USING (is_admin()) WITH CHECK (is_admin());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_subscriptions' 
        AND policyname = 'Users can view their own subscription'
    ) THEN
        CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions
            FOR SELECT TO authenticated USING (uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_subscriptions' 
        AND policyname = 'Admins can manage user subscriptions'
    ) THEN
        CREATE POLICY "Admins can manage user subscriptions" ON public.user_subscriptions
            FOR ALL TO public USING (is_admin()) WITH CHECK (is_admin());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'feature_usage_tracking' 
        AND policyname = 'System can insert feature usage (via trusted functions)'
    ) THEN
        CREATE POLICY "System can insert feature usage (via trusted functions)" ON public.feature_usage_tracking
            FOR INSERT TO public WITH CHECK ((uid() = user_id) OR is_admin());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'feature_usage_tracking' 
        AND policyname = 'Users can insert their own feature usage'
    ) THEN
        CREATE POLICY "Users can insert their own feature usage" ON public.feature_usage_tracking
            FOR INSERT TO authenticated WITH CHECK (uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'feature_usage_tracking' 
        AND policyname = 'Admins can view all usage'
    ) THEN
        CREATE POLICY "Admins can view all usage" ON public.feature_usage_tracking
            FOR SELECT TO public USING (is_admin());
    END IF;
END $$;

-- Create function to get user's plan and remaining usage
CREATE OR REPLACE FUNCTION get_user_plan_and_usage(p_user_id uuid)
RETURNS TABLE (
    plan_name text,
    daily_limit integer,
    is_unlimited boolean,
    minutes_used integer,
    requests_remaining integer
) LANGUAGE plpgsql SECURITY DEFINER AS $$
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

-- Insert initial subscription plans
INSERT INTO public.subscription_plans (name, price, daily_time_allowance_minutes, description) VALUES
('Free', 0, 20, 'Basic access with limited daily usage'),
('Growth', 24.99, 60, 'Extended access with increased usage limits'),
('Pro', 39.99, NULL, 'Unlimited access to all features');

-- Add trigger for updated_at
CREATE TRIGGER handle_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans
    FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

CREATE TRIGGER handle_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');