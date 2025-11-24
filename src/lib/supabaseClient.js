import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dcklpblwrzqtcgrijqus.supabase.co"; // replace with your Supabase project URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRja2xwYmx3cnpxdGNncmlqcXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0Mjk3NjksImV4cCI6MjA3MzAwNTc2OX0.MmEIEbuOQsYDhns0JOzpWScmgs0xOh4U4uuZN72igSw"; // replace with your anon key
export const supabase = createClient(supabaseUrl, supabaseKey);


// export const supabase = createClient(
//   "https://dcklpblwrzqtcgrijqus.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRja2xwYmx3cnpxdGNncmlqcXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0Mjk3NjksImV4cCI6MjA3MzAwNTc2OX0.MmEIEbuOQsYDhns0JOzpWScmgs0xOh4U4uuZN72igSw" // make sure it's the anon key, not service role
// );
