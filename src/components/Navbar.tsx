import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Menu, X, Phone, Info, Building, Search } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Properties", href: "/properties", icon: Building },
    { name: "Buy", href: "/buy", icon: Search },
    { name: "Rent", href: "/rent", icon: Building },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
  ];
  const isAuthed = typeof window !== 'undefined' && !!localStorage.getItem('token');
  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-hero text-primary-foreground p-2 rounded-lg">
              <Home className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-foreground">PropertyHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/list">
              <Button variant="outline" size="sm">
                List Property
              </Button>
            </Link>
            <Link to={isAuthed ? "/properties" : "/login"}>
              <Button size="sm" className="bg-gradient-hero hover:opacity-90">
                Get Started
              </Button>
            </Link>
            {!isAuthed ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" size="sm">Sign Up</Button>
                </Link>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={onLogout}>Logout</Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card rounded-lg mt-2 border border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 text-base font-medium rounded-md transition-all duration-300 ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Link to="/list" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm">
                    List Property
                  </Button>
                </Link>
                <Link to={isAuthed ? "/properties" : "/login"} onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="bg-gradient-hero hover:opacity-90">
                    Get Started
                  </Button>
                </Link>
                {!isAuthed ? (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm">Sign Up</Button>
                    </Link>
                  </>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => { onLogout(); setIsOpen(false); }}>Logout</Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;