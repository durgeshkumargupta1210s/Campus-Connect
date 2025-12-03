import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Event {
  title: string;
  date: string;
  location: string;
  attendees: number;
  category: string;
  imageColor: string;
}

const EventsSection = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/events', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          let backendEvents: any[] = [];
          
          if (Array.isArray(data)) {
            backendEvents = data;
          } else if (data.events && Array.isArray(data.events)) {
            backendEvents = data.events;
          } else if (data.data && Array.isArray(data.data)) {
            backendEvents = data.data;
          }
          
          // Convert backend events to display format, take first 3
          const convertedEvents: Event[] = backendEvents.slice(0, 3).map((event: any) => ({
            title: event.title,
            date: event.date ? new Date(event.date).toLocaleDateString() : '',
            location: event.location || 'TBA',
            attendees: event.registeredCount || 0,
            category: event.category || 'Event',
            imageColor: getCategoryColor(event.category)
          }));
          
          setEvents(convertedEvents);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const getCategoryColor = (category: string): string => {
    const colorMap: { [key: string]: string } = {
      'hackathon': 'bg-gradient-to-br from-accent to-accent/70',
      'workshop': 'bg-gradient-to-br from-primary to-primary/70',
      'placement': 'bg-gradient-to-br from-primary to-accent',
      'seminar': 'bg-gradient-to-br from-primary/50 to-accent/50',
      'cultural': 'bg-gradient-to-br from-accent/50 to-primary/50',
      'sports': 'bg-gradient-to-br from-green-500 to-green-600',
      'technical': 'bg-gradient-to-br from-blue-500 to-blue-600'
    };
    return colorMap[category?.toLowerCase()] || 'bg-gradient-to-br from-primary to-primary/70';
  };
  
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-muted-foreground">
              Don't miss out on exciting campus activities
            </p>
          </div>
          <Button variant="outline" className="hidden md:block" onClick={() => navigate("/events")}>
            View All Events
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/events")}>
                View All Events
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
