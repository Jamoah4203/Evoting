import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, UserCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { hasValidCredentials } from "@/lib/supabase";

export function DemoLogin() {
  const { signIn } = useAuth();

  if (hasValidCredentials) {
    return null;
  }

  const handleDemoLogin = async (role: "admin" | "voter") => {
    const email = role === "admin" ? "admin@jaytec.com" : "voter@jaytec.com";
    await signIn(email, "demo-password");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Demo Mode</CardTitle>
        <CardDescription>
          Try the E-Voting system with demo accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button
            onClick={() => handleDemoLogin("admin")}
            className="w-full"
            variant="default"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Login as Admin
            <Badge variant="secondary" className="ml-2 text-xs">
              Demo
            </Badge>
          </Button>

          <Button
            onClick={() => handleDemoLogin("voter")}
            className="w-full"
            variant="outline"
          >
            <User className="w-4 h-4 mr-2" />
            Login as Voter
            <Badge variant="secondary" className="ml-2 text-xs">
              Demo
            </Badge>
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500 mt-4">
          <p>Admin: Create elections, manage users</p>
          <p>Voter: Cast votes in active elections</p>
        </div>
      </CardContent>
    </Card>
  );
}
