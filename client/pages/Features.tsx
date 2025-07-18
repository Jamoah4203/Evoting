import { Button } from "@/components/ui/button";
import { Vote } from "lucide-react";
import { Link } from "react-router-dom";

export default function Features() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-6">
          <Vote className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Features Page</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          This page is coming soon. For now, explore our existing features on
          the main platform.
        </p>
        <Link to="/">
          <Button>← Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
