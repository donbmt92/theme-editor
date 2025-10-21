import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User, TrendingUp } from "lucide-react";

const BlogSection = () => {
  const blogPosts = [
    {
      title: "2025 Cashew Market Outlook: US Import Trends & Pricing Forecast",
      excerpt: "Comprehensive analysis of the US cashew market including demand projections, pricing trends, and key factors affecting imports from Vietnam.",
      category: "Market Analysis",
      author: "Sarah Johnson",
      date: "January 15, 2025",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&h=400&fit=crop",
      featured: true
    },
    {
      title: "New FDA Regulations for Cashew Imports: What You Need to Know",
      excerpt: "Updated FDA requirements for cashew imports effective 2025, including documentation changes and compliance guidelines for US importers.",
      category: "Regulations",
      author: "Michael Chen",
      date: "January 10, 2025",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
    },
    {
      title: "Vietnamese Cashew Harvest Update: Quality & Volume Projections",
      excerpt: "Latest updates from Vietnamese cashew growing regions including harvest quality assessments and volume projections for 2025.",
      category: "Supply Chain",
      author: "Nguyen Tran",
      date: "January 8, 2025",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1588155487507-a5e9ce8b1987?w=600&h=400&fit=crop"
    },
    {
      title: "Sustainable Cashew Farming: Supporting Vietnamese Communities",
      excerpt: "How our partnerships with Vietnamese farmers promote sustainable practices while ensuring premium quality cashews for US markets.",
      category: "Sustainability",
      author: "David Park",
      date: "January 5, 2025",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1594736797933-d0c3659ad253?w=600&h=400&fit=crop"
    }
  ];

  const categories = [
    { name: "Market Analysis", count: 12, color: "bg-primary" },
    { name: "Regulations", count: 8, color: "bg-trust-blue" },
    { name: "Supply Chain", count: 15, color: "bg-success-green" },
    { name: "Sustainability", count: 6, color: "bg-cashew-gold" }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Latest Industry Insights
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest news, market trends, and expert insights about Vietnamese cashew exports and US import markets.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${category.color} mr-2`}></div>
              {category.name} ({category.count})
            </Badge>
          ))}
        </div>

        {/* Featured Post */}
        <Card className="mb-12 shadow-elegant border-primary/20 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="relative">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-80 lg:h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-primary text-white">
                <TrendingUp className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <Badge variant="secondary" className="w-fit mb-4">
                {blogPosts[0].category}
              </Badge>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {blogPosts[0].title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex items-center text-sm text-muted-foreground mb-6">
                <User className="h-4 w-4 mr-1" />
                <span className="mr-4">{blogPosts[0].author}</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">{blogPosts[0].date}</span>
                <span>{blogPosts[0].readTime}</span>
              </div>
              <Button className="w-fit bg-gradient-primary shadow-elegant">
                Read Full Article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </div>
        </Card>

        {/* Other Posts */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {blogPosts.slice(1).map((post, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <Badge variant="secondary" className="absolute top-3 left-3">
                  {post.category}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h4 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-xs text-muted-foreground mb-4">
                  <User className="h-3 w-3 mr-1" />
                  <span className="mr-3">{post.author}</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span className="mr-3">{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Read More
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-hero text-white border-0 shadow-elegant">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Stay Updated with Market Insights
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Subscribe to our weekly newsletter for the latest cashew market trends, import tips, and industry updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-foreground border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-4">
              Join 2,000+ importers receiving weekly market insights. Unsubscribe anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BlogSection;
