import { useCallback } from 'react';
import { emailService } from '@/services/emailService';

interface EventData {
  id?: string;
  name: string;
  date: string;
  description: string;
  category?: string;
}

export const useEventNotifications = () => {
  const notifyNewEvent = useCallback(async (eventData: EventData) => {
    try {
      const result = await emailService.notifyEventCreated({
        name: eventData.name,
        date: eventData.date,
        description: eventData.description
      });

      if (result.success) {
        console.log(`✅ Event notification sent to ${result.count} subscribers`);
        return { success: true, count: result.count };
      } else {
        console.log('No subscribers to notify');
        return { success: true, count: 0 };
      }
    } catch (error) {
      console.error('Error notifying subscribers:', error);
      return { success: false, count: 0 };
    }
  }, []);

  return { notifyNewEvent };
};
