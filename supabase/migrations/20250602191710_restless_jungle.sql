/*
  # Fix subscription relationships and tracking

  1. Changes
    - Add missing foreign key relationships
    - Fix subscription plan references
    - Add default free plan assignment for new users
    - Add policies for feature usage tracking
    
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Drop existing functions to recreate with fixes
DROP FUNCTION IF EXISTS get_user_plan_and_usage;

-- Ensure subscription_plans exists and has correct schema
CREATE TABLE IF NOT EXISTS subscription_plans (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE,
    price numeric(10,2) DEFAULT 0.00 NOT NULL,
    daily_time_allowance_minutes integer,
    description text,
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- Ensure user_subscriptions exists with correct relationships
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id uuid NOT NULL REFERENCES subscription_plans(id),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due')),
    subscribed_at timestamptz DEFAULT timezone('utc', now()),
    expires_at timestamptz,
    updated_at timestamptz DEFAULT timezone('utc', now())
);

-- Ensure feature_usage_tracking exists with correct relationships
CREATE TABLE IF NOT EXISTS feature_usage_tracking (
    id bigserial PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_name text NOT NULL,
    usage_count integer NOT NULL DEFAULT 1,
    used_at timestamptz DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create or replace policies
CREATE POLICY "Subscription plans are publicly viewable"
ON subscription_plans FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Users can view their own subscription"
ON user_subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can track their own feature usage"
ON feature_usage_tracking FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own usage"
ON feature_usage_tracking FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Insert default plans if they don't exist
INSERT INTO subscription_plans (name, price, daily_time_allowance_minutes, description)
VALUES 
    ('Free', 0, 20, 'Basic access with limited daily usage'),
    ('Growth', 24.99, 60, 'Extended access with increased usage limits'),
    ('Pro', 39.99, NULL, 'Unlimited access to all features')
ON CONFLICT (name) DO NOTHING;

-- Function to get free plan ID
CREATE OR REPLACE FUNCTION get_free_plan_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
    SELECT id FROM subscription_plans WHERE name = 'Free' LIMIT 1;
$$;

-- Function to ensure new users get free plan
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO user_subscriptions (user_id, plan_id, status)
    VALUES (NEW.id, get_free_plan_id(), 'active');
    RETURN NEW;
END;
$$;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update existing users without a subscription to have free plan
INSERT INTO user_subscriptions (user_id, plan_id, status)
SELECT 
    u.id,
    get_free_plan_id(),
    'active'
FROM auth.users u
LEFT JOIN user_subscriptions us ON u.id = us.user_id
WHERE us.id IS NULL;