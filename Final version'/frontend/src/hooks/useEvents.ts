import { useState, useEffect, useCallback } from 'react';
import { eventService, Event } from '@/services/eventService';
import { APIClient, API_ENDPOINTS } from '@/config/api';

export const useEvents = (category?: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      // Try to load from backend API first
      const data = await APIClient.get<{ events?: any[] } | any[]>(API_ENDPOINTS.EVENTS_LIST);
      
      let backendEvents: any[] = [];
      
      // Handle different response structures
      if (Array.isArray(data)) {
        backendEvents = data;
      } else if (data.events && Array.isArray(data.events)) {
        backendEvents = data.events;
      } else if (data.data && Array.isArray(data.data)) {
        backendEvents = data.data;
      }
      
      // Convert backend format to frontend format
      const convertedEvents = backendEvents.map((event: any) => ({
        id: event._id || event.id,
        title: event.title,
        date: event.date ? new Date(event.date).toLocaleDateString() : '',
        time: event.time,
        location: event.location,
        description: event.description,
        category: event.category,
        duration: event.duration,
        status: event.status || 'upcoming',
        capacity: event.capacity,
        tags: event.tags || [],
        participants: event.registeredCount || 0,
        difficulty: 'All Levels',
        prize: '₹0',
        imageUrl: event.imageUrl || null // Include imageUrl for poster display
      }));
      
      // Filter by category if provided
      if (category) {
        const filtered = convertedEvents.filter(e => 
          e.category.toLowerCase() === category.toLowerCase()
        );
        setEvents(filtered);
      } else {
        setEvents(convertedEvents);
      }
      } catch (error) {
        console.error('Error loading events:', error);
        // No fallback - show empty state
        setEvents([]);
      } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent = eventService.addEvent(eventData);
    
    // Update local state
    if (category && newEvent.category.toLowerCase() === category.toLowerCase()) {
      setEvents([...events, newEvent]);
    } else if (!category) {
      setEvents([...events, newEvent]);
    }
    
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    const updated = eventService.updateEvent(id, updates);
    if (updated) {
      setEvents(events.map(e => e.id === id ? updated : e));
    }
    return updated;
  };

  const deleteEvent = (id: string) => {
    const success = eventService.deleteEvent(id);
    if (success) {
      setEvents(events.filter(e => e.id !== id));
    }
    return success;
  };

  const refreshEvents = useCallback(async () => {
    // Reload from backend instead of localStorage
    await loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents
  };
};
