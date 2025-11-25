import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Users, Clock, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";

const Workshops = () => {
  const navigate = useNavigate();
  const { events: workshops } = useEvents("Workshop");

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
                <BookOpen className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Learn & Grow</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Workshops & <br />
                <span className="bg-gradient-accent bg-clip-text text-transparent">Learning Sessions</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                Upskill yourself with industry experts. Learn new technologies and best practices.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                  onClick={() => document.getElementById('upcoming-workshops')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Workshops
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-white">{workshops.length}+</div>
                  <div className="text-white/80 text-sm">Active Workshops</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-accent">1000+</div>
                  <div className="text-white/80 text-sm">Learners Trained</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-white">50+</div>
                  <div className="text-white/80 text-sm">Expert Mentors</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Workshops */}
        <section id="upcoming-workshops" className="py-24 px-4 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Upcoming Workshops
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Register for hands-on learning sessions from industry experts
              </p>
            </div>
            
            {workshops.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No workshops scheduled yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {workshops.map((workshop) => (
                  <button
                    key={workshop.id}
                    onClick={() => navigate(`/workshops/${workshop.id}`)}
                    className="group text-left hover:no-underline"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition"></div>
                    <Card className="relative bg-white dark:bg-slate-900 border-border hover:shadow-xl transition-all group-hover:scale-105 h-full flex flex-col cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-accent/20 text-accent hover:bg-accent/30">{workshop.status}</Badge>
                          {workshop.difficulty && (
                            <Badge variant="outline">{workshop.difficulty}</Badge>
                          )}
                        </div>
                        <CardTitle className="text-2xl text-foreground">{workshop.title}</CardTitle>
                        <CardDescription className="text-base mt-2">{workshop.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-foreground">
                            <Calendar className="w-5 h-5 text-primary" />
                            <div>
                              <div className="text-sm text-muted-foreground">Date</div>
                              <div className="font-semibold">{workshop.date}</div>
                            </div>
                          </div>
                          
                          {workshop.duration && (
                            <div className="flex items-center gap-3 text-foreground">
                              <Clock className="w-5 h-5 text-accent" />
                              <div>
                                <div className="text-sm text-muted-foreground">Duration</div>
                                <div className="font-semibold">{workshop.duration}</div>
                              </div>
                            </div>
                          )}
                          
                          {workshop.organizer && (
                            <div className="flex items-center gap-3 text-foreground">
                              <Award className="w-5 h-5 text-primary" />
                              <div>
                                <div className="text-sm text-muted-foreground">Organizer</div>
                                <div className="font-semibold">{workshop.organizer}</div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-3 text-foreground">
                            <Users className="w-5 h-5 text-accent" />
                            <div>
                              <div className="text-sm text-muted-foreground">Capacity</div>
                              <div className="font-semibold">{workshop.capacity || 0} Seats</div>
                            </div>
                          </div>
                          
                          {workshop.tags && workshop.tags.length > 0 && (
                            <div className="pt-4 border-t border-border">
                              <div className="text-sm text-muted-foreground mb-2">Topics Covered</div>
                              <div className="flex flex-wrap gap-2">
                                {workshop.tags.map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                ))}
              </div>
            )}
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
                Workshop Tips
              </h2>
              <p className="text-xl text-white/90">
                Get the most out of your learning experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { num: "1", title: "Prepare Ahead", desc: "Review prerequisites and install required software" },
                { num: "2", title: "Engage Actively", desc: "Ask questions and participate in hands-on exercises" },
                { num: "3", title: "Take Notes", desc: "Document key learnings and code snippets" },
                { num: "4", title: "Practice Later", desc: "Apply what you learned in real projects" },
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

export default Workshops;
