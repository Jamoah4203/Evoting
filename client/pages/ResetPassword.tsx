import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, setActive } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const code = searchParams.get("code");

    if (!code) {
      setError("Missing password reset code. Please use the link from your email.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result?.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Could not complete password reset. Try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Password Reset</CardTitle>
            <CardDescription>
              Your password has been updated! Redirecting to login...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Enter a new password to reset your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Reset Password
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            <Link to="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
