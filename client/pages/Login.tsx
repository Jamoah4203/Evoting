import { useEffect } from "react";
import { SignIn, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Vote } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const emailVerified = user.emailAddresses[0]?.verification?.status === "verified";
      if (emailVerified) {
        navigate("/voter"); // Will redirect to admin if user is admin
      } else {
        navigate("/verify-email");
      }
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Vote className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                JayTec E-Voting
              </span>
            </Link>
            <Link to="/">
              <span className="text-sm text-gray-600 hover:text-gray-900">
                ← Back to Home
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">
              Sign in to your JayTec E-Voting account
            </p>
          </div>
          
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-xl border-0",
              },
            }}
            redirectUrl="/voter"
          />
        </div>
      </div>
    </div>
  );
}
