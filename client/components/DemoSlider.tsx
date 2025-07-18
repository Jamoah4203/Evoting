import { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  LogIn,
  Vote,
  BarChart3,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: string;
  image?: string;
}

const demoSteps: DemoStep[] = [
  {
    id: 1,
    title: "Sign In",
    description:
      "Login with your credentials or use demo accounts to explore the platform",
    icon: LogIn,
    action: "Click 'Login as Admin' or 'Login as Voter'",
  },
  {
    id: 2,
    title: "Cast Your Vote",
    description:
      "Browse active elections and vote for your preferred candidates",
    icon: Vote,
    action: "Select candidates and click 'Submit Votes'",
  },
  {
    id: 3,
    title: "View Results",
    description:
      "See real-time election results with beautiful charts and analytics",
    icon: BarChart3,
    action: "Visit the Results page to see live tallies",
  },
];

export function DemoSlider() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % demoSteps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  const currentDemoStep = demoSteps[currentStep];

  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Interactive Demo
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            See How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the complete voting process in three simple steps
          </p>
        </div>

        <div className="relative">
          <Card className="overflow-hidden border-2 border-primary/10">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <currentDemoStep.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Step {currentStep + 1}: {currentDemoStep.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {currentDemoStep.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-2">What to do:</h3>
                    <p className="text-gray-700">{currentDemoStep.action}</p>
                  </div>

                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={prevStep}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <Button onClick={nextStep}>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <currentDemoStep.icon className="w-16 h-16 text-primary mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">
                        {currentDemoStep.title} Preview
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Interactive demo coming soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step indicators */}
              <div className="flex justify-center space-x-2 mt-8">
                {demoSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      index === currentStep
                        ? "bg-primary"
                        : "bg-gray-300 hover:bg-gray-400",
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">Ready to try it yourself?</p>
          <div className="flex justify-center space-x-4">
            <Button asChild>
              <a href="/login">Try Demo</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/results">View Results</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
