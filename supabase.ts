import { createClient } from '@supabase/supabase-js';

// console.log('Starting Supabase initialization...'); // Optional: for debugging, remove for production

// Check if all required environment variables are present
const requiredEnvVars: string[] = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const missingEnvVars: string[] = requiredEnvVars.filter(
  (varName: string) => !(import.meta.env[varName])
);

if (missingEnvVars.length > 0) {
  const errorMessage = `Missing required environment variables: ${missingEnvVars.join(', ')}`;
  console.error(errorMessage);
  // In a real app, you might want to display this error to the user or prevent app initialization
  throw new Error(errorMessage);
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Optional: Log configuration (remove or use conditional logging for production)
// if (import.meta.env.MODE === 'development') {
//   console.log('Supabase Config Initializing With:', {
//     url: supabaseUrl,
//     anonKey: supabaseAnonKey ? '***ANON_KEY_PRESENT***' : 'ANON_KEY_MISSING'
//   });
// }

// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };