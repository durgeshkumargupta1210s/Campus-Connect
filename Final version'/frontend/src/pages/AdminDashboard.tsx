import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  LogOut, 
  Menu, 
  X, 
  BarChart3, 
  Calendar, 
  Users, 
  Zap,
  LayoutDashboard,
  Edit2,
  Trash2,
  Eye,
  Briefcase,
  Users2,
  DollarSign,
  CreditCard,
  AlertCircle
} from "lucide-react";
// Removed localStorage services - using backend API directly
import { useOpportunities } from "@/hooks/useOpportunities";
import { useClubs } from "@/hooks/useClubs";
import { useClubApplications } from "@/hooks/useClubApplications";
import { usePayments } from "@/hooks/usePayments";
import { APIClient, API_ENDPOINTS } from "@/config/api";
import { useToast } from "@/hooks/use-toast";
import { useEvents } from "@/hooks/useEvents";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "events", label: "Events", icon: Calendar },
    { id: "bookings", label: "Bookings", icon: Users },
    { id: "opportunities", label: "Opportunities", icon: Briefcase },
    { id: "clubs", label: "Clubs", icon: Users2 },
    { id: "club-applications", label: "Club Applications", icon: Users },
    { id: "payments", label: "Payments", icon: Briefcase },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-gradient-hero transition-all duration-300 border-r border-white/10 flex flex-col overflow-y-auto`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white font-bold">
              CC
            </div>
            {sidebarOpen && <span className="text-white font-bold text-lg">CampusConnect Admin</span>}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-white/20 text-white border border-white/30"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-border shadow-sm">
          <div className="flex items-center justify-between p-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-foreground hover:bg-secondary p-2 rounded-lg transition-all"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <h1 className="text-2xl font-bold text-foreground">
              {menuItems.find(m => m.id === activeTab)?.label || "Dashboard"}
            </h1>
            
            {activeTab === "events" && (
              <Button 
                onClick={() => navigate("/admin/add-event")}
                className="bg-gradient-accent hover:opacity-90 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            )}
            {activeTab === "opportunities" && (
              <Button 
                onClick={() => navigate("/admin/add-opportunity")}
                className="bg-gradient-accent hover:opacity-90 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Opportunity
              </Button>
            )}
            {activeTab === "clubs" && (
              <Button 
                onClick={() => navigate("/admin/add-club")}
                className="bg-gradient-accent hover:opacity-90 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Club
              </Button>
            )}
            {!["events", "opportunities", "clubs"].includes(activeTab) && <div />}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "events" && <EventsTab />}
          {activeTab === "bookings" && <BookingsTab />}
          {activeTab === "opportunities" && <OpportunitiesTab />}
          {activeTab === "clubs" && <ClubsTab />}
          {activeTab === "club-applications" && <ClubApplicationsTab />}
          {activeTab === "payments" && <PaymentsTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
        </main>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = () => {
  const { events, loading: eventsLoading } = useEvents();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    upcomingEvents: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        // Fetch all events
        const eventsData = await APIClient.get<{ events?: any[] } | any[]>(API_ENDPOINTS.EVENTS_LIST);
        const allEvents = Array.isArray(eventsData) ? eventsData : (eventsData.events || []);
        
        // Fetch registrations for bookings count
        const registrationsData = await APIClient.get(API_ENDPOINTS.REGISTRATIONS_LIST);
        const allRegistrations = Array.isArray(registrationsData) ? registrationsData : (registrationsData.registrations || []);
        
        const totalEvents = allEvents.length;
        const upcomingEvents = allEvents.filter((e: any) => e.status === 'upcoming' || new Date(e.date) >= new Date()).length;
        const totalBookings = allRegistrations.length;
        
        // Calculate revenue from completed payments
        // Note: Payments endpoint may need to be added to backend
        let revenue = 0;
        try {
          // Get payments from backend
          const paymentsData = await APIClient.get(API_ENDPOINTS.PAYMENTS_LIST);
          const payments = Array.isArray(paymentsData) ? paymentsData : (paymentsData.payments || []);
          revenue = payments
            .filter((p: any) => p.status === 'completed')
            .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        } catch (e) {
          // If payments endpoint doesn't exist, revenue stays 0
          console.log('Payments endpoint not available yet');
        }
        
        setStats({
          totalEvents,
          totalBookings,
          upcomingEvents,
          revenue
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);

  const eventStats = [
    { label: "Total Events", value: stats.totalEvents.toString(), icon: Calendar, color: "text-primary" },
    { label: "Total Bookings", value: stats.totalBookings.toLocaleString(), icon: Users, color: "text-accent" },
    { label: "Upcoming Events", value: stats.upcomingEvents.toString(), icon: Zap, color: "text-primary" },
    { label: "Revenue", value: `₹${(stats.revenue / 1000).toFixed(0)}K`, icon: BarChart3, color: "text-accent" },
  ];

  const recentEvents = events.slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {eventStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white dark:bg-slate-900 border-border hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">{stat.label}</CardTitle>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {loading ? '...' : stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">From database</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Events */}
      <Card className="bg-white dark:bg-slate-900 border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Events</CardTitle>
          <CardDescription>Your latest created events</CardDescription>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No events created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEvents.map((event: any) => (
                <div key={event.id || event._id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary transition-all">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'} • {event.location || 'TBA'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{event.participants || 0}/{event.capacity || 0}</p>
                    <p className="text-xs text-muted-foreground">Registered</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground ml-4">{event.status || 'upcoming'}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Events Tab Component
// Events Tab Component
const EventsTab = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Load from backend API
      const data = await APIClient.get<{ events?: any[] } | any[]>(API_ENDPOINTS.EVENTS_LIST);
      
      // Handle different response structures
      let eventsList: any[] = [];
      if (Array.isArray(data)) {
        eventsList = data;
      } else if (data.events && Array.isArray(data.events)) {
        eventsList = data.events;
      } else if (data.data && Array.isArray(data.data)) {
        eventsList = data.data;
      }
      
      setEvents(eventsList);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await APIClient.delete(API_ENDPOINTS.EVENTS_DELETE(eventId));
      toast({
        title: "Event Deleted",
        description: `"${eventTitle}" has been deleted successfully.`,
      });
      // Reload events after deletion
      loadEvents();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadEvents();
    // Refresh events every 5 seconds to see new events immediately
    const interval = setInterval(loadEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Manage Events</h2>
          <p className="text-muted-foreground text-sm">Create, edit, and manage campus events</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadEvents}
            variant="outline"
            className="text-foreground border-border hover:bg-secondary"
          >
            Refresh
          </Button>
          <Button 
            onClick={() => navigate("/admin/add-event")}
            className="bg-gradient-accent hover:opacity-90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Event
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-border">
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">No events created yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Event Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Capacity</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event._id || event.id} className="border-b border-border hover:bg-secondary transition-all">
                      <td className="py-3 px-4 text-foreground font-medium">{event.title || event.eventName}</td>
                      <td className="py-3 px-4 text-foreground">
                        {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-foreground">{event.location || 'N/A'}</td>
                      <td className="py-3 px-4 text-foreground">{event.capacity || 0}</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-primary text-primary-foreground">{event.status || 'Open'}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => navigate(`/events/${event._id || event.id}`)}
                            className="p-2 hover:bg-secondary rounded-lg transition-all" 
                            title="View Event Details"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/edit-event/${event._id || event.id}`)}
                            className="p-2 hover:bg-secondary rounded-lg transition-all" 
                            title="Edit Event"
                          >
                            <Edit2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event._id || event.id, event.title || event.eventName || 'Event')}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all" 
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Bookings Tab Component
const BookingsTab = () => {
  const [allRegistrations, setAllRegistrations] = useState<any[]>([]);
  const [allGroupRegistrations, setAllGroupRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch individual registrations from backend
      const registrationsData = await APIClient.get(API_ENDPOINTS.REGISTRATIONS_LIST);
      const registrations = Array.isArray(registrationsData) ? registrationsData : (registrationsData.registrations || []);
      setAllRegistrations(registrations);
      
      // Note: Group registrations might need a separate endpoint
      // For now, we'll set empty array if no endpoint exists
      setAllGroupRegistrations([]);
    } catch (err: any) {
      console.error('Error loading registrations:', err);
      setError(err.message || 'Failed to load registrations');
      setAllRegistrations([]);
      setAllGroupRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
    // Refresh every 30 seconds to get latest bookings
    const interval = setInterval(loadRegistrations, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const totalRegistrations = allRegistrations.length + allGroupRegistrations.length;
  const paidRegistrations = allRegistrations.filter(r => r.payment && r.payment.status === 'completed').length;
  const totalRevenue = allRegistrations
    .filter(r => r.payment && r.payment.status === 'completed')
    .reduce((sum, r) => sum + (r.payment.amount || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-slate-900 border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Bookings</CardTitle>
            <Users className="w-6 h-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalRegistrations}</div>
            <p className="text-xs text-muted-foreground mt-1">All registrations</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Paid Bookings</CardTitle>
            <CreditCard className="w-6 h-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{paidRegistrations}</div>
            <p className="text-xs text-muted-foreground mt-1">With completed payment</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Revenue from Bookings</CardTitle>
            <DollarSign className="w-6 h-6 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From paid registrations</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Registrations */}
      <Card className="bg-white dark:bg-slate-900 border-border">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-foreground">Individual Registrations</CardTitle>
              <CardDescription>Solo participants ({allRegistrations.length} total, {paidRegistrations} paid)</CardDescription>
            </div>
            <Button
              onClick={loadRegistrations}
              variant="outline"
              className="text-foreground border-border hover:bg-secondary"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading registrations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>Error loading registrations: {error}</p>
              <Button onClick={loadRegistrations} className="mt-4">Try Again</Button>
            </div>
          ) : allRegistrations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">No individual registrations yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 font-semibold text-foreground">Name</th>
                    <th className="text-left py-3 px-3 font-semibold text-foreground">Email</th>
                    <th className="text-left py-3 px-3 font-semibold text-foreground">Event</th>
                    <th className="text-left py-3 px-3 font-semibold text-foreground">Registration Date</th>
                    <th className="text-left py-3 px-3 font-semibold text-foreground">Payment</th>
                    <th className="text-left py-3 px-3 font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allRegistrations.map((registration) => {
                    const payment = registration.payment;
                    const paymentMethodMapping: { [key: string]: string } = {
                      'credit_card': 'Card',
                      'debit_card': 'Card',
                      'upi': 'UPI',
                      'net_banking': 'Net Banking',
                      'wallet': 'Wallet'
                    };
                    
                    return (
                      <tr key={registration._id || registration.id} className="border-b border-border hover:bg-secondary transition-all">
                        <td className="py-3 px-3 text-foreground font-medium">{registration.user?.name || registration.userName || 'N/A'}</td>
                        <td className="py-3 px-3 text-foreground">{registration.user?.email || registration.userEmail || 'N/A'}</td>
                        <td className="py-3 px-3 text-foreground">
                          <div>
                            <p className="font-medium">{registration.event?.title || registration.eventTitle || 'N/A'}</p>
                            {registration.event?.isPaid && (
                              <p className="text-xs text-muted-foreground">Paid Event • ₹{registration.event?.price || 0}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-foreground text-xs">
                          {registration.createdAt ? new Date(registration.createdAt).toLocaleDateString() : 
                           registration.registeredAt ? new Date(registration.registeredAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-3">
                          {payment ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 text-xs">
                                  Paid
                                </Badge>
                                <span className="font-semibold text-foreground text-xs">₹{payment.amount}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {paymentMethodMapping[payment.paymentMethod] || payment.paymentMethod}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono">
                                {payment.transactionId}
                              </p>
                              {payment.paidAt && (
                                <p className="text-xs text-muted-foreground">
                                  {new Date(payment.paidAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          ) : registration.event?.isPaid ? (
                            <Badge className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs">
                              Payment Pending
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-500/20 text-gray-600 dark:text-gray-400 text-xs">
                              Free Event
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <Badge 
                            className={
                              registration.status === "confirmed" || registration.status === "Confirmed" || registration.status === "registered"
                                ? "bg-primary text-primary-foreground"
                                : "bg-red-500 text-white"
                            }
                          >
                            {registration.status || 'pending'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Registrations */}
      <Card className="bg-white dark:bg-slate-900 border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Team Registrations</CardTitle>
          <CardDescription>Group hackathon teams ({allGroupRegistrations.length} teams, {allGroupRegistrations.reduce((sum, t) => sum + t.totalMembers, 0)} members)</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading team registrations...</p>
            </div>
          ) : allGroupRegistrations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">No team registrations yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allGroupRegistrations.map((team) => (
                <div key={team.id} className="border border-border rounded-lg p-4 hover:bg-secondary transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Team Name</p>
                      <p className="font-semibold text-foreground">{team.teamName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Event</p>
                      <p className="font-semibold text-foreground">{team.eventTitle}</p>
                    </div>
                    <div className="flex items-end">
                      <Badge 
                        className={
                          team.status === "Confirmed" 
                            ? "bg-primary text-primary-foreground"
                            : "bg-red-500 text-white"
                        }
                      >
                        {team.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Team Leader</p>
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <span className="text-foreground font-medium">{team.teamLeader.name}</span>
                      <span className="text-muted-foreground">{team.teamLeader.email}</span>
                      <span className="text-muted-foreground">{team.teamLeader.phone}</span>
                    </div>

                    <p className="text-xs font-semibold text-muted-foreground mb-2">Team Members ({team.totalMembers})</p>
                    <div className="space-y-1">
                      {team.teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center gap-4 text-sm bg-secondary rounded px-3 py-2">
                          <Badge variant="outline" className="text-xs">{member.role}</Badge>
                          <span className="text-foreground font-medium min-w-32">{member.name}</span>
                          <span className="text-muted-foreground flex-1">{member.email}</span>
                          <span className="text-muted-foreground">{member.phone}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                    Registered on {new Date(team.registeredAt).toLocaleDateString()} at {new Date(team.registeredAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = () => {
  return (
    <div className="p-6 space-y-6">
      <Card className="bg-white dark:bg-slate-900 border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Analytics Overview</CardTitle>
          <CardDescription>Event performance and user engagement metrics</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Analytics charts will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Opportunities Tab Component
const OpportunitiesTab = () => {
  const { opportunities, loadOpportunities, deleteOpportunity } = useOpportunities();

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-white dark:bg-slate-900 border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Manage Opportunities</CardTitle>
          <CardDescription>Create and manage job opportunities, internships, and fellowships ({opportunities.length} total)</CardDescription>
        </CardHeader>
        <CardContent>
          {opportunities.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">No opportunities created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="border border-border rounded-lg p-4 hover:bg-secondary transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Title</p>
                      <p className="font-semibold text-foreground">{opp.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="font-semibold text-foreground">{opp.company}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <Badge className="bg-blue-100 text-blue-800">{opp.type}</Badge>
                    </div>
                    <div className="flex items-end">
                      <Badge className={opp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}>
                        {opp.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground grid grid-cols-3 gap-2 mb-3">
                    {opp.ctc && <span>CTC: {opp.ctc}</span>}
                    {opp.positions && <span>Positions: {opp.positions}</span>}
                    {opp.deadline && <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-all" title="Edit">
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Delete this opportunity?')) {
                          deleteOpportunity(opp.id);
                        }
                      }}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all" 
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Campus Drives Tab Component

// Clubs Tab Component
const ClubsTab = () => {
  const navigate = useNavigate();
  const { clubs, loadClubs, deleteClub } = useClubs();

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  return (
    <div className="p-6">
      <Card className="bg-white dark:bg-slate-900 border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Manage Clubs</CardTitle>
          <CardDescription>Create, edit, and manage campus clubs</CardDescription>
        </CardHeader>
        <CardContent>
          {clubs.length === 0 ? (
            <div className="text-center py-8">
              <Users2 className="w-10 h-10 mx-auto mb-3 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">No clubs created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {clubs.map((club) => (
                <div key={club.id} className="border border-border rounded-lg p-4 hover:bg-secondary transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Club Name</p>
                      <p className="font-semibold text-foreground">{club.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Members</p>
                      <p className="font-semibold text-foreground">{club.members}+</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Established</p>
                      <p className="font-semibold text-foreground">{club.establishedYear}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">President</p>
                      <p className="font-semibold text-foreground">{club.president.name}</p>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {club.description}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {club.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {club.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{club.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.open(`/club/${club.id}`, '_blank')}
                      className="p-2 hover:bg-secondary rounded-lg transition-all" 
                      title="View"
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/edit-club/${club.id}`)}
                      className="p-2 hover:bg-secondary rounded-lg transition-all" 
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Delete this club?')) {
                          deleteClub(club.id);
                        }
                      }}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all" 
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Club Applications Tab Component
const ClubApplicationsTab = () => {
  const { applications, loadApplications, updateApplicationStatus, deleteApplication } = useClubApplications();

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const approvedApplications = applications.filter(app => app.status === 'approved');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  const renderApplications = (apps: typeof applications) => {
    return (
      <div className="space-y-4">
        {apps.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No applications</p>
        ) : (
          apps.map((app) => (
            <div key={app.id} className="border border-border rounded-lg p-4 hover:bg-secondary transition-all">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-semibold text-foreground">{app.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Club</p>
                  <p className="font-semibold text-foreground">{app.clubName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Roll Number</p>
                  <p className="font-semibold text-foreground">{app.universityRollNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Year</p>
                  <p className="font-semibold text-foreground">{app.year}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Team Interest</p>
                  <p className="font-semibold text-foreground text-sm">{app.teamInterest}</p>
                </div>
              </div>

              <div className="text-sm text-muted-foreground grid grid-cols-3 gap-2 mb-3">
                <span>Email: {app.email}</span>
                <span>Phone: {app.phone}</span>
                <span>Applied: {new Date(app.applicationDate).toLocaleDateString()}</span>
              </div>

              {app.resume && (
                <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Resume attached</span>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = app.resume;
                      link.download = `${app.fullName}_resume.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-100 rounded text-xs font-medium transition-all"
                    title="Download resume"
                  >
                    Download
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                {app.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateApplicationStatus(app.id, 'approved')}
                      className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-all text-sm font-medium"
                      title="Approve"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-all text-sm font-medium"
                      title="Reject"
                    >
                      Reject
                    </button>
                  </>
                )}
                {app.status !== 'pending' && (
                  <Badge className={app.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                )}
                <button 
                  onClick={() => {
                    if (window.confirm('Delete this application?')) {
                      deleteApplication(app.id);
                    }
                  }}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all ml-auto" 
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-slate-900 border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Pending</CardTitle>
            <Users className="w-6 h-6 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pendingApplications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Applications awaiting review</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Approved</CardTitle>
            <Users className="w-6 h-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{approvedApplications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Applications approved</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Rejected</CardTitle>
            <Users className="w-6 h-6 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{rejectedApplications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Applications rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Applications */}
      <Card className="bg-white dark:bg-slate-900 border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-yellow-600">Pending Applications</CardTitle>
          <CardDescription>Review and take action on new applications</CardDescription>
        </CardHeader>
        <CardContent>
          {renderApplications(pendingApplications)}
        </CardContent>
      </Card>

      {/* Approved Applications */}
      <Card className="bg-white dark:bg-slate-900 border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-green-600">Approved Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {renderApplications(approvedApplications)}
        </CardContent>
      </Card>

      {/* Rejected Applications */}
      <Card className="bg-white dark:bg-slate-900 border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-red-600">Rejected Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {renderApplications(rejectedApplications)}
        </CardContent>
      </Card>
    </div>
  );
};

// Payments Tab Component
const PaymentsTab = () => {
  const { payments, loadPayments, updatePaymentStatus, deletePayment } = usePayments();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const filteredPayments = payments.filter(p => filterStatus === 'all' ? true : p.status === filterStatus);
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const failedPayments = payments.filter(p => p.status === 'failed').length;

  return (
    <div className="p-6 space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900 border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Revenue</CardTitle>
            <Briefcase className="w-6 h-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed payments</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Payments</CardTitle>
            <Users className="w-6 h-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{payments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Pending</CardTitle>
            <Users className="w-6 h-6 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Failed</CardTitle>
            <Users className="w-6 h-6 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{failedPayments}</div>
            <p className="text-xs text-muted-foreground mt-1">Failed transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <Card className="bg-white dark:bg-slate-900 border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Payment Transactions</CardTitle>
          <CardDescription>Manage event payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border pb-4">
            {(['all', 'pending', 'completed', 'failed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  filterStatus === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({filteredPayments.filter(p => status === 'all' ? true : p.status === status).length})
              </button>
            ))}
          </div>

          {filteredPayments.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">No payments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="border border-border rounded-lg p-4 hover:bg-secondary transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">User</p>
                      <p className="font-semibold text-foreground">{payment.userName}</p>
                      <p className="text-xs text-muted-foreground">{payment.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Event</p>
                      <p className="font-semibold text-foreground">{payment.eventTitle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-semibold text-foreground text-lg">₹{payment.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Method</p>
                      <Badge className="mt-1 capitalize">
                        {payment.paymentMethod.replace(/([A-Z])/g, ' $1').trim()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge className={`mt-1 ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground grid grid-cols-3 gap-2 mb-3">
                    <span>ID: {payment.id}</span>
                    <span>TXN: {payment.transactionId}</span>
                    <span>Date: {new Date(payment.paymentDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {payment.status === 'pending' && (
                      <>
                        <button 
                          onClick={async () => {
                            const result = await updatePaymentStatus(payment.id, 'completed');
                            if (result.success) {
                              toast({
                                title: "Payment Completed",
                                description: "Payment status updated successfully.",
                              });
                              loadPayments();
                            }
                          }}
                          className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-all text-sm font-medium"
                          title="Mark as completed"
                        >
                          Complete
                        </button>
                        <button 
                          onClick={async () => {
                            const result = await updatePaymentStatus(payment.id, 'failed');
                            if (result.success) {
                              toast({
                                title: "Payment Failed",
                                description: "Payment status updated to failed.",
                              });
                              loadPayments();
                            }
                          }}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-all text-sm font-medium"
                          title="Mark as failed"
                        >
                          Failed
                        </button>
                      </>
                    )}
                    <button 
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this payment record? This action cannot be undone.')) {
                          const result = await deletePayment(payment.id);
                          if (result.success) {
                            toast({
                              title: "Payment Deleted",
                              description: "Payment record has been deleted.",
                            });
                            loadPayments();
                          } else {
                            toast({
                              title: "Error",
                              description: result.error || "Failed to delete payment.",
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-all ml-auto" 
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
