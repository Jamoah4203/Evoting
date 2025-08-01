import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@shared/database.types";

type UserProfile = Database["public"]["Tables"]["users"]["Row"];

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  isSignedIn: boolean;
  isEmailVerified: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        // Check if email is verified
        const emailVerified = user.emailAddresses[0]?.verification?.status === "verified";
        if (emailVerified) {
          fetchUserProfile(user.id);
        } else {
          // Email not verified, profile will be null
          setProfile(null);
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // If user doesn't exist in Supabase, they might be newly created
        console.log("User profile not found in Supabase:", error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await clerkSignOut();
    setProfile(null);
  };

  const isAdmin = profile?.role === "admin";
  const isEmailVerified = user?.emailAddresses[0]?.verification?.status === "verified";

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isSignedIn: isSignedIn || false,
    isEmailVerified: isEmailVerified || false,
    isAdmin,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a ClerkAuthProvider");
  }
  return context;
}
