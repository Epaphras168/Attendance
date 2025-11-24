// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js";

// const supabase = createClient(
//   Deno.env.get("SUPABASE_URL"),
//   Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
// );

// serve(async (req) => {
//   try {
//     const body = await req.json();

//     // Create the auth user without email confirmation
//     const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
//       email: body.email,
//       password: body.password,
//       email_confirm: true,
//     });

//     if (authError) throw authError;

//     // Insert into your custom users table
//     const { error: insertError } = await supabase.from("users").insert([
//       {
//         auth_id: authUser.user.id,
//         username: body.username || body.email,
//         role: body.role,
//         name: body.name,
//         phone: body.phone || null,
//         profile_img: body.profile_img || null,
//         email: body.email,
//       },
//     ]);

//     if (insertError) throw insertError;

//     return new Response(
//       JSON.stringify({ success: true, user: authUser.user }),
//       { headers: { "Content-Type": "application/json" } }
//     );
//   } catch (err) {
//     return new Response(
//       JSON.stringify({ error: err.message }),
//       { status: 400, headers: { "Content-Type": "application/json" } }
//     );
//   }
// });
