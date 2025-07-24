import "./global.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Import all page components
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import AdminDashboard from "./pages/AdminDashboard";
import VoterDashboard from "./pages/VoterDashboard";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import { PlaceholderPage } from "./components/PlaceholderPage";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key in .env");
}

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/features" element={<Features />} />
                <Route path="/results" element={<Results />} />
                
                {/* Protected routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/voter" element={<VoterDashboard />} />
                
                {/* Other pages */}
                <Route path="/security" element={<PlaceholderPage title="Security" description="Enterprise-grade security." />} />
                <Route path="/api" element={<PlaceholderPage title="API Docs" description="Full API documentation." />} />
                <Route path="/help" element={<PlaceholderPage title="Help Center" description="Get support." />} />
                <Route path="/status" element={<PlaceholderPage title="System Status" description="Check uptime." />} />
                <Route path="/updates" element={<PlaceholderPage title="Updates" description="See what's new." />} />
                <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" description="How we handle your data." />} />
                <Route path="/terms" element={<PlaceholderPage title="Terms" description="Our legal terms." />} />
                <Route path="/compliance" element={<PlaceholderPage title="Compliance" description="Certifications and standards." />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")!).render(<App />);