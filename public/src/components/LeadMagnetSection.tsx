import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, BookOpen, CheckCircle, TrendingUp, Shield, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LeadMagnetSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    toast({
      title: "Success!",
      description: "Your free guide is being sent to your email.",
    });
    setFormData({ name: "", email: "", company: "" });
  };

  const guideFeatures = [
    {
      icon: FileText,
      title: "Complete Documentation Checklist",
      description: "Every form, certificate, and document you need for FDA compliance"
    },
    {
      icon: TrendingUp,
      title: "Market Analysis & Pricing Trends",
      description: "Current US cashew market data and pricing insights for 2024"
    },
    {
      icon: Shield,
      title: "Quality Standards & Testing",
      description: "Detailed requirements for US import quality standards"
    },
    {
      icon: CheckCircle,
      title: "Step-by-Step Import Process",
      description: "Clear timeline from order to delivery in your warehouse"
    }
  ];

  const trustIndicators = [
    { number: "5,000+", label: "Downloads" },
    { number: "92%", label: "Success Rate" },
    { number: "4.9/5", label: "User Rating" }
  ];

  return (
    <section id="guide" className="py-20 bg-gradient-warm">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Download className="h-4 w-4 mr-2" />
              <span className="font-medium">Free Resource</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Unlock Your Import/Export Success
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get our comprehensive "2024 Vietnamese Cashew Import Guide" - everything you need to know about importing cashews to the US market successfully.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Guide Preview */}
            <div>
              <Card className="shadow-elegant border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="h-16 w-16 rounded-xl bg-gradient-primary flex items-center justify-center mr-4">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Complete Import Guide</h3>
                      <p className="text-muted-foreground">2024 Edition - 45 Pages</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {guideFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <feature.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                          <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {trustIndicators.map((indicator, index) => (
                        <div key={index}>
                          <div className="text-2xl font-bold text-primary">{indicator.number}</div>
                          <div className="text-sm text-muted-foreground">{indicator.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sign-up Form */}
            <div>
              <Card className="shadow-elegant">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Download Your Free Guide
                    </h3>
                    <p className="text-muted-foreground">
                      Enter your details below to get instant access to this valuable resource.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-foreground">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-2"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-foreground">Business Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-2"
                        placeholder="your.email@company.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company" className="text-foreground">Company Name (Optional)</Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="mt-2"
                        placeholder="Your company name"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-primary shadow-elegant hover:shadow-glow transition-all duration-300"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Free Guide Now
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By downloading, you agree to receive occasional emails about cashew import opportunities. Unsubscribe anytime.
                    </p>
                  </form>

                  {/* Additional Trust Elements */}
                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-1" />
                        <span>100% Secure</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>No Spam</span>
                      </div>
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        <span>Instant Download</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetSection;