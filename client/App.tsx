import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ClerkAuthProvider } from "./contexts/ClerkAuthContext";
import { EnvironmentCheck } from "./components/EnvironmentCheck";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import AdminDashboard from "./pages/AdminDashboard";
import { PlaceholderPage } from "./components/PlaceholderPage";
import VoterDashboard from "./pages/VoterDashboard";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder";

// Only validate in runtime, not during build
if (typeof window !== "undefined" && !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key");
}

const App = () => (
  <EnvironmentCheck>
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <ClerkAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
          <Routes>
                                    <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/features" element={<Features />} />
            <Route path="/security" element={<PlaceholderPage title="Security" description="Learn about our enterprise-grade security measures and compliance standards." />} />
            <Route path="/api" element={<PlaceholderPage title="API Documentation" description="Comprehensive API documentation for developers and integrators." />} />
            <Route path="/help" element={<PlaceholderPage title="Help Center" description="Find answers to common questions and get support for your account." />} />
            <Route path="/status" element={<PlaceholderPage title="System Status" description="Check the current status of our platform and services." />} />
            <Route path="/updates" element={<PlaceholderPage title="Platform Updates" description="Stay up to date with the latest features and improvements." />} />
            <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" description="Read our comprehensive privacy policy and data handling practices." />} />
            <Route path="/terms" element={<PlaceholderPage title="Terms of Service" description="Review our terms of service and user agreement." />} />
            <Route path="/compliance" element={<PlaceholderPage title="Compliance" description="Learn about our compliance certifications and standards." />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/voter" element={<VoterDashboard />} />
            <Route path="/results" element={<Results />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </ClerkAuthProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </EnvironmentCheck>
);

createRoot(document.getElementById("root")!).render(<App />);
