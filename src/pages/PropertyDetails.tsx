import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Bath,
  Bed,
  Calendar,
  Car,
  MapPin,
  Square,
  Wifi,
} from "lucide-react";

const PropertyDetails = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const { data: property, isLoading, isError } = useQuery({
    queryKey: ["property", id],
    queryFn: () => api.getProperty(id),
    enabled: !!id,
  });

  const isUnavailable = property?.status !== "AVAILABLE";
  const isSale = property?.type === "SALE";

  const handlePurchase = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    navigate(`/checkout/${id}`);
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Invalid property link.</p>
          <Button className="mt-4" asChild>
            <Link to="/properties">Browse properties</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {isLoading && (
          <p className="text-muted-foreground text-center py-12">Loading property details...</p>
        )}

        {isError && (
          <div className="text-center py-12 space-y-4">
            <p className="text-destructive">Could not load this property.</p>
            <Button asChild>
              <Link to="/properties">Browse all properties</Link>
            </Button>
          </div>
        )}

        {!isLoading && !isError && !property && (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">Property not found.</p>
            <Button asChild>
              <Link to="/properties">Browse all properties</Link>
            </Button>
          </div>
        )}

        {property && (
          <>
            <div className="relative rounded-xl overflow-hidden border border-border">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-64 sm:h-96 object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <Badge className={isSale ? "bg-property-success" : "bg-primary"}>
                  For {isSale ? "Sale" : "Rent"}
                </Badge>
                {property.featured && (
                  <Badge className="bg-property-luxury text-property-luxury-foreground">Featured</Badge>
                )}
                {isUnavailable && <Badge variant="destructive">{property.status}</Badge>}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4 mr-1 shrink-0" />
                    <span>{property.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Bed className="h-5 w-5" />
                    <span>{property.beds} bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Bath className="h-5 w-5" />
                    <span>{property.baths} bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Square className="h-5 w-5" />
                    <span>{property.sqft}</span>
                  </div>
                </div>

                {property.type === "RENT" && property.availableFrom && (
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Available from {property.availableFrom}</span>
                  </div>
                )}

                {property.amenities.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline">
                          {amenity === "wifi" && <Wifi className="h-3 w-3 mr-1" />}
                          {amenity === "parking" && <Car className="h-3 w-3 mr-1" />}
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">About this property</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {isSale
                      ? `This ${property.beds}-bedroom home in ${property.location} is listed for sale. Contact us or proceed to checkout to complete your purchase.`
                      : `This ${property.beds}-bedroom rental in ${property.location} is available for monthly lease. Sign in to reserve and complete payment.`}
                  </p>
                </div>
              </div>

              <div className="border border-border rounded-xl p-6 h-fit space-y-4 bg-card shadow-card">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-3xl font-bold text-primary">
                    {property.price}
                    {property.type === "RENT" && (
                      <span className="text-base font-normal text-muted-foreground"> / month</span>
                    )}
                  </p>
                </div>

                <Button
                  className="w-full bg-gradient-hero hover:opacity-90"
                  onClick={handlePurchase}
                  disabled={isUnavailable}
                >
                  {isUnavailable ? "Unavailable" : isSale ? "Buy now" : "Rent now"}
                </Button>

                <Button className="w-full" variant="outline" asChild>
                  <Link to="/properties">Browse more properties</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
