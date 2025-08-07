import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Truck, Shield, Users, FileCheck, TrendingUp } from "lucide-react";
import cashewProduct from "@/assets/cashew-product.jpg";
import shippingLogistics from "@/assets/shipping-logistics.jpg";

const ServicesSection = () => {
  const services = [
    {
      icon: Package,
      title: "Premium Cashew Sourcing",
      description: "Direct partnerships with top Vietnamese cashew farms ensure consistent quality and competitive pricing.",
      features: ["Grade A cashews", "Bulk quantities", "Custom processing", "Quality certificates"],
      cta: "View Products"
    },
    {
      icon: FileCheck,
      title: "Export Documentation",
      description: "Complete handling of all FDA, USDA, and customs paperwork for smooth import clearance.",
      features: ["FDA compliance", "Customs forms", "Health certificates", "Origin documents"],
      cta: "Learn More"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Rigorous testing and quality control processes to meet US food safety standards.",
      features: ["Lab testing", "HACCP certified", "Traceability", "Quality reports"],
      cta: "Quality Standards"
    },
    {
      icon: Truck,
      title: "Logistics & Shipping",
      description: "End-to-end logistics management from Vietnamese ports to your US warehouse.",
      features: ["Container shipping", "Customs clearance", "Delivery tracking", "Insurance coverage"],
      cta: "Shipping Info"
    },
    {
      icon: Users,
      title: "Market Consulting",
      description: "Expert guidance on US market trends, pricing strategies, and business development.",
      features: ["Market analysis", "Pricing insights", "Trend reports", "Business strategy"],
      cta: "Get Consultation"
    },
    {
      icon: TrendingUp,
      title: "Business Development",
      description: "Support for scaling your cashew import business with training and ongoing support.",
      features: ["Training programs", "Ongoing support", "Network access", "Growth strategies"],
      cta: "Start Growing"
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Comprehensive Import/Export Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From sourcing premium cashews in Vietnam to delivering them to your US warehouse, we handle every step of the import process.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300 border-border/50 hover:border-primary/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mr-4">
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  {service.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Services with Images */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Card className="overflow-hidden shadow-elegant border-0">
              <img
                src={cashewProduct}
                alt="Premium Vietnamese Cashews"
                className="w-full h-80 object-cover"
              />
            </Card>
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-foreground">
              Premium Vietnamese Cashews
            </h3>
            <p className="text-lg text-muted-foreground">
              We source directly from the best cashew farms in Binh Phuoc and Dong Nai provinces, known for producing the world's finest cashews. Our strict quality control ensures only Grade A cashews reach the US market.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">W240</div>
                <div className="text-sm text-muted-foreground">Premium Grade</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">W320</div>
                <div className="text-sm text-muted-foreground">Standard Grade</div>
              </div>
            </div>
            <Button size="lg" className="bg-gradient-primary shadow-elegant">
              View Product Catalog
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mt-20">
          <div className="order-2 lg:order-1 space-y-6">
            <h3 className="text-3xl font-bold text-foreground">
              Seamless Logistics & Delivery
            </h3>
            <p className="text-lg text-muted-foreground">
              Our logistics network ensures your cashews arrive on time and in perfect condition. We handle customs clearance, documentation, and delivery tracking so you can focus on your business.
            </p>
            <div className="space-y-4">
              {[
                "20ft & 40ft container options",
                "Temperature-controlled shipping",
                "Real-time tracking & updates",
                "Insurance coverage included"
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-success-green mr-3"></div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="bg-gradient-primary shadow-elegant">
              Learn About Shipping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="order-1 lg:order-2">
            <Card className="overflow-hidden shadow-elegant border-0">
              <img
                src={shippingLogistics}
                alt="International Shipping"
                className="w-full h-80 object-cover"
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;