"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useUser,
  useAuth as useClerkAuth,
} from "@clerk/clerk-react";
import type { UserResource } from "@clerk/types";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  voter_id: string;
  role: "admin" | "voter";
  is_verified: boolean;
}

interface AuthContextProps {
  user: UserResource | null;
  profile: Profile | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut: clerkSignOut, getToken: clerkGetToken } = useClerkAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      try {
        // Get the user's token for Supabase auth
        const token = await clerkGetToken({ template: "supabase" });
        
        // Set up Supabase session with the token
        const { data, error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: "",
        });

        if (error) throw error;

        // Fetch user profile from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) throw profileError;

        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      }
    };

    fetchProfile();
  }, [user, clerkGetToken]);

  const getToken = async () => {
    if (!user) return null;
    return await clerkGetToken({ template: "supabase" });
  };

  const handleSignOut = async () => {
    try {
      await clerkSignOut();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoaded,
        isSignedIn,
        signOut: handleSignOut,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};