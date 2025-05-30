-- Insert Quiz Categories
INSERT INTO public.quiz_categories (name, description) VALUES
('JavaScript Fundamentals', 'Basic concepts and syntax of JavaScript programming language'),
('React Development', 'Modern React concepts, hooks, and best practices'),
('TypeScript', 'TypeScript features, type system, and advanced concepts'),
('Web Development', 'HTML, CSS, and general web development concepts'),
('System Design', 'Software architecture and system design principles');

-- Insert Badges
INSERT INTO public.badges (name, description, image_url, criteria, points_required) VALUES
('JavaScript Novice', 'Completed basic JavaScript quizzes', '/badges/js-novice.png', 'Score 80% or higher in JavaScript Fundamentals', 100),
('React Enthusiast', 'Mastered React basics', '/badges/react-enthusiast.png', 'Complete 5 React quizzes with 90% or higher', 250),
('TypeScript Expert', 'Advanced TypeScript knowledge', '/badges/ts-expert.png', 'Complete all TypeScript quizzes with 95% or higher', 500),
('Web Master', 'Comprehensive web development knowledge', '/badges/web-master.png', 'Complete all web development quizzes', 750),
('System Architect', 'Expert in system design', '/badges/system-architect.png', 'Complete all system design challenges', 1000);

-- Insert Quizzes
INSERT INTO public.quizzes (category_id, title, description, difficulty_level, time_limit, total_questions) 
SELECT 
    (SELECT id FROM public.quiz_categories WHERE name = 'JavaScript Fundamentals'),
    'JavaScript Basics',
    'Test your knowledge of JavaScript fundamentals including variables, data types, and basic operations',
    'beginner',
    900, -- 15 minutes
    10;

INSERT INTO public.quizzes (category_id, title, description, difficulty_level, time_limit, total_questions) 
SELECT 
    (SELECT id FROM public.quiz_categories WHERE name = 'React Development'),
    'React Hooks',
    'Deep dive into React Hooks including useState, useEffect, and custom hooks',
    'intermediate',
    1200, -- 20 minutes
    15;

INSERT INTO public.quizzes (category_id, title, description, difficulty_level, time_limit, total_questions) 
SELECT 
    (SELECT id FROM public.quiz_categories WHERE name = 'TypeScript'),
    'TypeScript Types',
    'Advanced TypeScript type system concepts and best practices',
    'advanced',
    1800, -- 30 minutes
    20;

-- Insert Questions for JavaScript Basics Quiz
INSERT INTO public.quiz_questions (quiz_id, question_text, question_type, correct_answer, points)
SELECT 
    (SELECT id FROM public.quizzes WHERE title = 'JavaScript Basics'),
    'What is the correct way to declare a constant in JavaScript?',
    'multiple_choice',
    'const',
    1;

-- Insert Options for the first question
INSERT INTO public.quiz_options (question_id, option_text, is_correct)
SELECT 
    (SELECT id FROM public.quiz_questions WHERE question_text = 'What is the correct way to declare a constant in JavaScript?'),
    'const',
    true;

INSERT INTO public.quiz_options (question_id, option_text, is_correct)
SELECT 
    (SELECT id FROM public.quiz_questions WHERE question_text = 'What is the correct way to declare a constant in JavaScript?'),
    'let',
    false;

INSERT INTO public.quiz_options (question_id, option_text, is_correct)
SELECT 
    (SELECT id FROM public.quiz_questions WHERE question_text = 'What is the correct way to declare a constant in JavaScript?'),
    'var',
    false;

-- Insert Questions for React Hooks Quiz
INSERT INTO public.quiz_questions (quiz_id, question_text, question_type, correct_answer, points)
SELECT 
    (SELECT id FROM public.quizzes WHERE title = 'React Hooks'),
    'Which hook is used for side effects in React?',
    'multiple_choice',
    'useEffect',
    1;

-- Insert Options for the React question
INSERT INTO public.quiz_options (question_id, option_text, is_correct)
SELECT 
    (SELECT id FROM public.quiz_questions WHERE question_text = 'Which hook is used for side effects in React?'),
    'useEffect',
    true;

INSERT INTO public.quiz_options (question_id, option_text, is_correct)
SELECT 
    (SELECT id FROM public.quiz_questions WHERE question_text = 'Which hook is used for side effects in React?'),
    'useState',
    false;

INSERT INTO public.quiz_options (question_id, option_text, is_correct)
SELECT 
    (SELECT id FROM public.quiz_questions WHERE question_text = 'Which hook is used for side effects in React?'),
    'useContext',
    false;

-- Insert Questions for TypeScript Quiz
INSERT INTO public.quiz_questions (quiz_id, question_text, question_type, correct_answer, points)
SELECT 
    (SELECT id FROM public.quizzes WHERE title = 'TypeScript Types'),
    'What is the TypeScript type for a function that takes no parameters and returns void?',
    'multiple_choice',
    '() => void',
    1;

-- Insert Options for the TypeScript question
INSERT INTO public.quiz_options (question_id, option_text, is_correct)
SELECT 
    (SELECT id FROM public.quiz_questions WHERE question_text = 'What is the TypeScript type for a function that takes no parameters and returns void?'),
    '() => void',
    true;

INSERT INTO public.quiz_options (question_id, option_text, is_correct)
SELECT 
    (SELECT id FROM public.quiz_questions WHERE question_text = 'What is the TypeScript type for a function that takes no parameters and returns void?'),
    'void => void',
    false;

INSERT INTO public.quiz_options (question_id, option_text, is_correct)
SELECT 
    (SELECT id FROM public.quiz_questions WHERE question_text = 'What is the TypeScript type for a function that takes no parameters and returns void?'),
    'Function<void>',
    false;

-- Insert some initial user achievements
INSERT INTO public.user_achievements (user_id, achievement_type, achievement_value)
SELECT 
    auth.uid(),
    'quizzes_completed',
    0
FROM auth.users
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_achievements 
    WHERE user_id = auth.uid() 
    AND achievement_type = 'quizzes_completed'
);

INSERT INTO public.user_achievements (user_id, achievement_type, achievement_value)
SELECT 
    auth.uid(),
    'total_points',
    0
FROM auth.users
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_achievements 
    WHERE user_id = auth.uid() 
    AND achievement_type = 'total_points'
); 