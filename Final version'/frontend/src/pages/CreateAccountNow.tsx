import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Zap,
  Users,
  Trophy,
  Calendar,
  Bookmark,
  ArrowRight,
  Star,
  Lock,
  Smartphone,
  Cog,
} from "lucide-react";

const CreateAccountNow = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: "Discover Events",
      description: "Find and register for exciting campus events, hackathons, and competitions",
      color: "text-blue-500",
    },
    {
      icon: Trophy,
      title: "Win Rewards",
      description: "Compete, earn badges, and climb the leaderboards with other students",
      color: "text-amber-500",
    },
    {
      icon: Users,
      title: "Join Community",
      description: "Connect with peers, share ideas, and build lasting network",
      color: "text-green-500",
    },
    {
      icon: Zap,
      title: "Career Growth",
      description: "Access placement opportunities and career development resources",
      color: "text-purple-500",
    },
    {
      icon: Bookmark,
      title: "Save Events",
      description: "Bookmark your favorite events and never miss an opportunity",
      color: "text-red-500",
    },
    {
      icon: Lock,
      title: "Secure Account",
      description: "Your data is encrypted and protected with industry-standard security",
      color: "text-indigo-500",
    },
  ];

  const benefits = [
    { text: "Free to join", icon: "✓" },
    { text: "No hidden fees", icon: "✓" },
    { text: "Instant verification", icon: "✓" },
    { text: "Mobile friendly", icon: "✓" },
    { text: "24/7 Support", icon: "✓" },
    { text: "Advanced analytics", icon: "✓" },
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Computer Science Student",
      text: "CampusConnect helped me discover amazing opportunities. I've attended 15+ events and won 3 hackathons!",
      avatar: "RS",
    },
    {
      name: "Priya Patel",
      role: "Final Year Student",
      text: "The placement resources here are incredible. Got offers from 2 amazing companies!",
      avatar: "PP",
    },
    {
      name: "Aditya Singh",
      role: "Event Coordinator",
      text: "Managing events has never been easier. The admin dashboard is intuitive and powerful.",
      avatar: "AS",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 px-4 py-1">
            <Zap className="w-4 h-4 mr-1 inline" />
            Join 10,000+ Students & Admins
          </Badge>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Create Your Account
              <span className="block bg-gradient-hero bg-clip-text text-transparent">
                and Get Started Today
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join CampusConnect to unlock exclusive events, networking opportunities, and career growth on your campus.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              onClick={() => navigate("/signup")}
              className="bg-gradient-accent hover:opacity-90 text-white font-semibold h-12 px-8 flex items-center justify-center gap-2 text-lg"
            >
              Create Account Now
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 font-semibold h-12 px-8 text-lg"
            >
              Already have an account? Sign In
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Email verified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Secure login</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Privacy protected</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">Why Join CampusConnect?</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to succeed in your college journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="bg-white dark:bg-slate-900 border-border hover:shadow-lg transition-shadow group"
                >
                  <CardHeader className="space-y-4">
                    <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">What Users Say</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of satisfied students and admins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-slate-900 border-border hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-foreground font-semibold text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Quick answers to help you get started
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is it really free to join?",
                a: "Yes! Creating an account is completely free. You get instant access to all features without any hidden charges.",
              },
              {
                q: "How quickly can I start?",
                a: "You can create your account and start exploring events in less than 2 minutes. No complex setup required!",
              },
              {
                q: "Can I change my account type later?",
                a: "Yes, you can contact support to upgrade from student to admin account if needed.",
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. We use industry-standard encryption and security protocols to protect your personal information.",
              },
              {
                q: "What if I need help?",
                a: "Our support team is available 24/7 to help you with any questions or issues.",
              },
              {
                q: "Can I delete my account?",
                a: "Yes, you can delete your account anytime from your account settings. All your data will be securely removed.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-slate-900 border-border hover:border-primary/30 transition-colors"
              >
                <CardHeader>
                  <CardTitle className="text-foreground">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              Don't Miss Out!
            </h2>
            <p className="text-xl text-muted-foreground">
              Thousands of students are already discovering amazing opportunities. Join them today.
            </p>
          </div>

          <Button
            onClick={() => navigate("/signup")}
            className="bg-gradient-accent hover:opacity-90 text-white font-semibold h-14 px-10 text-lg flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Create Your Account Now
            <ArrowRight className="w-5 h-5" />
          </Button>

          <p className="text-sm text-muted-foreground">
            Questions? <button className="text-primary hover:text-primary/80 font-medium">Contact us</button> • 
            <button className="text-primary hover:text-primary/80 font-medium ml-2">Read our blog</button>
          </p>
        </div>
      </section>
    </div>
  );
};

export default CreateAccountNow;
