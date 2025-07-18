import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { hasValidCredentials } from "@/lib/supabase";

export function DemoNotice() {
  if (hasValidCredentials) {
    return null;
  }

  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Demo Mode:</strong> You're viewing demo data. To connect to your
        Supabase database, update the environment variables in your{" "}
        <code className="bg-blue-100 px-1 rounded">.env</code> file with your
        actual Supabase project URL and anon key.
      </AlertDescription>
    </Alert>
  );
}
