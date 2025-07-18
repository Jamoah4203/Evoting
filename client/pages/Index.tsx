import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Shield,
  Vote,
  BarChart3,
  Users,
  Lock,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DemoNotice } from "@/components/DemoNotice";
import { DemoSlider } from "@/components/DemoSlider";

export default function Index() {
  const { user, profile, signOut } = useAuth();

  const features = [
    {
      icon: Shield,
      title: "Secure Voting",
      description:
        "End-to-end encryption ensures your vote remains private and secure",
    },
    {
      icon: Vote,
      title: "Easy to Use",
      description: "Intuitive interface makes voting simple for all users",
    },
    {
      icon: BarChart3,
      title: "Real-time Results",
      description: "Live tallying and instant result visualization",
    },
    {
      icon: Users,
      title: "Role-based Access",
      description: "Different interfaces for administrators and voters",
    },
    {
      icon: Lock,
      title: "Verified Voters",
      description:
        "Credential verification ensures only authorized voters participate",
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "High-performance platform built for large-scale elections",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Vote className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                JayTec E-Voting
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/results">
                <Button variant="ghost">Results</Button>
              </Link>
              {user ? (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, {profile?.first_name}
                  </span>
                  <Link to={profile?.role === "admin" ? "/admin" : "/voter"}>
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Button variant="outline" onClick={signOut}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <DemoNotice />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6">
              Trusted by 10,000+ Organizations
            </Badge>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
              Secure Digital
              <span className="block text-primary">Voting Platform</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Transform your elections with our state-of-the-art e-voting
              system. Secure, transparent, and user-friendly platform designed
              for modern democratic processes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Voting Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/results">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  View Results
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose JayTec E-Voting?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge security with intuitive design
              to deliver the most reliable voting experience available.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Slider */}
      <DemoSlider />

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Modernize Your Elections?
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            Join thousands of organizations who trust JayTec E-Voting for their
            democratic processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Get Started Free
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Vote className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">JayTec E-Voting</span>
              </div>
              <p className="text-gray-400">
                Secure, transparent, and reliable digital voting platform for
                the modern world.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/security" className="hover:text-white">
                    Security
                  </Link>
                </li>
                <li>
                  <Link to="/api" className="hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/status" className="hover:text-white">
                    Status
                  </Link>
                </li>
                <li>
                  <Link to="/updates" className="hover:text-white">
                    Updates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/compliance" className="hover:text-white">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 JayTec E-Voting. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
