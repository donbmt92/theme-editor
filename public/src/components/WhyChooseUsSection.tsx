import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Globe, TrendingUp, Shield, Clock } from "lucide-react";

const WhyChooseUsSection = () => {
  const strengths = [
    {
      icon: Users,
      title: "Expert Team",
      description: "15+ years of combined experience in Vietnamese cashew export and US import regulations.",
      highlight: "Bilingual team fluent in Vietnamese and English"
    },
    {
      icon: Award,
      title: "Quality Commitment",
      description: "Rigorous quality control processes ensure only premium Grade A cashews reach your customers.",
      highlight: "ISO 22000 & HACCP certified facilities"
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Strategic partnerships with top Vietnamese farms and US logistics providers for seamless operations.",
      highlight: "Direct farm relationships in 5 provinces"
    },
    {
      icon: TrendingUp,
      title: "Market Intelligence",
      description: "Deep understanding of both Vietnamese supply and US demand patterns for optimal pricing.",
      highlight: "Weekly market reports & trend analysis"
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Comprehensive insurance coverage and contingency planning to protect your investments.",
      highlight: "100% shipment insurance included"
    },
    {
      icon: Clock,
      title: "Reliable Delivery",
      description: "Proven track record of on-time deliveries with full shipment tracking and updates.",
      highlight: "99.8% on-time delivery rate"
    }
  ];

  const mission = {
    title: "Our Mission",
    description: "To bridge the gap between Vietnamese cashew excellence and US market demand, creating lasting partnerships that benefit farmers, importers, and consumers alike.",
    values: [
      "Transparency in all transactions",
      "Sustainable farming practices",
      "Customer success focus",
      "Continuous improvement"
    ]
  };

  const vision = {
    title: "Our Vision",
    description: "To be the leading Vietnamese cashew export company in the US market, known for exceptional quality, reliable service, and innovative solutions.",
    goals: [
      "Expand to 100+ US partners by 2025",
      "Support 1,000+ Vietnamese farmers",
      "Achieve carbon-neutral shipping",
      "Launch direct-to-consumer platform"
    ]
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Why Choose VietCashew Export?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We combine Vietnamese agricultural heritage with modern export expertise to deliver unmatched value to our US partners.
          </p>
        </div>

        {/* Strengths Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {strengths.map((strength, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300 border-border/50 hover:border-primary/30">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                    <strength.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{strength.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {strength.description}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Award className="h-4 w-4 mr-1" />
                    {strength.highlight}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Mission */}
          <Card className="shadow-elegant border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center mr-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{mission.title}</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {mission.description}
              </p>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Our Core Values:</h4>
                <ul className="space-y-2">
                  {mission.values.map((value, index) => (
                    <li key={index} className="flex items-center text-foreground">
                      <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="shadow-elegant border-secondary/20">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{vision.title}</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {vision.description}
              </p>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">2025 Goals:</h4>
                <ul className="space-y-2">
                  {vision.goals.map((goal, index) => (
                    <li key={index} className="flex items-center text-foreground">
                      <div className="h-2 w-2 rounded-full bg-secondary mr-3"></div>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-hero text-white border-0 shadow-elegant">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Start Your Cashew Import Journey?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join 50+ successful US importers who trust us for their Vietnamese cashew needs. Get started with a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Schedule Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Download Company Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;