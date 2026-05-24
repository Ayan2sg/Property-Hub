import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Search, 
  Calculator, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  Shield, 
  Users,
  DollarSign,
  Building
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const Buy = () => {
  const navigate = useNavigate();
  const { data: saleProperties = [], isLoading: loadingSale } = useQuery({
    queryKey: ["buy-page-properties"],
    queryFn: () => api.listProperties({ type: "SALE", limit: 6 }),
  });

  const buyingProcess = [
    {
      step: 1,
      title: "Get Pre-approved",
      description: "Secure financing to strengthen your offer",
      icon: Calculator,
      color: "text-primary"
    },
    {
      step: 2,
      title: "Search Properties",
      description: "Browse listings that match your criteria",
      icon: Search,
      color: "text-accent"
    },
    {
      step: 3,
      title: "View & Inspect",
      description: "Schedule viewings and professional inspections",
      icon: Home,
      color: "text-property-success"
    },
    {
      step: 4,
      title: "Make an Offer",
      description: "Submit competitive offers with our guidance",
      icon: FileText,
      color: "text-property-warning"
    },
    {
      step: 5,
      title: "Close the Deal",
      description: "Complete paperwork and get your keys",
      icon: CheckCircle,
      color: "text-property-luxury"
    }
  ];

  const services = [
    {
      title: "Buyer Representation",
      description: "Dedicated agents working exclusively for your interests",
      icon: Users,
      benefits: ["Expert negotiation", "Market analysis", "Exclusive access to listings"]
    },
    {
      title: "Mortgage Assistance",
      description: "Connect with trusted lenders for the best rates",
      icon: DollarSign,
      benefits: ["Pre-approval help", "Rate comparison", "Loan program guidance"]
    },
    {
      title: "Investment Consulting",
      description: "Strategic advice for property investment opportunities",
      icon: TrendingUp,
      benefits: ["ROI analysis", "Market trends", "Portfolio planning"]
    },
    {
      title: "Legal Protection",
      description: "Comprehensive legal support throughout the process",
      icon: Shield,
      benefits: ["Contract review", "Title insurance", "Risk assessment"]
    }
  ];

  const marketStats = [
    { label: "Average Home Price", value: "$485,000", trend: "+5.2%" },
    { label: "Days on Market", value: "28 days", trend: "-3 days" },
    { label: "Price per Sq Ft", value: "$275", trend: "+2.8%" },
    { label: "Inventory", value: "2,340 homes", trend: "+12%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-hero text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <Badge className="bg-background/20 text-primary-foreground border-primary-foreground/30">
              <Home className="mr-1 h-4 w-4" />
              Property Buying Services
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold">
              Find Your Perfect Home
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Discover exceptional properties for sale with expert guidance every step of the way. 
              From first-time buyers to seasoned investors, we make home buying simple and rewarding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-background text-primary hover:bg-background/90">
                <Search className="mr-2 h-5 w-5" />
                Browse Properties
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Mortgage
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Market Overview */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Current Market Overview</h2>
            <p className="text-muted-foreground text-lg">
              Stay informed with the latest market trends and statistics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketStats.map((stat, index) => (
              <Card key={index} className="text-center border border-border">
                <CardContent className="p-6">
                  <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <Badge variant={stat.trend.startsWith('+') ? "default" : "secondary"} className="text-xs">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {stat.trend}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Properties */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Properties for Sale</h2>
            <p className="text-muted-foreground text-lg">
              Handpicked exceptional homes available now
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingSale && (
              <div className="col-span-full text-center text-muted-foreground">Loading sale listings...</div>
            )}
            {!loadingSale && saleProperties.map((property) => (
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
                type="sale"
                featured={property.featured}
                amenities={property.amenities}
                availableFrom={property.availableFrom ?? undefined}
                status={property.status}
              />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" variant="outline" onClick={() => navigate("/properties?type=SALE")}>
              <Building className="mr-2 h-5 w-5" />
              View All Properties
            </Button>
          </div>
        </div>

        {/* Buying Process */}
        <div className="py-16 bg-muted/30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Your Home Buying Journey</h2>
              <p className="text-muted-foreground text-lg">
                We guide you through every step of the home buying process
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {buyingProcess.map((step, index) => (
                <div key={step.step} className="text-center">
                  <div className="relative mb-6">
                    <div className={`bg-background border-2 border-border rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                      <step.icon className={`h-8 w-8 ${step.color}`} />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    {index < buyingProcess.length - 1 && (
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

        {/* Services */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Comprehensive Buyer Services</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need for a successful home purchase
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
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
                Ready to Start Your Home Buying Journey?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Connect with our expert agents today and take the first step toward owning your dream home. 
                Get personalized guidance and access to exclusive listings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-hero hover:opacity-90">
                  <Users className="mr-2 h-5 w-5" />
                  Speak with an Agent
                </Button>
                <Button size="lg" variant="outline">
                  <Calculator className="mr-2 h-5 w-5" />
                  Get Pre-approved
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

export default Buy;