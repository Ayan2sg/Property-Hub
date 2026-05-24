import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Users, 
  Calendar,
  Send,
  CheckCircle
} from "lucide-react";

const Contact = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our property experts",
      info: "+1 (555) 123-4567",
      available: "Mon-Fri 9AM-7PM"
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us your inquiries",
      info: "hello@propertyhub.com",
      available: "We reply within 24 hours"
    },
    {
      icon: MapPin,
      title: "Visit Office",
      description: "Meet us in person",
      info: "123 Real Estate Ave, Property City",
      available: "Mon-Sat 9AM-6PM"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Instant assistance online",
      info: "Chat with our agents",
      available: "Available 24/7"
    }
  ];

  const departments = [
    "General Inquiry",
    "Property Sales",
    "Property Rentals",
    "Property Management",
    "Investment Consultation",
    "Customer Support"
  ];

  const offices = [
    {
      city: "New York",
      address: "123 Manhattan Ave, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "ny@propertyhub.com"
    },
    {
      city: "Los Angeles",
      address: "456 Sunset Blvd, CA 90028",
      phone: "+1 (555) 234-5678",
      email: "la@propertyhub.com"
    },
    {
      city: "Chicago",
      address: "789 Michigan Ave, IL 60611",
      phone: "+1 (555) 345-6789",
      email: "chicago@propertyhub.com"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-gradient-hero text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Ready to find your dream property? Get in touch with our expert team for personalized assistance
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <Card key={index} className="text-center hover:shadow-hover transition-all duration-300 border border-border">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{method.title}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-foreground mb-1">{method.info}</p>
                <p className="text-sm text-muted-foreground">{method.available}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-card border border-border">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        First Name *
                      </label>
                      <Input placeholder="John" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Last Name *
                      </label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Email *
                      </label>
                      <Input type="email" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Phone Number
                      </label>
                      <Input placeholder="+1 (555) 123-4567" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Department
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept.toLowerCase().replace(/\s+/g, '-')}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Subject *
                    </label>
                    <Input placeholder="How can we help you?" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Message *
                    </label>
                    <Textarea 
                      placeholder="Tell us more about your requirements, preferred location, budget, etc."
                      rows={5}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="newsletter" className="rounded" />
                    <label htmlFor="newsletter" className="text-sm text-muted-foreground">
                      Subscribe to our newsletter for market updates and new listings
                    </label>
                  </div>

                  <Button className="w-full bg-gradient-hero hover:opacity-90" size="lg">
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Schedule a Property Viewing
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Request Property Valuation
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Book Consultation Call
                </Button>
              </CardContent>
            </Card>

            {/* Office Locations */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  Our Offices
                </CardTitle>
                <CardDescription>
                  Visit us at any of our convenient locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offices.map((office, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold text-foreground">{office.city}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{office.address}</p>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-2 text-primary" />
                          <span>{office.phone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-2 text-primary" />
                          <span>{office.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Emergency Contact</span>
                    <span className="font-medium text-primary">24/7 Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg">How quickly do you respond to inquiries?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We typically respond to all inquiries within 2 hours during business hours and within 24 hours on weekends.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg">Do you charge for consultations?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Initial consultations are completely free. We believe in providing value before asking for your business.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg">Can you help with property financing?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we work with trusted mortgage brokers and can connect you with competitive financing options.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg">Do you handle property management?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer comprehensive property management services for investors and landlords, including tenant screening and maintenance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;