import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Vote,
  Check,
  Star,
  Users,
  Shield,
  BarChart3,
  Headphones,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
  maxVoters: string;
  maxElections: string;
  support: string;
  icon: React.ComponentType<{ className?: string }>;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small organizations and clubs",
    monthlyPrice: 29,
    yearlyPrice: 290,
    maxVoters: "Up to 100 voters",
    maxElections: "5 elections/month",
    support: "Email support",
    icon: Users,
    features: [
      "Basic election management",
      "Real-time results",
      "Email notifications",
      "Basic analytics",
      "SSL security",
      "Mobile responsive",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Great for schools and medium organizations",
    monthlyPrice: 79,
    yearlyPrice: 790,
    popular: true,
    maxVoters: "Up to 1,000 voters",
    maxElections: "Unlimited elections",
    support: "Priority email & chat",
    icon: Vote,
    features: [
      "Everything in Starter",
      "Advanced analytics",
      "Custom branding",
      "Multi-language support",
      "API access",
      "Role-based permissions",
      "Audit trails",
      "Export capabilities",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large institutions and governments",
    monthlyPrice: 199,
    yearlyPrice: 1990,
    maxVoters: "Unlimited voters",
    maxElections: "Unlimited elections",
    support: "24/7 phone & chat",
    icon: Shield,
    features: [
      "Everything in Professional",
      "Advanced security features",
      "Custom integrations",
      "Dedicated account manager",
      "On-premise deployment",
      "SLA guarantee",
      "Custom reporting",
      "Training & onboarding",
    ],
  },
];

const features = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption and SOC 2 compliance",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Live results and comprehensive reporting",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for high-traffic elections",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock assistance when you need it",
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
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
              <Button variant="ghost">← Back to Home</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your organization. No hidden fees, no
            long-term contracts.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span
              className={cn(
                "text-sm font-medium",
                !isYearly ? "text-gray-900" : "text-gray-500",
              )}
            >
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span
              className={cn(
                "text-sm font-medium",
                isYearly ? "text-gray-900" : "text-gray-500",
              )}
            >
              Yearly
            </span>
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative",
                plan.popular &&
                  "border-2 border-primary shadow-xl scale-105 z-10",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-gray-900">
                    $
                    {isYearly
                      ? Math.round(plan.yearlyPrice / 12)
                      : plan.monthlyPrice}
                  </div>
                  <div className="text-sm text-gray-500">
                    per month{isYearly && ", billed annually"}
                  </div>
                  {isYearly && (
                    <div className="text-sm text-green-600 font-medium">
                      Save ${plan.monthlyPrice * 12 - plan.yearlyPrice}/year
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {plan.maxVoters}
                  </div>
                  <div className="flex items-center">
                    <Vote className="w-4 h-4 mr-2" />
                    {plan.maxElections}
                  </div>
                  <div className="flex items-center">
                    <Headphones className="w-4 h-4 mr-2" />
                    {plan.support}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className="w-full mt-6"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link to="/register">
                    Get Started
                    {plan.popular ? " - Most Popular" : ""}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose JayTec E-Voting?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            All plans include our core features that make elections secure,
            transparent, and easy to manage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Have questions? We have answers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    Can I change plans anytime?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Yes, you can upgrade or downgrade your plan at any time.
                    Changes take effect immediately.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Is there a free trial?</h4>
                  <p className="text-sm text-gray-600">
                    We offer a 14-day free trial on all plans. No credit card
                    required.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    What payment methods do you accept?
                  </h4>
                  <p className="text-sm text-gray-600">
                    We accept all major credit cards, PayPal, and bank transfers
                    for enterprise customers.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    Do you offer custom solutions?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Yes, we provide custom solutions for large organizations
                    with specific requirements.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Is my data secure?</h4>
                  <p className="text-sm text-gray-600">
                    Absolutely. We use enterprise-grade security and are SOC 2
                    compliant. Your data is encrypted and protected.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, you can cancel your subscription at any time. No
                    cancellation fees.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of organizations using JayTec E-Voting for their
            elections.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" asChild>
              <Link to="/register">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
