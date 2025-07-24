import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@clerk/clerk-react";

export default function Contact() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.firstName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    subject: "",
    message: "",
    inquiryType: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSuccess(true);
      // Don't clear name/email for authenticated users
      setFormData({
        ...formData,
        subject: "",
        message: "",
        inquiryType: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary-foreground" />
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about JayTec E-Voting? Our team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Reach us through these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">support@jaytec-voting.com</p>
                    <p className="text-sm text-gray-500 mt-1">Typically responds within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">+1 (800) 555-0199</p>
                    <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9AM-5PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Headquarters</p>
                    <p className="text-gray-600">123 Democracy Way</p>
                    <p className="text-gray-600">Washington, DC 20001</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Help Center</h4>
                  <p className="text-sm text-gray-600">
                    Browse our knowledge base for answers to common questions.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">System Status</h4>
                  <p className="text-sm text-gray-600">
                    Check current platform availability and incident reports.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">API Documentation</h4>
                  <p className="text-sm text-gray-600">
                    Technical resources for developers integrating with our platform.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                We'll respond to your inquiry as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                  <h3 className="text-xl font-semibold">Message Received!</h3>
                  <p className="text-gray-600">
                    Thank you for contacting us. Our team will get back to you shortly.
                  </p>
                  <Button 
                    onClick={() => setSuccess(false)} 
                    variant="outline"
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        disabled={!!user}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        disabled={!!user}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">Inquiry Type</Label>
                    <Select
                      value={formData.inquiryType}
                      onValueChange={(value) => handleInputChange("inquiryType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="sales">Sales Inquiry</SelectItem>
                        <SelectItem value="account">Account Help</SelectItem>
                        <SelectItem value="feedback">Product Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}