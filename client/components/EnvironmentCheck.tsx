import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, ExternalLink, Copy } from "lucide-react";

interface EnvironmentIssue {
  variable: string;
  description: string;
  howToFix: string;
  link?: string;
}

const checkEnvironment = (): EnvironmentIssue[] => {
  const issues: EnvironmentIssue[] = [];

  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (
    !clerkKey ||
    clerkKey === "pk_test_placeholder" ||
    clerkKey === "pk_test_your_clerk_publishable_key" ||
    clerkKey === "pk_test_placeholder_key_for_development"
  ) {
    issues.push({
      variable: "VITE_CLERK_PUBLISHABLE_KEY",
      description: "Clerk authentication is not configured",
      howToFix: "Get your publishable key from Clerk dashboard",
      link: "https://dashboard.clerk.com/last-active?path=api-keys",
    });
  }

  if (
    !supabaseUrl ||
    supabaseUrl === "https://placeholder.supabase.co" ||
    supabaseUrl === "https://your-project-id.supabase.co"
  ) {
    issues.push({
      variable: "VITE_SUPABASE_URL",
      description: "Supabase database is not configured",
      howToFix: "Get your project URL from Supabase dashboard",
      link: "https://supabase.com/dashboard/projects",
    });
  }

  if (
    !supabaseKey ||
    supabaseKey === "placeholder-anon-key" ||
    supabaseKey === "your-supabase-anon-key"
  ) {
    issues.push({
      variable: "VITE_SUPABASE_ANON_KEY",
      description: "Supabase API key is not configured",
      howToFix: "Get your anon key from Supabase project settings",
      link: "https://supabase.com/dashboard/projects",
    });
  }

  return issues;
};

export function EnvironmentCheck({ children }: { children: React.ReactNode }) {
  const issues = checkEnvironment();

  if (issues.length === 0) {
    return <>{children}</>;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-800">
            Configuration Required
          </CardTitle>
          <CardDescription className="text-base">
            JayTec E-Voting needs to be configured before you can use it. Please
            set up the following environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {issues.map((issue, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <div>
                    <strong>{issue.variable}</strong> - {issue.description}
                  </div>
                  <div className="text-sm">
                    <strong>How to fix:</strong> {issue.howToFix}
                  </div>
                  {issue.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="mt-2"
                    >
                      <a
                        href={issue.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open Dashboard
                      </a>
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          ))}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Environment Variables Needed:</h3>
            <div className="space-y-2 text-sm font-mono">
              {issues.map((issue) => (
                <div
                  key={issue.variable}
                  className="flex items-center justify-between bg-white p-2 rounded border"
                >
                  <span>{issue.variable}=your_value_here</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(issue.variable)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              After setting up environment variables, refresh this page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>
              For detailed setup instructions, check the{" "}
              <code className="bg-gray-100 px-1 rounded">CLERK_SETUP.md</code>{" "}
              file in your project.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
