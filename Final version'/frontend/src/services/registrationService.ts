// Registration Service
// Manages user registrations for events

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventCategory: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  registeredAt: Date;
  status: "Confirmed" | "Pending" | "Cancelled";
}

const REGISTRATIONS_KEY = 'campus_connect_registrations';

export const registrationService = {
  // Initialize service
  initialize: () => {
    const stored = localStorage.getItem(REGISTRATIONS_KEY);
    if (!stored) {
      localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify([]));
    }
  },

  // Register user for event
  registerForEvent: (data: {
    eventId: string;
    eventTitle: string;
    eventCategory: string;
    userName: string;
    userEmail: string;
    userPhone: string;
  }): Registration => {
    const registrations = registrationService.getAllRegistrations();

    // Check if already registered
    const alreadyRegistered = registrations.some(
      r => r.eventId === data.eventId && r.userEmail === data.userEmail
    );

    if (alreadyRegistered) {
      throw new Error('You are already registered for this event');
    }

    const newRegistration: Registration = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      registeredAt: new Date(),
      status: "Confirmed"
    };

    registrations.push(newRegistration);
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));

    console.log(`✅ Registration successful: ${data.userName} for ${data.eventTitle}`);
    return newRegistration;
  },

  // Get all registrations
  getAllRegistrations: (): Registration[] => {
    const stored = localStorage.getItem(REGISTRATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Get registrations for specific event
  getEventRegistrations: (eventId: string): Registration[] => {
    const allRegistrations = registrationService.getAllRegistrations();
    return allRegistrations.filter(reg => reg.eventId === eventId);
  },

  // Get user's registrations
  getUserRegistrations: (email: string): Registration[] => {
    const allRegistrations = registrationService.getAllRegistrations();
    return allRegistrations.filter(reg => reg.userEmail === email);
  },

  // Get registration count for event
  getEventRegistrationCount: (eventId: string): number => {
    return registrationService.getEventRegistrations(eventId).length;
  },

  // Cancel registration
  cancelRegistration: (registrationId: string): boolean => {
    const registrations = registrationService.getAllRegistrations();
    const index = registrations.findIndex(reg => reg.id === registrationId);

    if (index === -1) return false;

    registrations[index].status = "Cancelled";
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));

    console.log(`✅ Registration cancelled: ${registrationId}`);
    return true;
  },

  // Check if user already registered
  isUserRegistered: (eventId: string, email: string): boolean => {
    const registrations = registrationService.getAllRegistrations();
    return registrations.some(
      r => r.eventId === eventId && r.userEmail === email
    );
  },

  // Clear all registrations (for testing)
  clearAll: () => {
    localStorage.removeItem(REGISTRATIONS_KEY);
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify([]));
    console.log("✅ All registrations cleared");
  }
};
