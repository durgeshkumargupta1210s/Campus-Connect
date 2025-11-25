import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Home, FileText, CreditCard, Calendar, Ticket, MapPin, Loader2 } from 'lucide-react';
import { APIClient, API_ENDPOINTS } from '@/config/api';

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  category?: string;
}

const PaymentSuccess = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const state = location.state as {
    transactionId?: string;
    eventId?: string;
    eventTitle?: string;
    amount?: number;
    paymentMethod?: string;
    paymentId?: string;
  } | null;

  // Load event from backend
  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) {
        setError('Event ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const backendEvent: any = await APIClient.get(API_ENDPOINTS.EVENTS_GET(eventId));

        const categoryMapping: { [key: string]: string } = {
          "hackathon": "Hackathon",
          "workshop": "Workshop",
          "technical": "Placement",
          "seminar": "Seminar",
          "cultural": "Fest",
          "sports": "Competition",
          "other": "Technical"
        };

        const mappedEvent: Event = {
          id: backendEvent._id || backendEvent.id,
          title: backendEvent.title,
          date: backendEvent.date ? new Date(backendEvent.date).toLocaleDateString() : 'N/A',
          location: backendEvent.location,
          category: categoryMapping[backendEvent.category?.toLowerCase()] || backendEvent.category || 'Technical'
        };

        setEvent(mappedEvent);
      } catch (err: any) {
        console.error('Error loading event:', err);
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading payment confirmation...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-background">
          <div className="container mx-auto py-12 px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || 'Event Not Found'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || 'The event associated with this payment could not be found.'}
            </p>
            <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90">
              Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If no state but we have event, show success page with available data
  if (!state) {
    // Allow showing success page even without state (e.g., direct URL access)
    // Use defaults for missing payment info
  }

  const getPaymentMethodLabel = (method: string) => {
    const methodMap: Record<string, string> = {
      'card': 'Credit/Debit Card',
      'upi': 'UPI',
      'netbanking': 'Net Banking'
    };
    return methodMap[method] || method;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-background">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border-b border-green-500/30 py-12 px-4">
          <div className="container mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
                <CheckCircle className="w-24 h-24 text-green-500 relative" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-white/80 text-lg">Your registration is confirmed</p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Main Confirmation Card */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-slate-900 border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground">Confirmation Details</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Info */}
                  <div className="space-y-4 border-b border-border pb-6">
                    <h3 className="font-semibold text-foreground text-lg">Payment Information</h3>

                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">Transaction ID</p>
                        <p className="font-mono text-foreground font-semibold">
                          {state?.transactionId || state?.paymentId || 'N/A'}
                        </p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">
                        Completed
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <div className="flex items-center gap-2 mt-1">
                          <CreditCard className="w-4 h-4 text-primary" />
                          <p className="font-semibold text-foreground">
                            {state?.paymentMethod ? getPaymentMethodLabel(state.paymentMethod) : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount Paid</p>
                        <p className="font-semibold text-foreground text-lg">
                          {state?.amount ? `₹${state.amount}` : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Date & Time</p>
                      <p className="font-semibold text-foreground">{new Date().toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="space-y-4 border-b border-border pb-6">
                    <h3 className="font-semibold text-foreground text-lg">Event Details</h3>

                    <div>
                      <p className="text-sm text-muted-foreground">Event Name</p>
                      <p className="font-semibold text-foreground text-lg">{event.title}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Event Date</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-accent" />
                          <p className="font-semibold text-foreground">{event.date}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <Badge variant="outline" className="mt-1">{event.category}</Badge>
                      </div>
                    </div>

                    {event.location && (
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-semibold text-foreground">{event.location}</p>
                      </div>
                    )}
                  </div>

                  {/* Registration Confirmation */}
                  <div className="space-y-4 border-b border-border pb-6">
                    <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-accent" />
                      Registration Confirmed
                    </h3>

                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-sm text-foreground mb-2">
                        ✓ Your registration for <strong>{event.title}</strong> has been confirmed!
                      </p>
                      <p className="text-xs text-muted-foreground">
                        A confirmation email has been sent to your registered email address with all the details.
                      </p>
                    </div>

                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">📋 Entry Instructions</p>
                      <ul className="text-xs text-foreground/80 space-y-1">
                        <li>✓ Check your email for the confirmation and ticket details</li>
                        <li>✓ Arrive 15 minutes before event start time</li>
                        <li>✓ Bring a valid ID for verification at the venue</li>
                        <li>✓ View your registration in "My Registrations"</li>
                      </ul>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="space-y-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="font-semibold text-foreground">What's Next?</h4>
                    <ul className="space-y-2 text-sm text-foreground/80">
                      <li className="flex gap-2">
                        <span className="text-blue-500 font-semibold">1.</span>
                        <span>A confirmation email with your ticket has been sent</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-500 font-semibold">2.</span>
                        <span>Save or print your ticket - you'll need it at the venue</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-500 font-semibold">3.</span>
                        <span>View all your tickets anytime in "My Tickets"</span>
                      </li>
                    </ul>
                  </div>

                  {/* Receipt Download */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.print()}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Actions */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-slate-900 border-border sticky top-20 h-fit">
                <CardHeader>
                  <CardTitle className="text-foreground text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => navigate('/my-tickets')}
                    className="w-full bg-gradient-accent hover:opacity-90 text-white"
                    size="lg"
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    View My Tickets
                  </Button>

                  <Button 
                    onClick={() => navigate(`/event/${eventId}`)}
                    className="w-full bg-gradient-accent hover:opacity-90 text-white"
                    size="lg"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Event Details
                  </Button>

                  <Button 
                    onClick={() => navigate('/my-events')}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    My Registrations
                  </Button>

                  <Button 
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </CardContent>
              </Card>

              {/* Support Card */}
              <Card className="bg-white dark:bg-slate-900 border-border mt-4">
                <CardHeader>
                  <CardTitle className="text-foreground text-base">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    If you face any issues with your registration or payment, please contact our support team.
                  </p>
                  <p className="text-foreground font-semibold">
                    📧 support@campusconnecthub.com
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
