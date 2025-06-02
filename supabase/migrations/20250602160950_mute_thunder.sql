/*
  # Seed data for quiz system
  
  1. Initial Data
    - Quiz categories
    - Badges
    - Sample quizzes with questions and options
  
  2. Structure
    - Uses explicit IDs for reliable references
    - Avoids problematic subqueries
    - Maintains data relationships
*/

-- Insert Quiz Categories
INSERT INTO public.quiz_categories (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'JavaScript Fundamentals', 'Basic concepts and syntax of JavaScript programming language'),
('22222222-2222-2222-2222-222222222222', 'React Development', 'Modern React concepts, hooks, and best practices'),
('33333333-3333-3333-3333-333333333333', 'TypeScript', 'TypeScript features, type system, and advanced concepts'),
('44444444-4444-4444-4444-444444444444', 'Web Development', 'HTML, CSS, and general web development concepts'),
('55555555-5555-5555-5555-555555555555', 'System Design', 'Software architecture and system design principles');

-- Insert Badges
INSERT INTO public.badges (id, name, description, image_url, criteria, points_required) VALUES
('b1111111-1111-1111-1111-111111111111', 'JavaScript Novice', 'Completed basic JavaScript quizzes', '/badges/js-novice.png', 'Score 80% or higher in JavaScript Fundamentals', 100),
('b2222222-2222-2222-2222-222222222222', 'React Enthusiast', 'Mastered React basics', '/badges/react-enthusiast.png', 'Complete 5 React quizzes with 90% or higher', 250),
('b3333333-3333-3333-3333-333333333333', 'TypeScript Expert', 'Advanced TypeScript knowledge', '/badges/ts-expert.png', 'Complete all TypeScript quizzes with 95% or higher', 500),
('b4444444-4444-4444-4444-444444444444', 'Web Master', 'Comprehensive web development knowledge', '/badges/web-master.png', 'Complete all web development quizzes', 750),
('b5555555-5555-5555-5555-555555555555', 'System Architect', 'Expert in system design', '/badges/system-architect.png', 'Complete all system design challenges', 1000);

-- Insert Quizzes with explicit IDs
INSERT INTO public.quizzes (id, category_id, title, description, difficulty_level, time_limit, total_questions) VALUES
('q1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'JavaScript Basics', 'Test your knowledge of JavaScript fundamentals including variables, data types, and basic operations', 'beginner', 900, 10),
('q2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'React Hooks', 'Deep dive into React Hooks including useState, useEffect, and custom hooks', 'intermediate', 1200, 15),
('q3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'TypeScript Types', 'Advanced TypeScript type system concepts and best practices', 'advanced', 1800, 20);

-- Insert Questions with explicit IDs
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, correct_answer, points) VALUES
('qq111111-1111-1111-1111-111111111111', 'q1111111-1111-1111-1111-111111111111', 'What is the correct way to declare a constant in JavaScript?', 'multiple_choice', 'const', 1),
('qq222222-2222-2222-2222-222222222222', 'q2222222-2222-2222-2222-222222222222', 'Which hook is used for side effects in React?', 'multiple_choice', 'useEffect', 1),
('qq333333-3333-3333-3333-333333333333', 'q3333333-3333-3333-3333-333333333333', 'What is the TypeScript type for a function that takes no parameters and returns void?', 'multiple_choice', '() => void', 1);

-- Insert Options for JavaScript question
INSERT INTO public.quiz_options (question_id, option_text, is_correct) VALUES
('qq111111-1111-1111-1111-111111111111', 'const', true),
('qq111111-1111-1111-1111-111111111111', 'let', false),
('qq111111-1111-1111-1111-111111111111', 'var', false);

-- Insert Options for React question
INSERT INTO public.quiz_options (question_id, option_text, is_correct) VALUES
('qq222222-2222-2222-2222-222222222222', 'useEffect', true),
('qq222222-2222-2222-2222-222222222222', 'useState', false),
('qq222222-2222-2222-2222-222222222222', 'useContext', false);

-- Insert Options for TypeScript question
INSERT INTO public.quiz_options (question_id, option_text, is_correct) VALUES
('qq333333-3333-3333-3333-333333333333', '() => void', true),
('qq333333-3333-3333-3333-333333333333', 'void => void', false),
('qq333333-3333-3333-3333-333333333333', 'Function<void>', false);

-- Note: Removed problematic user achievement inserts that depended on auth.uid()
-- These should be handled by the application logic when users sign up