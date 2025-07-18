import { createClient } from "@supabase/supabase-js";
import { Database } from "@shared/database.types";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://demo.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "demo-anon-key";

// Check if we have valid Supabase credentials
const hasValidCredentials =
  supabaseUrl !== "https://demo.supabase.co" &&
  supabaseAnonKey !== "demo-anon-key" &&
  supabaseUrl.includes(".supabase.co");

if (!hasValidCredentials) {
  console.warn(
    "⚠️ Supabase credentials not configured. Please update your .env file with valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
export { hasValidCredentials };
