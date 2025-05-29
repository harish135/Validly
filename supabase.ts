
import { createClient } from '@supabase/supabase-js';

console.log('Starting Supabase initialization...');

// Check if all required environment variables are present
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const missingEnvVars = requiredEnvVars.filter(
  varName => !import.meta.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Log configuration (remove in production)
console.log('Supabase Config:', {
  url: supabaseUrl,
  anonKey: supabaseAnonKey ? '***' : 'missing'
});

// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
