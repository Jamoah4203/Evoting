import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Vote, Mail, Loader2, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function VerifyEmail() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user?.emailAddresses[0]?.verification?.status === "verified") {
      navigate("/voter");
    }
  }, [isLoaded, user, navigate]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const emailAddress = user.emailAddresses[0];
      await emailAddress.attemptVerification({ code });
      navigate("/voter");
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!user) return;

    setResendLoading(true);
    setError("");

    try {
      const emailAddress = user.emailAddresses[0];
      await emailAddress.prepareVerification({ strategy: "email_code" });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const emailAddress = user.emailAddresses[0]?.emailAddress;

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
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Verification Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              We sent a verification code to{" "}
              <span className="font-medium">{emailAddress}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyCode} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                  className="text-center text-lg tracking-widest"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Email
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <Button
                variant="outline"
                onClick={handleResendCode}
                disabled={resendLoading}
                className="w-full"
              >
                {resendLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Resend Code
              </Button>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              <p>Check your spam folder if you don't see the email</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
