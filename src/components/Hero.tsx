import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home, Building, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-property.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [searchType, setSearchType] = useState("buy");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const propertyTypes = ["House", "Apartment", "Villa", "Condo", "Townhouse"];
  const locations = ["New York", "Los Angeles", "Chicago", "Miami", "Seattle"];
  const priceRanges = [
    "Under $100K",
    "$100K - $300K", 
    "$300K - $500K", 
    "$500K - $1M", 
    "Above $1M"
  ];

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Luxury Property" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Find Your
                <span className="block text-transparent bg-gradient-hero bg-clip-text">
                  Dream Property
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Discover the perfect home, investment property, or rental with our comprehensive real estate platform. Your journey to property ownership starts here.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Properties Listed</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-property-success">5K+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-accent">100+</div>
                <div className="text-sm text-muted-foreground">Expert Agents</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-hero hover:opacity-90 text-lg px-8" onClick={() => navigate('/properties')}>
                <Search className="mr-2 h-5 w-5" />
                Browse Properties
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate('/list')}>
                <Home className="mr-2 h-5 w-5" />
                List Your Property
              </Button>
            </div>
          </div>

          {/* Right Content - Search Form */}
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-luxury p-6 border border-border animate-fade-in">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Find Properties</h2>
              
              {/* Search Type Tabs */}
              <div className="flex bg-muted rounded-lg p-1">
                {["buy", "rent", "sell"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSearchType(type)}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                      searchType === type
                        ? "bg-background text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {type === "buy" && <Home className="inline h-4 w-4 mr-1" />}
                    {type === "rent" && <Building className="inline h-4 w-4 mr-1" />}
                    {type === "sell" && <TrendingUp className="inline h-4 w-4 mr-1" />}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search Form */}
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by location, title, or keywords"
                    className="pl-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range} value={range.toLowerCase()}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+ Bedrooms</SelectItem>
                      <SelectItem value="2">2+ Bedrooms</SelectItem>
                      <SelectItem value="3">3+ Bedrooms</SelectItem>
                      <SelectItem value="4">4+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+ Bathrooms</SelectItem>
                      <SelectItem value="2">2+ Bathrooms</SelectItem>
                      <SelectItem value="3">3+ Bathrooms</SelectItem>
                      <SelectItem value="4">4+ Bathrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-gradient-hero hover:opacity-90" size="lg" onClick={() => {
                  const typeParam = searchType === 'buy' ? 'SALE' : (searchType === 'rent' ? 'RENT' : 'all');
                  const params = new URLSearchParams();
                  if (query) params.set('search', query);
                  if (typeParam !== 'all') params.set('type', typeParam);
                  navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
                }}>
                  <Search className="mr-2 h-5 w-5" />
                  Search Properties
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 animate-float hidden lg:block">
        <div className="bg-card/80 backdrop-blur-sm rounded-full p-4 shadow-lg">
          <Home className="h-8 w-8 text-primary" />
        </div>
      </div>
      
      <div className="absolute bottom-20 left-10 animate-float hidden lg:block" style={{ animationDelay: "1s" }}>
        <div className="bg-card/80 backdrop-blur-sm rounded-full p-4 shadow-lg">
          <Building className="h-8 w-8 text-accent" />
        </div>
      </div>
    </div>
  );
};

export default Hero;