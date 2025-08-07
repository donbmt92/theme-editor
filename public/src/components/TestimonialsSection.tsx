import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      title: "Import Manager",
      company: "Premium Nuts Co.",
      content: "VietCashew Export has been our trusted partner for 3 years. Their quality is consistently excellent, and their team handles all the complex documentation seamlessly. Our customers love the Vietnamese cashews!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Michael Rodriguez",
      title: "CEO",
      company: "Healthy Snacks USA",
      content: "Before working with VietCashew, we struggled with unreliable suppliers and quality issues. Now we have peace of mind knowing every shipment will arrive on time with premium quality cashews.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Jennifer Park",
      title: "Procurement Director",
      company: "Organic Foods Inc.",
      content: "The level of service and transparency is outstanding. They provide detailed market insights and help us make informed purchasing decisions. Highly recommend for any serious cashew importer.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    }
  ];

  const clientLogos = [
    { name: "Premium Nuts Co.", logo: "PN" },
    { name: "Healthy Snacks USA", logo: "HS" },
    { name: "Organic Foods Inc.", logo: "OF" },
    { name: "Nature's Best", logo: "NB" },
    { name: "Gourmet Imports", logo: "GI" },
    { name: "Fresh Market Co.", logo: "FM" }
  ];

  const stats = [
    { number: "50+", label: "Happy Clients", sublabel: "Across 25 US States" },
    { number: "2,500", label: "Tons Exported", sublabel: "Premium Cashews Annually" },
    { number: "99.8%", label: "On-Time Delivery", sublabel: "Consistent Performance" },
    { number: "4.9/5", label: "Client Rating", sublabel: "Customer Satisfaction" }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Trusted by Leading US Importers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what our clients say about their experience importing premium Vietnamese cashews through our services.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300 border-border/50">
              <CardContent className="p-8">
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-cashew-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                    <div className="text-sm text-primary font-medium">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Client Logos */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            Trusted by Industry Leaders
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {clientLogos.map((client, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-20 h-20 rounded-lg bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-lg font-bold text-primary">{client.logo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <Card className="bg-gradient-primary text-white border-0 shadow-elegant">
          <CardContent className="p-12">
            <h3 className="text-3xl font-bold text-center mb-12">
              Numbers That Speak for Themselves
            </h3>
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-xl font-semibold mb-1 opacity-90">{stat.label}</div>
                  <div className="text-sm opacity-75">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TestimonialsSection;