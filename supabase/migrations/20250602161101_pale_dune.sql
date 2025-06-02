/*
  # Seed Quiz and Achievement Data
  
  1. New Data
    - Quiz categories
    - Badges
    - Sample quizzes with questions and options
  2. Changes
    - Uses proper UUID v4 format for all IDs
    - Maintains relationships between tables
*/

-- Insert Quiz Categories
INSERT INTO public.quiz_categories (id, name, description) VALUES
('11111111-2222-3333-4444-555555555555', 'JavaScript Fundamentals', 'Basic concepts and syntax of JavaScript programming language'),
('22222222-3333-4444-5555-666666666666', 'React Development', 'Modern React concepts, hooks, and best practices'),
('33333333-4444-5555-6666-777777777777', 'TypeScript', 'TypeScript features, type system, and advanced concepts'),
('44444444-5555-6666-7777-888888888888', 'Web Development', 'HTML, CSS, and general web development concepts'),
('55555555-6666-7777-8888-999999999999', 'System Design', 'Software architecture and system design principles');

-- Insert Badges
INSERT INTO public.badges (id, name, description, image_url, criteria, points_required) VALUES
('bbbbbbbb-2222-3333-4444-555555555555', 'JavaScript Novice', 'Completed basic JavaScript quizzes', '/badges/js-novice.png', 'Score 80% or higher in JavaScript Fundamentals', 100),
('bbbbbbbb-3333-4444-5555-666666666666', 'React Enthusiast', 'Mastered React basics', '/badges/react-enthusiast.png', 'Complete 5 React quizzes with 90% or higher', 250),
('bbbbbbbb-4444-5555-6666-777777777777', 'TypeScript Expert', 'Advanced TypeScript knowledge', '/badges/ts-expert.png', 'Complete all TypeScript quizzes with 95% or higher', 500),
('bbbbbbbb-5555-6666-7777-888888888888', 'Web Master', 'Comprehensive web development knowledge', '/badges/web-master.png', 'Complete all web development quizzes', 750),
('bbbbbbbb-6666-7777-8888-999999999999', 'System Architect', 'Expert in system design', '/badges/system-architect.png', 'Complete all system design challenges', 1000);

-- Insert Quizzes with explicit IDs
INSERT INTO public.quizzes (id, category_id, title, description, difficulty_level, time_limit, total_questions) VALUES
('aaaaaaaa-2222-3333-4444-555555555555', '11111111-2222-3333-4444-555555555555', 'JavaScript Basics', 'Test your knowledge of JavaScript fundamentals including variables, data types, and basic operations', 'beginner', 900, 10),
('aaaaaaaa-3333-4444-5555-666666666666', '22222222-3333-4444-5555-666666666666', 'React Hooks', 'Deep dive into React Hooks including useState, useEffect, and custom hooks', 'intermediate', 1200, 15),
('aaaaaaaa-4444-5555-6666-777777777777', '33333333-4444-5555-6666-777777777777', 'TypeScript Types', 'Advanced TypeScript type system concepts and best practices', 'advanced', 1800, 20);

-- Insert Questions with explicit IDs
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, correct_answer, points) VALUES
('cccccccc-2222-3333-4444-555555555555', 'aaaaaaaa-2222-3333-4444-555555555555', 'What is the correct way to declare a constant in JavaScript?', 'multiple_choice', 'const', 1),
('cccccccc-3333-4444-5555-666666666666', 'aaaaaaaa-3333-4444-5555-666666666666', 'Which hook is used for side effects in React?', 'multiple_choice', 'useEffect', 1),
('cccccccc-4444-5555-6666-777777777777', 'aaaaaaaa-4444-5555-6666-777777777777', 'What is the TypeScript type for a function that takes no parameters and returns void?', 'multiple_choice', '() => void', 1);

-- Insert Options for JavaScript question
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct) VALUES
('dddddddd-2222-3333-4444-555555555555', 'cccccccc-2222-3333-4444-555555555555', 'const', true),
('dddddddd-3333-3333-4444-555555555555', 'cccccccc-2222-3333-4444-555555555555', 'let', false),
('dddddddd-4444-3333-4444-555555555555', 'cccccccc-2222-3333-4444-555555555555', 'var', false);

-- Insert Options for React question
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct) VALUES
('dddddddd-2222-4444-5555-666666666666', 'cccccccc-3333-4444-5555-666666666666', 'useEffect', true),
('dddddddd-3333-4444-5555-666666666666', 'cccccccc-3333-4444-5555-666666666666', 'useState', false),
('dddddddd-4444-4444-5555-666666666666', 'cccccccc-3333-4444-5555-666666666666', 'useContext', false);

-- Insert Options for TypeScript question
INSERT INTO public.quiz_options (id, question_id, option_text, is_correct) VALUES
('dddddddd-2222-5555-6666-777777777777', 'cccccccc-4444-5555-6666-777777777777', '() => void', true),
('dddddddd-3333-5555-6666-777777777777', 'cccccccc-4444-5555-6666-777777777777', 'void => void', false),
('dddddddd-4444-5555-6666-777777777777', 'cccccccc-4444-5555-6666-777777777777', 'Function<void>', false);