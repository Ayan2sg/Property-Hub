import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List, MapPin, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, type PropertyDto } from "@/lib/api";
import { useLocation, useNavigate } from "react-router-dom";

const Properties = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<"all" | "sale" | "rent">("all");
  const [searchText, setSearchText] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    const searchParam = params.get('search');
    if (typeParam === 'SALE') setFilterType('sale');
    if (typeParam === 'RENT') setFilterType('rent');
    if (searchParam) setSearchText(searchParam);
  }, [location.search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["properties", { filterType, searchText }],
    queryFn: () =>
      api.listProperties({
        type: filterType === "all" ? "all" : (filterType === "sale" ? "SALE" : "RENT"),
        search: searchText || undefined,
        limit: 12,
      }),
  });

  const properties: PropertyDto[] = data || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-gradient-hero text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Browse Properties</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Discover your perfect home from our extensive collection of premium properties
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-card rounded-lg shadow-card p-6 mb-8 border border-border">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by location, property type, or keywords..."
                className="pl-10"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const params = new URLSearchParams();
                    if (filterType !== 'all') params.set('type', filterType === 'sale' ? 'SALE' : 'RENT');
                    if (searchText) params.set('search', searchText);
                    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
                  }
                }}
              />
            </div>
            
            <Select value={filterType} onValueChange={(v) => {
              setFilterType(v as any);
              const params = new URLSearchParams();
              if (v !== 'all') params.set('type', v === 'sale' ? 'SALE' : 'RENT');
              if (searchText) params.set('search', searchText);
              navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-100k">Under $100K</SelectItem>
                <SelectItem value="100k-300k">$100K - $300K</SelectItem>
                <SelectItem value="300k-500k">$300K - $500K</SelectItem>
                <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                <SelectItem value="above-1m">Above $1M</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                New York
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                2+ Bedrooms
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Under $500K
              </Badge>
              <Button variant="ghost" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-1" />
                More Filters
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {isLoading ? "Loading..." : isError ? "Error loading" : `${properties.length} Properties Found`}
            </h2>
            <p className="text-muted-foreground">
              Showing results for {filterType === "all" ? "all properties" : `properties for ${filterType}`}
            </p>
          </div>
          
          <Select defaultValue="newest">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Properties Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        }`}>
          {isLoading && <div className="col-span-full text-center text-muted-foreground">Loading properties...</div>}
          {isError && <div className="col-span-full text-center text-destructive">Failed to load properties</div>}
          {!isLoading && !isError && properties.map((property) => (
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

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8" disabled>
            Load More Properties
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Properties;