import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Clock, Mail, Phone, CheckCircle, AlertCircle, Plus, Trash2, CreditCard } from 'lucide-react';
import { Event } from '@/services/eventService';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useGroupRegistrations } from '@/hooks/useGroupRegistrations';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APIClient, API_ENDPOINTS } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, userEmail, userName } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load event from backend API
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
        
        // Try to fetch from backend API first
        const backendEvent = await APIClient.get(API_ENDPOINTS.EVENTS_GET(eventId));
        
        // Map backend category to frontend category format
        const categoryMapping: { [key: string]: string } = {
          "hackathon": "Hackathon",
          "workshop": "Workshop",
          "technical": "Placement",
          "seminar": "Seminar",
          "cultural": "Fest",
          "sports": "Competition",
          "other": "Technical"
        };
        
        // Map backend payment methods to frontend format
        const paymentMethodMapping: { [key: string]: string } = {
          'credit_card': 'card',
          'debit_card': 'card',
          'upi': 'upi',
          'net_banking': 'netbanking',
          'wallet': 'upi'
        };

        // Convert backend format to frontend format
        const convertedEvent: Event = {
          id: backendEvent._id || backendEvent.id,
          title: backendEvent.title,
          date: backendEvent.date ? new Date(backendEvent.date).toLocaleDateString() : '',
          time: backendEvent.time,
          location: backendEvent.location,
          description: backendEvent.description,
          category: categoryMapping[backendEvent.category?.toLowerCase()] || backendEvent.category || 'Technical',
          duration: backendEvent.duration,
          status: backendEvent.status || 'upcoming',
          capacity: backendEvent.capacity,
          tags: backendEvent.tags || [],
          participants: backendEvent.registeredCount || 0,
          difficulty: 'All Levels',
          prize: '₹0',
          registrationFee: '',
          organizer: backendEvent.organizer?.name || backendEvent.organizer || '',
          contactEmail: '',
          contactPhone: '',
          // Payment fields
          isPaid: backendEvent.isPaid || false,
          price: backendEvent.price || 0,
          paymentMethods: backendEvent.paymentMethods?.map((m: string) => paymentMethodMapping[m] || m) || [],
          paymentDeadline: backendEvent.paymentDeadline,
        };
        
        // Add imageUrl if it exists (for poster display)
        if (backendEvent.imageUrl) {
          (convertedEvent as any).imageUrl = backendEvent.imageUrl;
          console.log('Event imageUrl found:', backendEvent.imageUrl.substring(0, 50) + '...');
        } else {
          console.log('No imageUrl in backend event');
        }
        
        console.log('Converted event:', convertedEvent);
        console.log('Event isPaid:', convertedEvent.isPaid, 'price:', convertedEvent.price);
        setEvent(convertedEvent);
      } catch (err: any) {
        console.error('Error loading event from backend:', err);
        setError('Event not found');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  const { register, isRegistered } = useRegistrations(eventId);
  const { registerTeam, isTeamRegistered } = useGroupRegistrations(eventId);
  
  // Individual registration form
  const [formData, setFormData] = useState({
    fullName: userName || '',
    email: userEmail || '',
    phone: ''
  });

  // Group registration form
  const [groupFormData, setGroupFormData] = useState({
    teamName: '',
    teamLeaderName: userName || '',
    teamLeaderEmail: userEmail || '',
    teamLeaderPhone: '',
    teamMembers: [{ name: '', email: '', phone: '' }]
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationType, setRegistrationType] = useState<'individual' | 'group'>('individual');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-background">
          <div className="container mx-auto py-12 px-4 text-center">
            <p className="text-muted-foreground">Loading event details...</p>
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
            <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-4">{error || 'The event you are looking for does not exist.'}</p>
            <Button onClick={() => navigate(-1)} className="bg-primary hover:bg-primary/90">
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Registration count comes from event.participants (from backend)
  const registrationCount = event.participants || 0;
  const userAlreadyRegistered = eventId ? isRegistered(userEmail || '') : false;
  const teamAlreadyRegistered = eventId ? isTeamRegistered(userEmail || '') : false;
  const isGroupEvent = event.category === 'Hackathon'; // Hackathons support group registration

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGroupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGroupFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamMemberChange = (index: number, field: 'name' | 'email' | 'phone', value: string) => {
    setGroupFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const addTeamMember = () => {
    setGroupFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: '', email: '', phone: '' }]
    }));
  };

  const removeTeamMember = (index: number) => {
    setGroupFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (!formData.fullName || !formData.email || !formData.phone) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = register({
        eventId: event.id,
        eventTitle: event.title,
        eventCategory: event.category,
        userName: formData.fullName,
        userEmail: formData.email,
        userPhone: formData.phone
      });

      if (result.success) {
        setMessage({
          type: 'success',
          text: '✓ Registration successful! Check your email for confirmation.'
        });
        setFormData({ fullName: '', email: '', phone: '' });
        
        // Refresh registration count
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Registration failed' });
      }
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Registration failed'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (!groupFormData.teamName || !groupFormData.teamLeaderName || !groupFormData.teamLeaderEmail || !groupFormData.teamLeaderPhone) {
      setMessage({ type: 'error', text: 'Please fill all team leader fields' });
      setIsSubmitting(false);
      return;
    }

    const validMembers = groupFormData.teamMembers.filter(m => m.name && m.email && m.phone);
    if (validMembers.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one team member' });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = registerTeam({
        eventId: event.id,
        eventTitle: event.title,
        eventCategory: event.category,
        teamName: groupFormData.teamName,
        teamLeaderName: groupFormData.teamLeaderName,
        teamLeaderEmail: groupFormData.teamLeaderEmail,
        teamLeaderPhone: groupFormData.teamLeaderPhone,
        teamMembers: validMembers
      });

      if (result.success) {
        setMessage({
          type: 'success',
          text: `✓ Team registration successful! ${groupFormData.teamName} with ${validMembers.length + 1} members registered.`
        });
        setGroupFormData({
          teamName: '',
          teamLeaderName: userName || '',
          teamLeaderEmail: userEmail || '',
          teamLeaderPhone: '',
          teamMembers: [{ name: '', email: '', phone: '' }]
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Team registration failed' });
      }
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Team registration failed'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background">
        {/* Event Poster Hero Section */}
        {(event as any).imageUrl && (
          <div className="relative w-full h-64 md:h-96 overflow-hidden">
            <img 
              src={(event as any).imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', (event as any).imageUrl);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              onLoad={() => {
                console.log('Poster image loaded successfully');
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="container mx-auto">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-accent/20 text-accent">{event.status}</Badge>
                  {event.difficulty && (
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">{event.difficulty}</Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                  {event.title}
                </h1>
                <p className="text-white/90 text-lg line-clamp-2">{event.description}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        )}

        {/* Header (when no poster) */}
        {!(event as any).imageUrl && (
          <div className="bg-gradient-hero py-8 px-4 border-b border-white/10">
            <div className="container mx-auto">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white hover:text-white/80 transition-colors mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-accent/20 text-accent">{event.status}</Badge>
                {event.difficulty && (
                  <Badge variant="outline">{event.difficulty}</Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {event.title}
              </h1>
              <p className="text-white/80 text-lg">{event.description}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white dark:bg-slate-900 border-border">
                  <CardContent className="pt-6">
                    <Calendar className="w-6 h-6 text-primary mb-2" />
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-semibold text-foreground">{event.date}</p>
                  </CardContent>
                </Card>

                {event.duration && (
                  <Card className="bg-white dark:bg-slate-900 border-border">
                    <CardContent className="pt-6">
                      <Clock className="w-6 h-6 text-accent mb-2" />
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-semibold text-foreground">{event.duration}</p>
                    </CardContent>
                  </Card>
                )}

                {event.isPaid ? (
                  <Card className="bg-white dark:bg-slate-900 border-border border-accent/50">
                    <CardContent className="pt-6">
                      <CreditCard className="w-6 h-6 text-accent mb-2" />
                      <p className="text-xs text-muted-foreground">Fee</p>
                      <p className="font-semibold text-foreground text-accent">₹{event.price}</p>
                    </CardContent>
                  </Card>
                ) : event.prize ? (
                  <Card className="bg-white dark:bg-slate-900 border-border">
                    <CardContent className="pt-6">
                      <Trophy className="w-6 h-6 text-primary mb-2" />
                      <p className="text-xs text-muted-foreground">Prize Pool</p>
                      <p className="font-semibold text-foreground">{event.prize}</p>
                    </CardContent>
                  </Card>
                ) : null}

                <Card className="bg-white dark:bg-slate-900 border-border">
                  <CardContent className="pt-6">
                    <Users className="w-6 h-6 text-accent mb-2" />
                    <p className="text-xs text-muted-foreground">Registered</p>
                    <p className="font-semibold text-foreground">{event.participants || 0}+</p>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card className="bg-white dark:bg-slate-900 border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">About This Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/90">{event.description}</p>
                  
                  {event.isPaid && event.paymentDeadline && (
                    <div className="flex gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
                      <CreditCard className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Deadline</p>
                        <p className="font-semibold text-foreground">{new Date(event.paymentDeadline).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                  )}
                  
                  {event.location && (
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-semibold text-foreground">{event.location}</p>
                      </div>
                    </div>
                  )}

                  {event.capacity && (
                    <div className="flex gap-3">
                      <Users className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="font-semibold text-foreground">{event.capacity} Seats</p>
                      </div>
                    </div>
                  )}

                  {event.registrationFee && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Registration Fee</p>
                      <p className="font-semibold text-foreground">{event.registrationFee}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <Card className="bg-white dark:bg-slate-900 border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Topics Covered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Hackathon Details */}
              {event.category === "Hackathon" && (event.problemStatements || event.judgesCriteria) && (
                <Card className="bg-white dark:bg-slate-900 border-border border-accent/30">
                  <CardHeader>
                    <CardTitle className="text-foreground">Hackathon Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.problemStatements && (
                      <div>
                        <p className="text-sm text-muted-foreground font-semibold mb-2">Problem Statements</p>
                        <p className="text-foreground whitespace-pre-wrap">{event.problemStatements}</p>
                      </div>
                    )}
                    {event.judgesCriteria && (
                      <div>
                        <p className="text-sm text-muted-foreground font-semibold mb-2">Judging Criteria</p>
                        <p className="text-foreground whitespace-pre-wrap">{event.judgesCriteria}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Workshop Details */}
              {event.category === "Workshop" && (event.mentor || event.prerequisites || event.materials) && (
                <Card className="bg-white dark:bg-slate-900 border-border border-accent/30">
                  <CardHeader>
                    <CardTitle className="text-foreground">Workshop Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.mentor && (
                      <div>
                        <p className="text-sm text-muted-foreground">Instructor/Mentor</p>
                        <p className="font-semibold text-foreground">{event.mentor}</p>
                      </div>
                    )}
                    {event.prerequisites && (
                      <div>
                        <p className="text-sm text-muted-foreground font-semibold mb-2">Prerequisites</p>
                        <p className="text-foreground whitespace-pre-wrap">{event.prerequisites}</p>
                      </div>
                    )}
                    {event.materials && (
                      <div>
                        <p className="text-sm text-muted-foreground font-semibold mb-2">Materials Provided</p>
                        <p className="text-foreground whitespace-pre-wrap">{event.materials}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Placement Details */}
              {event.category === "Placement" && (event.company || event.ctc || event.jobProfile) && (
                <Card className="bg-white dark:bg-slate-900 border-border border-accent/30">
                  <CardHeader>
                    <CardTitle className="text-foreground">Placement Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.company && (
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-semibold text-foreground text-lg">{event.company}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {event.ctc && (
                        <div>
                          <p className="text-sm text-muted-foreground">CTC Package</p>
                          <p className="font-semibold text-foreground text-accent">{event.ctc}</p>
                        </div>
                      )}
                      {event.positions && (
                        <div>
                          <p className="text-sm text-muted-foreground">Positions Available</p>
                          <p className="font-semibold text-foreground">{event.positions}</p>
                        </div>
                      )}
                      {event.jobProfile && (
                        <div>
                          <p className="text-sm text-muted-foreground">Job Profile</p>
                          <p className="font-semibold text-foreground">{event.jobProfile}</p>
                        </div>
                      )}
                    </div>
                    {event.eligibility && (
                      <div>
                        <p className="text-sm text-muted-foreground font-semibold mb-2">Eligibility Criteria</p>
                        <p className="text-foreground whitespace-pre-wrap">{event.eligibility}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Organizer Info */}
              {(event.organizer || event.contactEmail) && (
                <Card className="bg-white dark:bg-slate-900 border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.organizer && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Organizer</p>
                        <p className="font-semibold text-foreground">{event.organizer}</p>
                      </div>
                    )}
                    
                    {event.contactEmail && (
                      <div className="flex gap-3">
                        <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <a href={`mailto:${event.contactEmail}`} className="font-semibold text-primary hover:underline">
                            {event.contactEmail}
                          </a>
                        </div>
                      </div>
                    )}

                    {event.contactPhone && (
                      <div className="flex gap-3">
                        <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <a href={`tel:${event.contactPhone}`} className="font-semibold text-foreground hover:text-primary">
                            {event.contactPhone}
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-slate-900 border-border sticky top-20">
                <CardHeader>
                  <CardTitle className="text-foreground">Register Now</CardTitle>
                  <CardDescription>Join {event.participants || 0}+ participants</CardDescription>
                  {event.isPaid && (
                    <div className="mt-3 p-3 bg-accent/10 rounded-lg border border-accent/20 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-accent" />
                      <span className="text-sm font-semibold text-accent">Paid Event • ₹{event.price}</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {event.isPaid ? (
                    // Paid Event - Show Payment Button
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!eventId) {
                          console.error('Event ID is missing');
                          toast({
                            title: "Error",
                            description: "Event ID is missing. Please try again.",
                            variant: "destructive",
                          });
                          return;
                        }
                        if (!isLoggedIn) {
                          toast({
                            title: "Login Required",
                            description: "Please login to proceed with payment.",
                            variant: "destructive",
                          });
                          navigate('/login');
                          return;
                        }
                        console.log('Navigating to checkout for event:', eventId);
                        navigate(`/event/${eventId}/checkout`, { replace: false });
                      }}
                      disabled={userAlreadyRegistered}
                      className="w-full bg-gradient-accent hover:opacity-90 text-white mb-2"
                      size="lg"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      {!isLoggedIn ? 'Login to Pay' : userAlreadyRegistered ? 'Already Registered' : 'Proceed to Payment'}
                    </Button>
                  ) : (
                    <>
                      {isGroupEvent && (
                        <Tabs value={registrationType} onValueChange={(value) => setRegistrationType(value as 'individual' | 'group')} className="mb-4">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="individual">Individual</TabsTrigger>
                            <TabsTrigger value="group">Team</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      )}

                      {registrationType === 'individual' ? (
                        // Individual Registration Form
                        <form onSubmit={handleIndividualSubmit} className="space-y-4">
                          <div>
                            <Label className="text-foreground font-semibold mb-2 block">Full Name *</Label>
                            <Input
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              placeholder="Your name"
                              className="bg-background border-border"
                              required
                              disabled={isSubmitting}
                            />
                          </div>

                          <div>
                            <Label className="text-foreground font-semibold mb-2 block">Email *</Label>
                            <Input
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="your@email.com"
                              className="bg-background border-border"
                              required
                              disabled={isSubmitting}
                            />
                          </div>

                          <div>
                            <Label className="text-foreground font-semibold mb-2 block">Phone Number *</Label>
                            <Input
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+91 XXXXX XXXXX"
                              className="bg-background border-border"
                              required
                              disabled={isSubmitting}
                            />
                          </div>

                          {message && (
                            <div className={`flex items-center gap-2 p-3 rounded-lg ${
                              message.type === 'success'
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {message.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                              ) : (
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                              )}
                              <span className="text-sm">{message.text}</span>
                            </div>
                          )}

                          {userAlreadyRegistered && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              <CheckCircle className="w-5 h-5 flex-shrink-0" />
                              <span className="text-sm">You are already registered!</span>
                            </div>
                          )}

                          <Button
                            type="submit"
                            disabled={isSubmitting || userAlreadyRegistered}
                            className="w-full bg-gradient-accent hover:opacity-90 text-white"
                          >
                            {isSubmitting ? 'Registering...' : userAlreadyRegistered ? 'Already Registered' : 'Register Now'}
                          </Button>

                          <p className="text-xs text-muted-foreground text-center">
                            You will receive a confirmation email after registration.
                          </p>
                        </form>
                      ) : (
                        // Group Registration Form
                        <form onSubmit={handleGroupSubmit} className="space-y-4 max-h-96 overflow-y-auto">
                          <div className="space-y-2 border-b border-border pb-4">
                            <h3 className="font-semibold text-foreground">Team Information</h3>
                            <div>
                              <Label className="text-foreground text-sm mb-1 block">Team Name *</Label>
                              <Input
                                name="teamName"
                                value={groupFormData.teamName}
                                onChange={handleGroupInputChange}
                                placeholder="e.g., Tech Titans"
                                className="bg-background border-border text-sm"
                                required
                                disabled={isSubmitting}
                              />
                            </div>
                          </div>

                          <div className="space-y-2 border-b border-border pb-4">
                            <h3 className="font-semibold text-foreground">Team Leader</h3>
                            <div>
                              <Label className="text-foreground text-sm mb-1 block">Name *</Label>
                              <Input
                                name="teamLeaderName"
                                value={groupFormData.teamLeaderName}
                                onChange={handleGroupInputChange}
                                placeholder="Leader name"
                                className="bg-background border-border text-sm"
                                required
                                disabled={isSubmitting}
                              />
                            </div>
                            <div>
                              <Label className="text-foreground text-sm mb-1 block">Email *</Label>
                              <Input
                                name="teamLeaderEmail"
                                type="email"
                                value={groupFormData.teamLeaderEmail}
                                onChange={handleGroupInputChange}
                                placeholder="leader@email.com"
                                className="bg-background border-border text-sm"
                                required
                                disabled={isSubmitting}
                              />
                            </div>
                            <div>
                              <Label className="text-foreground text-sm mb-1 block">Phone *</Label>
                              <Input
                                name="teamLeaderPhone"
                                value={groupFormData.teamLeaderPhone}
                                onChange={handleGroupInputChange}
                                placeholder="+91 XXXXX XXXXX"
                                className="bg-background border-border text-sm"
                                required
                                disabled={isSubmitting}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-foreground">Team Members</h3>
                              <Button
                                type="button"
                                onClick={addTeamMember}
                                size="sm"
                                variant="outline"
                                className="h-7 gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                Add Member
                              </Button>
                            </div>

                            {groupFormData.teamMembers.map((member, index) => (
                              <div key={index} className="p-3 bg-secondary rounded-lg space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-semibold text-muted-foreground">Member {index + 1}</span>
                                  {groupFormData.teamMembers.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeTeamMember(index)}
                                      className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                      title="Remove member"
                                      aria-label="Remove team member"
                                    >
                                      <Trash2 className="w-3 h-3 text-red-500" />
                                    </button>
                                  )}
                                </div>
                                <Input
                                  value={member.name}
                                  onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                                  placeholder="Name"
                                  className="bg-background border-border text-sm"
                                />
                                <Input
                                  type="email"
                                  value={member.email}
                                  onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                                  placeholder="Email"
                                  className="bg-background border-border text-sm"
                                />
                                <Input
                                  value={member.phone}
                                  onChange={(e) => handleTeamMemberChange(index, 'phone', e.target.value)}
                                  placeholder="Phone"
                                  className="bg-background border-border text-sm"
                                />
                              </div>
                            ))}
                          </div>

                          {message && (
                            <div className={`flex items-center gap-2 p-3 rounded-lg ${
                              message.type === 'success'
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {message.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                              ) : (
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                              )}
                              <span className="text-xs">{message.text}</span>
                            </div>
                          )}

                          {teamAlreadyRegistered && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              <CheckCircle className="w-5 h-5 flex-shrink-0" />
                              <span className="text-xs">Your team is already registered!</span>
                            </div>
                          )}

                          <Button
                            type="submit"
                            disabled={isSubmitting || teamAlreadyRegistered}
                            className="w-full bg-gradient-accent hover:opacity-90 text-white"
                          >
                            {isSubmitting ? 'Registering Team...' : teamAlreadyRegistered ? 'Already Registered' : 'Register Team'}
                          </Button>

                          <p className="text-xs text-muted-foreground text-center">
                            Team leader will receive confirmation email.
                          </p>
                        </form>
                      )}
                    </>
                  )}
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

export default EventDetails;
