import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    console.log("AuthProvider mounted");

    const fetchUser = async () => {
      try {
        console.log("Fetching session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Session:", session, "Error:", error);

        if (error) throw error;

        if (session?.user && isMounted) {
          console.log("Session user found, fetching from users table...");
          const { data: userRecord, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("auth_id", session.user.id)
            .single();

          if (userError) throw userError;

          setCurrentUser({ ...session.user, ...userRecord });
          console.log("Current user set:", { ...session.user, ...userRecord });
        } else if (isMounted) {
          setCurrentUser(null);
          console.log("No session user found");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        if (isMounted) setCurrentUser(null);
      } finally {
        if (isMounted) setLoading(false);
        console.log("Loading finished");
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };

    const { data: userRecord } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", data.user.id)
      .single();

    const userWithRole = { ...data.user, ...userRecord };
    setCurrentUser(userWithRole);
    return { user: userWithRole };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const value = { currentUser, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center text-xl">
          Loading...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
