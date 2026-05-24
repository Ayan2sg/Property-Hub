import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Home, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Building,
  Search,
  Users,
  Shield,
  Award,
  Heart
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Buy Properties", href: "/buy", icon: Search },
    { name: "Rent Properties", href: "/rent", icon: Building },
    { name: "Sell Property", href: "/sell", icon: Home },
    { name: "Property Management", href: "/management", icon: Users },
  ];

  const company = [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/team" },
    { name: "Careers", href: "/careers" },
    { name: "News & Blog", href: "/blog" },
    { name: "Testimonials", href: "/testimonials" },
  ];

  const support = [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-hero text-primary-foreground p-2 rounded-lg">
                <Home className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-foreground">PropertyHub</span>
            </Link>
            
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted partner in finding the perfect property. We connect buyers, sellers, and renters with premium real estate opportunities.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">123 Real Estate Ave, Property City, PC 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">hello@propertyhub.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Support */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get the latest property listings and market insights.
            </p>
            
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button size="sm" className="bg-gradient-hero hover:opacity-90">
                  Subscribe
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-foreground font-medium mb-3">Support</h4>
              <ul className="space-y-2">
                {support.slice(0, 3).map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Features Banner */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-property-success/10 p-2 rounded-full">
                <Shield className="h-5 w-5 text-property-success" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Secure Transactions</h4>
                <p className="text-sm text-muted-foreground">Protected and verified</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-property-warning/10 p-2 rounded-full">
                <Award className="h-5 w-5 text-property-warning" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Trusted Platform</h4>
                <p className="text-sm text-muted-foreground">10+ years experience</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Customer First</h4>
                <p className="text-sm text-muted-foreground">Dedicated support 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-muted-foreground">
                © {currentYear} PropertyHub. All rights reserved.
              </p>
              <div className="flex space-x-4">
                {support.slice(2).map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Follow us:</span>
              <div className="flex space-x-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-200"
                    aria-label={social.name}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;