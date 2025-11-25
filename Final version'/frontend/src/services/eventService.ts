// Event Management Service
// Stores and retrieves events by category
// Uses localStorage for persistence

export interface Event {
  id: string;
  title: string;
  eventName?: string;
  date: string;
  time?: string;
  endTime?: string;
  location?: string;
  description: string;
  category: string;
  duration?: string;
  prize?: string;
  difficulty?: string;
  participants?: number;
  tags: string[];
  status: string;
  capacity?: number;
  registrationFee?: string;
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: Date;
  // Payment fields
  isPaid?: boolean;
  price?: number; // Price in rupees
  paymentDeadline?: string;
  paymentMethods?: string[]; // ['card', 'upi', 'netbanking']
  // Hackathon specific
  problemStatements?: string;
  judgesCriteria?: string;
  // Workshop specific
  mentor?: string;
  prerequisites?: string;
  materials?: string;
  // Placement specific
  company?: string;
  ctc?: string;
  positions?: number;
  jobProfile?: string;
  eligibility?: string;
}

const EVENTS_KEY = 'campus_connect_events';

// Removed DEFAULT_EVENTS - all data now comes from backend API
// This service is kept for type definitions and interface compatibility
// but actual data operations should use backend API

export const eventService = {
  // Deprecated: No longer initializes localStorage
  // Use backend API instead
  initialize: () => {
    console.warn('eventService.initialize() is deprecated. Use backend API instead.');
  },

  // Deprecated: No longer returns localStorage data
  // Use backend API instead
  getAllEvents: (): Event[] => {
    console.warn('eventService.getAllEvents() is deprecated. Use backend API instead.');
    return [];
  },

  // Deprecated: Use backend API instead
  getEventsByCategory: (category: string): Event[] => {
    console.warn('eventService.getEventsByCategory() is deprecated. Use backend API instead.');
    return [];
  },

  // Deprecated: Use backend API instead
  getEventById: (id: string): Event | undefined => {
    console.warn('eventService.getEventById() is deprecated. Use backend API instead.');
    return undefined;
  },

  // Deprecated: Use backend API instead
  addEvent: (eventData: Omit<Event, 'id' | 'createdAt'>): Event => {
    console.warn('eventService.addEvent() is deprecated. Use backend API instead.');
    return {} as Event;
  },

  // Deprecated: Use backend API instead
  updateEvent: (id: string, updates: Partial<Event>): Event | null => {
    console.warn('eventService.updateEvent() is deprecated. Use backend API instead.');
    return null;
  },

  // Deprecated: Use backend API instead
  deleteEvent: (id: string): boolean => {
    console.warn('eventService.deleteEvent() is deprecated. Use backend API instead.');
    return false;
  },

  // Deprecated: Use backend API instead
  getEventCountByCategory: (category: string): number => {
    console.warn('eventService.getEventCountByCategory() is deprecated. Use backend API instead.');
    return 0;
  },

  // Deprecated: Use backend API instead
  getCategoriesWithCounts: (): { category: string; count: number }[] => {
    console.warn('eventService.getCategoriesWithCounts() is deprecated. Use backend API instead.');
    return [];
  },

  // Deprecated: Use backend API instead
  clearAll: () => {
    console.warn('eventService.clearAll() is deprecated. Use backend API instead.');
  }
};
