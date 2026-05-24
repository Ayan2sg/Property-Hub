import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Search, 
  Calendar, 
  FileText, 
  Key, 
  Shield, 
  Users,
  DollarSign,
  CheckCircle,
  Clock
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const Rent = () => {
  const navigate = useNavigate();
  const { data: rentalProperties = [], isLoading: loadingRent } = useQuery({
    queryKey: ["rent-page-properties"],
    queryFn: () => api.listProperties({ type: "RENT", limit: 6 }),
  });

  const rentalProcess = [
    {
      step: 1,
      title: "Search & Browse",
      description: "Find properties that match your needs and budget",
      icon: Search,
      color: "text-primary"
    },
    {
      step: 2,
      title: "Schedule Viewing",
      description: "Book convenient viewing times with our agents",
      icon: Calendar,
      color: "text-accent"
    },
    {
      step: 3,
      title: "Submit Application",
      description: "Complete your rental application with required documents",
      icon: FileText,
      color: "text-property-success"
    },
    {
      step: 4,
      title: "Background Check",
      description: "Quick verification process for approval",
      icon: Shield,
      color: "text-property-warning"
    },
    {
      step: 5,
      title: "Move In",
      description: "Sign lease, pay deposits, and get your keys",
      icon: Key,
      color: "text-property-luxury"
    }
  ];

  const rentalServices = [
    {
      title: "Tenant Screening",
      description: "Thorough background and credit checks for landlords",
      icon: Users,
      benefits: ["Credit verification", "Employment check", "Reference validation"]
    },
    {
      title: "Rent Management",
      description: "Streamlined rent collection and payment processing",
      icon: DollarSign,
      benefits: ["Online payments", "Automatic reminders", "Financial reporting"]
    },
    {
      title: "Maintenance Support",
      description: "24/7 maintenance request handling and coordination",
      icon: Shield,
      benefits: ["Emergency repairs", "Vendor network", "Quality assurance"]
    },
    {
      title: "Lease Administration",
      description: "Complete lease management from start to finish",
      icon: FileText,
      benefits: ["Legal compliance", "Renewal management", "Documentation"]
    }
  ];

  const rentalTips = [
    {
      title: "Know Your Budget",
      description: "Factor in utilities, parking, and other monthly costs beyond rent",
      icon: DollarSign
    },
    {
      title: "Required Documents",
      description: "Prepare recent pay stubs, bank statements, and references in advance",
      icon: FileText
    },
    {
      title: "Tour Thoroughly",
      description: "Check all appliances, water pressure, and test internet connectivity",
      icon: CheckCircle
    },
    {
      title: "Read the Lease",
      description: "Understand pet policies, renewal terms, and maintenance responsibilities",
      icon: Shield
    }
  ];

  const popularAreas = [
    { name: "Downtown Districts", avgRent: "$2,200", properties: "450+" },
    { name: "Suburban Communities", avgRent: "$1,800", properties: "320+" },
    { name: "Waterfront Areas", avgRent: "$2,800", properties: "180+" },
    { name: "University Neighborhoods", avgRent: "$1,400", properties: "260+" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-hero text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <Badge className="bg-background/20 text-primary-foreground border-primary-foreground/30">
              <Building className="mr-1 h-4 w-4" />
              Property Rental Services
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold">
              Discover Perfect Rentals
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              From luxury apartments to family homes, find your ideal rental property with flexible terms 
              and professional management. Quality living spaces available immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-background text-primary hover:bg-background/90">
                <Search className="mr-2 h-5 w-5" />
                Browse Rentals
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Viewing
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Popular Areas */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Popular Rental Areas</h2>
            <p className="text-muted-foreground text-lg">
              Explore rental opportunities in prime locations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularAreas.map((area, index) => (
              <Card key={index} className="text-center border border-border hover:shadow-hover transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">{area.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-1">{area.avgRent}</p>
                  <p className="text-sm text-muted-foreground mb-3">Average monthly rent</p>
                  <Badge variant="secondary">{area.properties} properties</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Rentals */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Rental Properties</h2>
            <p className="text-muted-foreground text-lg">
              Premium rental properties available for immediate move-in
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingRent && (
              <div className="col-span-full text-center text-muted-foreground">Loading rent listings...</div>
            )}
            {!loadingRent && rentalProperties.map((property) => (
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
                type="rent"
                featured={property.featured}
                amenities={property.amenities}
                availableFrom={property.availableFrom ?? undefined}
                status={property.status}
              />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" variant="outline" onClick={() => navigate("/properties?type=RENT")}>
              <Building className="mr-2 h-5 w-5" />
              View All Rentals
            </Button>
          </div>
        </div>

        {/* Rental Process */}
        <div className="py-16 bg-muted/30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Simple Rental Process</h2>
              <p className="text-muted-foreground text-lg">
                From search to move-in, we make renting straightforward
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {rentalProcess.map((step, index) => (
                <div key={step.step} className="text-center">
                  <div className="relative mb-6">
                    <div className={`bg-background border-2 border-border rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                      <step.icon className={`h-8 w-8 ${step.color}`} />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    {index < rentalProcess.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border"></div>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rental Tips */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Rental Tips for Success</h2>
            <p className="text-muted-foreground text-lg">
              Expert advice to help you secure your ideal rental
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rentalTips.map((tip, index) => (
              <Card key={index} className="border border-border hover:shadow-hover transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <tip.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Rental Services */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Professional Rental Services</h2>
            <p className="text-muted-foreground text-lg">
              Comprehensive support for both tenants and landlords
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rentalServices.map((service, index) => (
              <Card key={index} className="border border-border hover:shadow-hover transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-property-success mr-2" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16">
          <Card className="bg-gradient-card border border-border">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Find Your Next Home?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Browse our extensive collection of rental properties or list your property for rent. 
                Our team is here to make your rental experience seamless and successful.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-hero hover:opacity-90">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Rentals
                </Button>
                <Button size="lg" variant="outline">
                  <Building className="mr-2 h-5 w-5" />
                  List Your Property
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Rent;