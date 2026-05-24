import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Heart, 
  Eye,
  Calendar,
  Wifi,
  Car
} from "lucide-react";

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  type: "sale" | "rent";
  featured?: boolean;
  amenities?: string[];
  availableFrom?: string;
  status?: "AVAILABLE" | "SOLD" | "RENTED";
}

const PropertyCard = ({ 
  id,
  title, 
  price, 
  location, 
  beds, 
  baths, 
  sqft, 
  image, 
  type, 
  featured = false,
  amenities = [],
  availableFrom,
  status = "AVAILABLE"
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const isUnavailable = status !== "AVAILABLE";
  return (
    <div className="group bg-card rounded-xl shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden border border-border">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {featured && (
            <Badge className="bg-property-luxury text-property-luxury-foreground">
              Featured
            </Badge>
          )}
          <Badge 
            variant={type === "sale" ? "default" : "secondary"}
            className={type === "sale" ? "bg-property-success" : "bg-primary"}
          >
            For {type === "sale" ? "Sale" : "Rent"}
          </Badge>
          {isUnavailable && (
            <Badge variant="destructive">
              {status}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="sm" variant="secondary" className="p-2">
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="p-2"
            onClick={() => navigate(`/properties/${id}`)}
            aria-label="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-lg">
            <span className="text-lg font-bold text-primary">{price}</span>
            {type === "rent" && (
              <span className="text-sm text-muted-foreground">/month</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3
            className="font-semibold text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
            onClick={() => navigate(`/properties/${id}`)}
          >
            {title}
          </h3>
          <div className="flex items-center text-muted-foreground text-sm mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-muted-foreground">
              <Bed className="h-4 w-4 mr-1" />
              <span>{beds}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Bath className="h-4 w-4 mr-1" />
              <span>{baths}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Square className="h-4 w-4 mr-1" />
              <span>{sqft}</span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs">
                {amenity === "wifi" && <Wifi className="h-3 w-3 mr-1" />}
                {amenity === "parking" && <Car className="h-3 w-3 mr-1" />}
                {amenity}
              </Badge>
            ))}
            {amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Available From (for rentals) */}
        {type === "rent" && availableFrom && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Available from {availableFrom}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => navigate(`/properties/${id}`)}
          >
            View Details
          </Button>
          {type === "sale" ? (
            <Button 
              className="flex-1 bg-gradient-hero hover:opacity-90"
              onClick={() => {
                if (!localStorage.getItem("token")) {
                  navigate("/login");
                  return;
                }
                navigate(`/checkout/${id}`);
              }}
              disabled={isUnavailable}
            >
              {isUnavailable ? "Unavailable" : "Buy"}
            </Button>
          ) : (
            <Button 
              className="flex-1 bg-gradient-hero hover:opacity-90"
              onClick={() => {
                if (!localStorage.getItem("token")) {
                  navigate("/login");
                  return;
                }
                navigate(`/checkout/${id}`);
              }}
              disabled={isUnavailable}
            >
              {isUnavailable ? "Unavailable" : "Rent"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;