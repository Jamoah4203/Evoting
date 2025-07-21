import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, hasValidCredentials } from "@/lib/supabase";
import { Database } from "@shared/database.types";

type UserProfile = Database["public"]["Tables"]["users"]["Row"];

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    userData: {
      first_name: string;
      last_name: string;
      voterId: string;
      role: "voter" | "admin";
    },
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Create demo profile if no valid Supabase credentials
  const createDemoProfile = (
    role: "admin" | "voter" = "admin",
  ): UserProfile => ({
    id: "demo-user-id",
    email: "demo@jaytec.com",
    voter_id: "DEMO001",
    first_name: "Demo",
    last_name: "User",
    role,
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  useEffect(() => {
    if (!hasValidCredentials) {
      // Demo mode - no Supabase connection
      console.log(
        "🎭 Running in demo mode. Please configure Supabase credentials for full functionality.",
      );
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
  const { email, password, first_name, last_name, voterId, role } = userData;

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
        voter_id: voterId,
        role,
        is_verified: false,
      },
    },
  });

  if (signUpError) return { error: signUpError };

  if (data.user) {
    const { error: rpcError } = await supabase.rpc('create_user_profile', {
      _id: data.user.id,
      _email: email,
      _first_name: first_name,
      _last_name: last_name,
      _voter_id: voterId,
      _role: role,
      _is_verified: false,
    });

    if (rpcError) return { error: rpcError };
  }

  return { error: null };
};

  const signIn = async (email: string, password: string) => {
    if (!hasValidCredentials) {
      // Demo mode - simulate successful login
      const role = email.includes("admin") ? "admin" : "voter";
      setProfile(createDemoProfile(role));
      setUser({ email } as User);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    if (!hasValidCredentials) {
      // Demo mode
      setUser(null);
      setProfile(null);
      return;
    }

    await supabase.auth.signOut();
  };

  const isAdmin = profile?.role === "admin";

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
