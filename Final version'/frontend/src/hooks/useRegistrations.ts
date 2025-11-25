import { useState, useCallback } from 'react';
import { registrationService, Registration } from '@/services/registrationService';

export const useRegistrations = (eventId?: string) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRegistrations = useCallback(() => {
    registrationService.initialize();
    
    if (eventId) {
      setRegistrations(registrationService.getEventRegistrations(eventId));
    } else {
      setRegistrations(registrationService.getAllRegistrations());
    }
  }, [eventId]);

  const register = useCallback(
    (data: {
      eventId: string;
      eventTitle: string;
      eventCategory: string;
      userName: string;
      userEmail: string;
      userPhone: string;
    }) => {
      try {
        setError(null);
        setLoading(true);

        const newRegistration = registrationService.registerForEvent(data);
        setRegistrations([...registrations, newRegistration]);

        console.log('Registration successful:', newRegistration);
        return { success: true, registration: newRegistration };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [registrations]
  );

  const cancelRegistration = useCallback((registrationId: string) => {
    const success = registrationService.cancelRegistration(registrationId);
    if (success) {
      setRegistrations(
        registrations.map(r =>
          r.id === registrationId ? { ...r, status: 'Cancelled' } : r
        )
      );
    }
    return success;
  }, [registrations]);

  const isRegistered = useCallback(
    (email: string): boolean => {
      if (!eventId) return false;
      return registrationService.isUserRegistered(eventId, email);
    },
    [eventId]
  );

  return {
    registrations,
    loading,
    error,
    loadRegistrations,
    register,
    cancelRegistration,
    isRegistered,
    getEventRegistrationCount: (id: string) =>
      registrationService.getEventRegistrationCount(id)
  };
};
