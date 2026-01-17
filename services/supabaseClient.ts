import { createClient } from '@supabase/supabase-js';

// Configuration for Supabase
// We prioritize the provided credentials. If environment variables exist (e.g. in production), they will take precedence.

const PROVIDED_URL = 'https://qubblelnrgzsfmrokjbu.supabase.co';
const PROVIDED_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1YmJsZWxucmd6c2Ztcm9ramJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MjI3MzYsImV4cCI6MjA4NDE5ODczNn0.jO7sMNUSQg8qQ66kELK6bgLmO2uKrzjGKu9mDPGxXSU';

// Try to get from environment, otherwise use the provided hardcoded values
const supabaseUrl = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || 
                    ((import.meta as any).env?.VITE_SUPABASE_URL) || 
                    PROVIDED_URL;

const supabaseAnonKey = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || 
                        ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || 
                        PROVIDED_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials are completely missing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);