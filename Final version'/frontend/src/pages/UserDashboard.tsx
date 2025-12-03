import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Ticket,
  Heart,
  Share2,
  LogOut,
  Settings,
  Bell,
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const user = {
    name: "Rahul Kumar",
    email: "rahul@example.com",
    avatar: "RK",
    registeredEvents: 5,
    upcomingEvents: 3,
    badges: 12,
  };

  const registeredEvents = [
    {
      id: 1,
      title: "Tech Fest 2024",
      date: "March 15, 2024",
      time: "10:00 AM - 6:00 PM",
      location: "Main Auditorium",
      status: "Registered",
      category: "Fest",
      attendees: 320,
      capacity: 500,
    },
    {
      id: 2,
      title: "AI/ML Hackathon",
      date: "March 20-21, 2024",
      time: "9:00 AM",
      location: "Computer Lab",
      status: "Registered",
      category: "Hackathon",
      attendees: 95,
      capacity: 120,
    },
    {
      id: 3,
      title: "Cultural Night",
      date: "March 18, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "Open Arena",
      status: "Registered",
      category: "Cultural",
      attendees: 650,
      capacity: 800,
    },
  ];

  const savedEvents = [
    {
      id: 4,
      title: "Web Dev Workshop",
      date: "April 1, 2024",
      location: "Tech Hub",
      category: "Workshop",
      attendees: 45,
      capacity: 50,
    },
    {
      id: 5,
      title: "UI/UX Design Talk",
      date: "April 5, 2024",
      location: "Design Studio",
      category: "Talk",
      attendees: 78,
      capacity: 100,
    },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-hero py-12 px-4 border-b border-white/10">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white text-gradient-hero rounded-full flex items-center justify-center font-bold text-xl">
                  {user.avatar}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
                  <p className="text-white/80">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all" title="Notifications">
                  <Bell className="w-6 h-6" />
                </button>
                <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all" title="Settings">
                  <Settings className="w-6 h-6" />
                </button>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-3xl font-bold text-white">{user.registeredEvents}</div>
                <p className="text-white/80 text-sm mt-1">Events Registered</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-3xl font-bold text-white">{user.upcomingEvents}</div>
                <p className="text-white/80 text-sm mt-1">Upcoming Events</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-3xl font-bold text-white">{user.badges}</div>
                <p className="text-white/80 text-sm mt-1">Badges Earned</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-3xl font-bold text-white">Level 5</div>
                <p className="text-white/80 text-sm mt-1">Community Level</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
                <TabsTrigger value="overview">My Events</TabsTrigger>
                <TabsTrigger value="saved">Saved Events</TabsTrigger>
                <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              </TabsList>

              {/* My Events Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Registered Events</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {registeredEvents.map((event) => (
                      <Card key={event.id} className="bg-white dark:bg-slate-900 border-border hover:shadow-lg transition-all group">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between mb-2">
                            <Badge className="bg-primary text-primary-foreground">{event.category}</Badge>
                            <Badge className="bg-accent/20 text-accent">{event.status}</Badge>
                          </div>
                          <CardTitle className="text-xl text-foreground">{event.title}</CardTitle>
                          <CardDescription className="text-base mt-2">{event.location}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-foreground">
                              <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                              <div>
                                <div className="text-sm text-muted-foreground">Date & Time</div>
                                <div className="font-semibold">{event.date} • {event.time}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 text-foreground">
                              <Users className="w-5 h-5 text-accent flex-shrink-0" />
                              <div>
                                <div className="text-sm text-muted-foreground">Attendees</div>
                                <div className="font-semibold">{event.attendees}/{event.capacity} registered</div>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Capacity</span>
                              <span className="text-foreground font-semibold">{Math.round((event.attendees/event.capacity)*100)}%</span>
                            </div>
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-accent rounded-full transition-all" 
                                style={{ width: `${(event.attendees / event.capacity) * 100}%` } as React.CSSProperties}
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                              <Ticket className="w-4 h-4 mr-2" />
                              View Ticket
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Saved Events Tab */}
              <TabsContent value="saved" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Saved Events</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {savedEvents.map((event) => (
                      <Card key={event.id} className="bg-white dark:bg-slate-900 border-border hover:shadow-lg transition-all">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <Badge className="bg-primary text-primary-foreground">{event.category}</Badge>
                            <button className="text-red-500 hover:scale-110 transition-transform" title="Save event">
                              <Heart className="w-6 h-6 fill-current" />
                            </button>
                          </div>
                          <CardTitle className="text-xl text-foreground mt-2">{event.title}</CardTitle>
                          <CardDescription className="text-base mt-2">{event.location}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-3 text-foreground">
                            <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="font-semibold">{event.date}</span>
                          </div>

                          <div className="flex items-center gap-3 text-foreground">
                            <Users className="w-5 h-5 text-accent flex-shrink-0" />
                            <span className="font-semibold">{event.attendees}/{event.capacity} interested</span>
                          </div>

                          <Button className="w-full bg-gradient-accent hover:opacity-90 text-white">
                            Register Now
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">My Bookings</h2>
                  <Card className="bg-white dark:bg-slate-900 border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Booking History</CardTitle>
                      <CardDescription>View all your event bookings and registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {registeredEvents.map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary transition-all">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{event.title}</h4>
                              <p className="text-sm text-muted-foreground">{event.date} • {event.location}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge className="bg-primary text-primary-foreground">{event.status}</Badge>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
