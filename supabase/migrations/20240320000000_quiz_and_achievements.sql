-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create quiz categories table
CREATE TABLE public.quiz_categories (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id uuid REFERENCES public.quiz_categories(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    time_limit integer, -- in seconds
    total_questions integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create quiz questions table
CREATE TABLE public.quiz_questions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    quiz_id uuid REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text text NOT NULL,
    question_type text CHECK (question_type IN ('multiple_choice', 'true_false', 'open_ended')),
    correct_answer text NOT NULL,
    points integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

-- Create quiz options table (for multiple choice questions)
CREATE TABLE public.quiz_options (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    question_id uuid REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    option_text text NOT NULL,
    is_correct boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Create user quiz attempts table
CREATE TABLE public.user_quiz_attempts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id uuid REFERENCES public.quizzes(id) ON DELETE CASCADE,
    score integer DEFAULT 0,
    time_taken integer, -- in seconds
    completed_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Create user quiz answers table
CREATE TABLE public.user_quiz_answers (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    attempt_id uuid REFERENCES public.user_quiz_attempts(id) ON DELETE CASCADE,
    question_id uuid REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    user_answer text,
    is_correct boolean,
    points_earned integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- Create badges table
CREATE TABLE public.badges (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    image_url text,
    criteria text,
    points_required integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- Create user badges table
CREATE TABLE public.user_badges (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id uuid REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, badge_id)
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type text NOT NULL,
    achievement_value integer DEFAULT 0,
    last_updated timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, achievement_type)
);

-- Enable RLS on all tables
ALTER TABLE public.quiz_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
-- Quiz Categories: Public read, Admin write
CREATE POLICY "Quiz categories are public" ON public.quiz_categories FOR SELECT USING (true);
CREATE POLICY "Only admins can modify quiz categories" ON public.quiz_categories FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

-- Quizzes: Public read, Admin write
CREATE POLICY "Quizzes are public" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Only admins can modify quizzes" ON public.quizzes FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

-- Quiz Questions: Public read, Admin write
CREATE POLICY "Quiz questions are public" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Only admins can modify quiz questions" ON public.quiz_questions FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

-- Quiz Options: Public read, Admin write
CREATE POLICY "Quiz options are public" ON public.quiz_options FOR SELECT USING (true);
CREATE POLICY "Only admins can modify quiz options" ON public.quiz_options FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

-- User Quiz Attempts: Users can only see their own attempts
CREATE POLICY "Users can view their own quiz attempts" ON public.user_quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own quiz attempts" ON public.user_quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Quiz Answers: Users can only see their own answers
CREATE POLICY "Users can view their own quiz answers" ON public.user_quiz_answers FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.user_quiz_attempts WHERE id = attempt_id));
CREATE POLICY "Users can create their own quiz answers" ON public.user_quiz_answers FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.user_quiz_attempts WHERE id = attempt_id));

-- Badges: Public read, Admin write
CREATE POLICY "Badges are public" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Only admins can modify badges" ON public.badges FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

-- User Badges: Users can only see their own badges
CREATE POLICY "Users can view their own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can earn badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Achievements: Users can only see their own achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);

-- Create function to update leaderboard points when user earns points
CREATE OR REPLACE FUNCTION public.update_leaderboard_points()
RETURNS trigger AS $$
BEGIN
    UPDATE public.validly_leaderboard
    SET points = points + NEW.points_earned,
        updated_at = now()
    WHERE user_id = (
        SELECT user_id 
        FROM public.user_quiz_attempts 
        WHERE id = NEW.attempt_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update leaderboard points
CREATE TRIGGER on_quiz_answer_submitted
    AFTER INSERT ON public.user_quiz_answers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_leaderboard_points();

-- Create function to check and award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges()
RETURNS trigger AS $$
DECLARE
    total_points integer;
    badge_record record;
BEGIN
    -- Get user's total points
    SELECT points INTO total_points
    FROM public.validly_leaderboard
    WHERE user_id = NEW.user_id;

    -- Check for badges that can be awarded
    FOR badge_record IN 
        SELECT id, points_required
        FROM public.badges
        WHERE points_required <= total_points
        AND id NOT IN (
            SELECT badge_id 
            FROM public.user_badges 
            WHERE user_id = NEW.user_id
        )
    LOOP
        INSERT INTO public.user_badges (user_id, badge_id)
        VALUES (NEW.user_id, badge_record.id);
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to check for badges
CREATE TRIGGER on_leaderboard_updated
    AFTER UPDATE OF points ON public.validly_leaderboard
    FOR EACH ROW
    EXECUTE FUNCTION public.check_and_award_badges(); 