import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Shield, 
  Award, 
  Search, 
  Building, 
  MapPin,
  Star,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import apartmentBuilding from "@/assets/apartment-building.jpg";
import luxuryVilla from "@/assets/luxury-villa.jpg";
import familyHome from "@/assets/family-home.jpg";

const Index = () => {
  const { data: featuredData, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: () => api.listProperties({ limit: 6 }),
  });

  const services = [
    {
      icon: Search,
      title: "Property Search",
      description: "Advanced search filters to find your perfect property",
      color: "text-primary"
    },
    {
      icon: Building,
      title: "Property Management",
      description: "Full-service management for landlords and investors",
      color: "text-accent"
    },
    {
      icon: TrendingUp,
      title: "Market Analysis",
      description: "Expert insights and market trends to guide your decisions",
      color: "text-property-success"
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Protected and verified transactions for peace of mind",
      color: "text-property-warning"
    }
  ];

  const features = [
    {
      title: "Expert Agents",
      description: "Work with certified real estate professionals",
      icon: Users,
      stats: "100+ Agents"
    },
    {
      title: "Verified Listings",
      description: "All properties are verified and up-to-date",
      icon: CheckCircle,
      stats: "10K+ Properties"
    },
    {
      title: "Award Winning",
      description: "Recognized for excellence in real estate services",
      icon: Award,
      stats: "50+ Awards"
    },
    {
      title: "Customer Satisfaction",
      description: "98% customer satisfaction rate",
      icon: Star,
      stats: "5K+ Reviews"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "First-time Buyer",
      content: "PropertyHub made buying my first home incredibly easy. The agents were knowledgeable and patient throughout the entire process.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Property Investor",
      content: "Excellent platform for finding investment properties. The market analysis tools are top-notch and have helped me make informed decisions.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Rental Client",
      content: "Found the perfect apartment through PropertyHub. The rental process was smooth and the support team was fantastic.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* Featured Properties */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Featured Properties</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Discover Premium Properties
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked exceptional properties for sale and rent, carefully selected by our expert team
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoadingFeatured && (
              <div className="col-span-full text-center text-muted-foreground">Loading properties...</div>
            )}
            {!isLoadingFeatured && featuredData?.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                price={property.price}
                location={property.location}
                beds={property.beds}
                baths={property.baths}
                sqft={property.sqft}
                image={property.image}
                type={property.type === "SALE" ? "sale" : "rent"}
                featured={property.featured}
                amenities={property.amenities}
                availableFrom={property.availableFrom ?? undefined}
                status={property.status}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" className="group">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Real Estate Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From buying and selling to property management, we provide complete real estate services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center border border-border hover:shadow-hover transition-all duration-300 group">
                <CardHeader>
                  <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Why Choose Us</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied clients who have found their perfect properties with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-card p-8 rounded-xl border border-border hover:shadow-hover transition-all duration-300">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                  <Badge variant="secondary">{feature.stats}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from real clients who found their perfect properties
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border border-border hover:shadow-hover transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-property-warning text-property-warning" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-hero text-primary-foreground border-none shadow-luxury">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your Dream Property?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied clients and discover exceptional properties with expert guidance. 
                Your perfect home is just a click away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-background text-primary hover:bg-background/90">
                  <Search className="mr-2 h-5 w-5" />
                  Start Your Search
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Locations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
