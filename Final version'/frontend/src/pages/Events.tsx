import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Users, Code2, Rocket, Target, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useEvents } from "@/hooks/useEvents";

const timeline = [
  { phase: "Registration", duration: "2 weeks before", color: "bg-primary" },
  { phase: "Event Day", duration: "24-48 hours", color: "bg-accent" },
  { phase: "Judging", duration: "48 hours after", color: "bg-primary" },
  { phase: "Results", duration: "1 week after", color: "bg-accent" },
];

const Events = () => {
  const navigate = useNavigate();
  const { events: hackathons, loading } = useEvents(); // Show all events, not just Hackathons
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-gradient-hero pt-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
          </div>
          
          <div className="container mx-auto px-4 py-24 relative z-10">
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Rocket className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Build & Innovate</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Events & <br />
                <span className="bg-gradient-accent bg-clip-text text-transparent">Competitions</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                Showcase your skills, build amazing projects, and win exciting prizes. Your next big opportunity awaits!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                  onClick={() => document.getElementById('upcoming-events')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Events
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-white">15+</div>
                  <div className="text-white/80 text-sm">Events/Year</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-accent">₹5L+</div>
                  <div className="text-white/80 text-sm">Total Prize Pool</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-white">1000+</div>
                  <div className="text-white/80 text-sm">Participants</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section id="upcoming-events" className="py-24 px-4 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Upcoming Events
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Mark your calendar and register for the most exciting events
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {hackathons.map((hack, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/events/${hack.id}`)}
                  className="group text-left hover:no-underline"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition"></div>
                  <Card className="relative bg-white dark:bg-slate-900 border-border hover:shadow-xl transition-all group-hover:scale-105 h-full flex flex-col cursor-pointer overflow-hidden">
                    {/* Event Poster */}
                    {(hack as any).imageUrl && (
                      <div className="w-full h-48 overflow-hidden">
                        <img 
                          src={(hack as any).imageUrl} 
                          alt={hack.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-accent/20 text-accent hover:bg-accent/30">{hack.status}</Badge>
                        <Badge variant="outline">{hack.difficulty}</Badge>
                      </div>
                      <CardTitle className="text-2xl text-foreground">{hack.title}</CardTitle>
                      <CardDescription className="text-base mt-2 line-clamp-2">{hack.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-foreground">
                          <Calendar className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-sm text-muted-foreground">Date</div>
                            <div className="font-semibold">{hack.date}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-foreground">
                          <Zap className="w-5 h-5 text-accent" />
                          <div>
                            <div className="text-sm text-muted-foreground">Duration</div>
                            <div className="font-semibold">{hack.duration}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-foreground">
                          <Trophy className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-sm text-muted-foreground">Prize Pool</div>
                            <div className="font-semibold">{hack.prize}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-foreground">
                          <Users className="w-5 h-5 text-accent" />
                          <div>
                            <div className="text-sm text-muted-foreground">Registrations</div>
                            <div className="font-semibold">{hack.participants}+ registered</div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-border">
                          <div className="text-sm text-muted-foreground mb-2">Technologies</div>
                          <div className="flex flex-wrap gap-2">
                            {hack.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>

                  </Card>
                </button>
              ))}
            </div>
          </div>
        </section>



        {/* Timeline */}
        <section className="py-24 px-4 bg-background">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Event Timeline
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Here's what happens at each stage
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {timeline.map((item, index) => (
                  <div key={index} className="relative">
                    {index < timeline.length - 1 && (
                      <div className="hidden lg:block absolute top-1/3 -right-2 w-4 h-0.5 bg-gradient-to-r from-primary to-accent"></div>
                    )}
                    <Card className="bg-white dark:bg-slate-900 border-border">
                      <CardHeader className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4 ${item.color}`}>
                          {index + 1}
                        </div>
                        <CardTitle className="text-lg text-foreground">{item.phase}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-muted-foreground">{item.duration}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-24 px-4 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          <div className="container mx-auto max-w-3xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Tips to Win
              </h2>
              <p className="text-xl text-white/90">
                Follow these tips to ace your next event
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { num: "1", title: "Form Strong Teams", desc: "Find teammates with complementary skills" },
                { num: "2", title: "Plan Ahead", desc: "Have a clear project plan before you start" },
                { num: "3", title: "Focus on MVP", desc: "Build a minimum viable product first" },
                { num: "4", title: "Present Well", desc: "Your presentation matters as much as your code" },
              ].map((tip, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                  <div className="text-4xl font-bold text-accent mb-4">{tip.num}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{tip.title}</h3>
                  <p className="text-white/80">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
};

export default Events;
