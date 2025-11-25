import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClubs } from "@/hooks/useClubs";
import { Club } from "@/services/clubService";
import { Users, Heart, Code2, Palette, Music, Camera, Mic, BookOpen } from "lucide-react";

const Community = () => {
  const navigate = useNavigate();
  const { clubs, loadClubs } = useClubs();
  const [displayClubs, setDisplayClubs] = useState<Club[]>([]);

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  useEffect(() => {
    if (clubs.length > 0) {
      setDisplayClubs(clubs);
    }
  }, [clubs]);

  const getClubIcon = (clubName: string) => {
    const iconMap: Record<string, JSX.Element> = {
      "Coding Club": <Code2 className="w-8 h-8" />,
      "Design Society": <Palette className="w-8 h-8" />,
      "Music Club": <Music className="w-8 h-8" />,
      "Photography Club": <Camera className="w-8 h-8" />,
      "Debate Society": <Mic className="w-8 h-8" />,
      "Literary Club": <BookOpen className="w-8 h-8" />,
    };
    return iconMap[clubName] || <Users className="w-8 h-8" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Clubs Grid */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-bold">Active Clubs</h2>
              <Badge className="bg-accent text-accent-foreground">{displayClubs.length} Communities</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayClubs.map((club) => (
                <Card key={club.id} className="bg-gradient-card border-border hover:shadow-lg transition-all hover:scale-105 group overflow-hidden cursor-pointer">
                  <div className={`h-32 ${club.color} relative flex items-center justify-center`}>
                    <div className="text-white group-hover:animate-float">
                      {getClubIcon(club.name)}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-2xl">{club.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {club.members}+ members
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{club.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {club.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="space-y-2">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => navigate(`/club/${club.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 px-4 bg-secondary">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Why Join a Club?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: <Users className="w-12 h-12" />,
                  title: "Build Your Network",
                  description: "Connect with students who share your passions and interests across all years.",
                },
                {
                  icon: <Heart className="w-12 h-12" />,
                  title: "Pursue Your Passion",
                  description: "Dedicate time to what you love while balancing academics and personal growth.",
                },
                {
                  icon: <BookOpen className="w-12 h-12" />,
                  title: "Learn New Skills",
                  description: "Develop leadership, teamwork, and technical skills through hands-on experience.",
                },
              ].map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-primary mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-gradient-hero">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Start Your Club Journey</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Don't see a club that matches your interest? Start your own community!
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Create a Club
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Community;
