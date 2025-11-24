import { createClient } from "@supabase/supabase-js";

// Make sure to use your anon key here
const supabase = createClient(
  "https://dcklpblwrzqtcgrijqus.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRja2xwYmx3cnpxdGNncmlqcXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0Mjk3NjksImV4cCI6MjA3MzAwNTc2OX0.MmEIEbuOQsYDhns0JOzpWScmgs0xOh4U4uuZN72igSw"
);

async function test() {
  try {
    console.log("🚀 Starting Supabase test fetch...");
    const { data, error } = await supabase.from("users").select("*").limit(1);
    console.log("✅ Data:", data);
    console.log("⚠️ Error:", error);
  } catch (err) {
    console.error("❌ Exception:", err);
  }
}

// Call the function
test().then(() => console.log("Test complete"));
