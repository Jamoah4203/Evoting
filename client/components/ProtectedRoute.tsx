import { useAuth } from "@/contexts/ClerkAuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isSignedIn, isEmailVerified, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // If profile is not yet loaded from Supabase, show loading
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  if (requireAdmin && profile.role !== "admin") {
    return <Navigate to="/voter" replace />;
  }

  return <>{children}</>;
}
