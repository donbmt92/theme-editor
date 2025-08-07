import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ArrowRight, Shield, Clock, DollarSign, Truck } from "lucide-react";

const ProblemSolutionSection = () => {
  const problems = [
    {
      icon: AlertTriangle,
      title: "Complex Import Regulations",
      description: "Navigating FDA requirements and US customs can be overwhelming for new importers."
    },
    {
      icon: Clock,
      title: "Unreliable Supply Chains",
      description: "Finding consistent, high-quality cashew suppliers with timely delivery is challenging."
    },
    {
      icon: DollarSign,
      title: "Hidden Costs & Pricing",
      description: "Unexpected fees and fluctuating prices can destroy profit margins."
    },
    {
      icon: Shield,
      title: "Quality Concerns",
      description: "Ensuring product quality and safety standards across international shipments."
    }
  ];

  const solutions = [
    {
      icon: CheckCircle,
      title: "Full Regulatory Compliance",
      description: "We handle all FDA, USDA, and customs documentation to ensure smooth clearance.",
      benefit: "100% Compliant Deliveries"
    },
    {
      icon: Truck,
      title: "Reliable Supply Network",
      description: "Direct partnerships with premium Vietnamese cashew farms ensure consistent quality and supply.",
      benefit: "On-Time Delivery Guarantee"
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "Fixed pricing with no hidden fees. You know exactly what you'll pay upfront.",
      benefit: "Predictable Costs"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Rigorous testing and certification processes ensure only the best cashews reach you.",
      benefit: "Premium Grade Products"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Solving Real Import/Export Challenges
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We understand the pain points of importing cashews from Vietnam. Here's how we solve them for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Problems */}
          <div>
            <div className="flex items-center mb-8">
              <AlertTriangle className="h-8 w-8 text-destructive mr-3" />
              <h3 className="text-2xl font-bold text-foreground">Common Challenges</h3>
            </div>
            <div className="space-y-6">
              {problems.map((problem, index) => (
                <Card key={index} className="border-destructive/20 hover:border-destructive/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <problem.icon className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{problem.title}</h4>
                        <p className="text-muted-foreground">{problem.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <div className="flex items-center mb-8">
              <CheckCircle className="h-8 w-8 text-success-green mr-3" />
              <h3 className="text-2xl font-bold text-foreground">Our Solutions</h3>
            </div>
            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <Card key={index} className="border-success-green/20 hover:border-success-green/40 transition-colors shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <solution.icon className="h-6 w-6 text-success-green mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2">{solution.title}</h4>
                        <p className="text-muted-foreground mb-3">{solution.description}</p>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-success-green/10 text-success-green text-sm font-medium">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {solution.benefit}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* USP Section */}
        <div className="mt-20 text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-primary text-white border-0 shadow-elegant">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">Why Choose VietCashew Export?</h3>
              <p className="text-xl mb-8 opacity-90">
                We're the only cashew export company that combines Vietnamese agricultural expertise with deep US market knowledge, offering end-to-end solutions that eliminate all import headaches.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">15+</div>
                  <div className="opacity-90">Years in US Market</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="opacity-90">Successful Shipments</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">99.8%</div>
                  <div className="opacity-90">On-Time Delivery</div>
                </div>
              </div>
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Learn More About Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;