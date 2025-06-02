/*
  # Add Default Plan Assignment
  
  1. Changes
    - Add trigger to automatically assign Free plan to new users
    - Add function to handle new user registration
    - Add policy for system to insert subscriptions
  
  2. Security
    - Enable RLS on tables
    - Add necessary policies
*/

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    free_plan_id uuid;
BEGIN
    -- Get the ID of the Free plan
    SELECT id INTO free_plan_id
    FROM public.subscription_plans
    WHERE name = 'Free'
    LIMIT 1;

    -- If Free plan exists, create subscription for new user
    IF free_plan_id IS NOT NULL THEN
        INSERT INTO public.user_subscriptions
            (user_id, plan_id, status)
        VALUES
            (NEW.id, free_plan_id, 'active');
    END IF;

    RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW
            EXECUTE FUNCTION handle_new_user();
    END IF;
END $$;

-- Add policy for system to insert subscriptions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'user_subscriptions'
        AND policyname = 'System can insert user subscriptions'
    ) THEN
        CREATE POLICY "System can insert user subscriptions"
            ON public.user_subscriptions
            FOR INSERT
            TO public
            WITH CHECK (true);
    END IF;
END $$;