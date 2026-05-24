import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Award, 
  Target, 
  Heart, 
  TrendingUp, 
  Shield, 
  Globe,
  CheckCircle,
  Star,
  Calendar,
  Building,
  Home
} from "lucide-react";

const About = () => {
  const stats = [
    { label: "Properties Sold", value: "15,000+", icon: Home },
    { label: "Happy Clients", value: "8,500+", icon: Users },
    { label: "Years Experience", value: "12+", icon: Calendar },
    { label: "Market Coverage", value: "50+", icon: Globe }
  ];

  const values = [
    {
      title: "Integrity First",
      description: "We believe in transparent, honest dealings in every transaction",
      icon: Shield,
      color: "text-primary"
    },
    {
      title: "Client Success",
      description: "Your goals become our mission - we're committed to your success",
      icon: Target,
      color: "text-property-success"
    },
    {
      title: "Expert Knowledge",
      description: "Deep market insights and professional expertise you can trust",
      icon: Award,
      color: "text-property-warning"
    },
    {
      title: "Innovation",
      description: "Leveraging technology to enhance your property experience",
      icon: TrendingUp,
      color: "text-accent"
    }
  ];

  const team = [
    {
      name: "Sarah Mitchell",
      role: "Founder & CEO",
      experience: "15+ years",
      specialization: "Luxury Properties & Investment",
      achievements: ["Top 1% Agent Nationwide", "500+ Properties Sold", "MBA Real Estate"]
    },
    {
      name: "Michael Chen",
      role: "Head of Sales",
      experience: "12+ years",
      specialization: "Residential Sales & First-Time Buyers",
      achievements: ["Customer Service Excellence", "300+ Happy Families", "Certified Negotiator"]
    },
    {
      name: "Emily Rodriguez",
      role: "Rental Division Manager",
      experience: "10+ years",
      specialization: "Property Management & Rentals",
      achievements: ["Property Management Certified", "98% Tenant Satisfaction", "Portfolio of 1000+ Units"]
    },
    {
      name: "David Thompson",
      role: "Investment Advisor",
      experience: "14+ years",
      specialization: "Commercial & Investment Properties",
      achievements: ["Real Estate Investment Certified", "$50M+ Transactions", "Market Analysis Expert"]
    }
  ];

  const milestones = [
    { year: "2012", event: "PropertyHub Founded", description: "Started with a vision to revolutionize real estate" },
    { year: "2015", event: "1,000th Property Sold", description: "Reached our first major milestone in sales" },
    { year: "2018", event: "Digital Platform Launch", description: "Launched our comprehensive online property platform" },
    { year: "2020", event: "Rental Division Expansion", description: "Expanded services to include property management" },
    { year: "2022", event: "50 Cities Coverage", description: "Extended our reach to 50+ cities nationwide" },
    { year: "2024", event: "15,000+ Properties", description: "Achieved record-breaking sales and client satisfaction" }
  ];

  const certifications = [
    "National Association of Realtors (NAR)",
    "Real Estate License Authority",
    "Certified Property Manager (CPM)",
    "Investment Property Specialist",
    "Sustainable Real Estate Certified"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-hero text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <Badge className="bg-background/20 text-primary-foreground border-primary-foreground/30">
              <Heart className="mr-1 h-4 w-4" />
              Our Story
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold">
              About PropertyHub
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              For over a decade, we've been helping families, investors, and businesses 
              find their perfect properties. Our passion for real estate and commitment 
              to excellence drives everything we do.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border border-border hover:shadow-hover transition-all duration-300">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                To transform the real estate experience by providing exceptional service, expert guidance, 
                and innovative solutions that help our clients achieve their property goals with confidence.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that buying, selling, or renting property should be an exciting and rewarding 
                experience, not a stressful one. That's why we've built our business around trust, 
                transparency, and client success.
              </p>
            </div>
            
            <div className="space-y-6">
              <Card className="border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Our Vision</h3>
                  </div>
                  <p className="text-muted-foreground">
                    To be the most trusted and innovative real estate platform, 
                    connecting people with their perfect properties nationwide.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-property-success/10 p-2 rounded-full">
                      <Heart className="h-5 w-5 text-property-success" />
                    </div>
                    <h3 className="font-semibold text-foreground">Our Promise</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Dedicated support, expert knowledge, and innovative technology 
                    to make your real estate journey seamless and successful.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="py-16 bg-muted/30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
              <p className="text-muted-foreground text-lg">
                The principles that guide every decision and interaction
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center border border-border hover:shadow-hover transition-all duration-300">
                  <CardHeader>
                    <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className={`h-8 w-8 ${value.color}`} />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Expert Team</h2>
            <p className="text-muted-foreground text-lg">
              Experienced professionals dedicated to your success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border border-border hover:shadow-hover transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="bg-gradient-hero w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="font-medium">{member.role}</CardDescription>
                  <Badge variant="secondary">{member.experience}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">Specialization:</p>
                    <p className="text-sm text-muted-foreground">{member.specialization}</p>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Key Achievements:</p>
                      <ul className="space-y-1">
                        {member.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="flex items-center text-xs text-muted-foreground">
                            <Star className="h-3 w-3 text-property-warning mr-1" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Journey</h2>
            <p className="text-muted-foreground text-lg">
              Key milestones in our company's growth and success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((milestone, index) => (
              <Card key={index} className="border border-border hover:shadow-hover transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-primary text-primary-foreground">{milestone.year}</Badge>
                    <CardTitle className="text-lg">{milestone.event}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="py-16 bg-muted/30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Professional Certifications</h2>
              <p className="text-muted-foreground text-lg">
                Our commitment to professional excellence and industry standards
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert, index) => (
                <Card key={index} className="border border-border">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-property-success" />
                    <span className="text-sm font-medium">{cert}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16">
          <Card className="bg-gradient-card border border-border">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Work with Us?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Experience the difference that expertise, integrity, and innovation can make in your 
                real estate journey. Let's achieve your property goals together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-hero hover:opacity-90">
                  <Users className="mr-2 h-5 w-5" />
                  Meet Our Team
                </Button>
                <Button size="lg" variant="outline">
                  <Building className="mr-2 h-5 w-5" />
                  Start Your Journey
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

export default About;