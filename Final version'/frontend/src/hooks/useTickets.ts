import { useState, useCallback } from 'react';
import { Ticket, ticketService } from '@/services/ticketService';
import { emailService } from '@/services/emailService';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>(() => ticketService.getAllTickets());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Load all tickets
  const loadTickets = useCallback(() => {
    try {
      setLoading(true);
      const allTickets = ticketService.getAllTickets();
      setTickets(allTickets);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's tickets
  const getMyTickets = useCallback((userId: string) => {
    try {
      return ticketService.getTicketsByUserId(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
      return [];
    }
  }, []);

  // Get active tickets for user
  const getActiveTickets = useCallback((userId: string) => {
    try {
      return ticketService.getActiveTickets(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch active tickets');
      return [];
    }
  }, []);

  // Get event tickets
  const getEventTickets = useCallback((eventId: string) => {
    try {
      return ticketService.getTicketsByEventId(eventId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event tickets');
      return [];
    }
  }, []);

  // Create ticket and send confirmation email
  const createTicket = useCallback(async (
    eventId: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string,
    userId: string,
    userEmail: string,
    userName: string,
    registrationId: string,
    paymentId: string,
    qrCodeDataUrl?: string,
    eventStartTime?: string,
    seat?: string,
    tier?: string
  ) => {
    try {
      setLoading(true);
      setError('');

      // Create ticket
      const ticketResult = ticketService.createTicket({
        eventId,
        eventTitle,
        eventDate,
        eventLocation,
        userId,
        userEmail,
        userName,
        registrationId,
        paymentId,
        qrCode: qrCodeDataUrl || '',
        status: 'active',
        eventStartTime,
        seat,
        tier,
      });

      if (!ticketResult.success || !ticketResult.data) {
        return {
          success: false,
          error: ticketResult.error || 'Failed to create ticket'
        };
      }

      const ticket = ticketResult.data;

      // Send confirmation email with QR code
      const emailResult = await emailService.sendTicketConfirmationEmail(
        userEmail,
        userName,
        eventTitle,
        eventDate,
        eventLocation,
        ticket.ticketNumber,
        ticket.verificationCode,
        qrCodeDataUrl
      );

      if (!emailResult.success) {
        console.warn('Email sending failed but ticket was created:', emailResult.error);
        // Don't fail ticket creation if email fails
      }

      // Update state
      loadTickets();

      return {
        success: true,
        data: ticket,
        emailSent: emailResult.success
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create ticket';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [loadTickets]);

  // Update ticket status
  const updateTicketStatus = useCallback((
    ticketId: string,
    status: 'active' | 'used' | 'cancelled'
  ) => {
    try {
      const result = ticketService.updateTicketStatus(ticketId, status);
      if (result.success) {
        loadTickets();
        return { success: true };
      }
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update ticket';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [loadTickets]);

  // Verify ticket
  const verifyTicket = useCallback((ticketId: string, verificationCode: string) => {
    try {
      const result = ticketService.verifyTicket(ticketId, verificationCode);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Delete ticket
  const deleteTicket = useCallback((ticketId: string) => {
    try {
      const result = ticketService.deleteTicket(ticketId);
      if (result.success) {
        loadTickets();
      }
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete ticket';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [loadTickets]);

  // Check if user has ticket for event
  const hasTicketForEvent = useCallback((userId: string, eventId: string) => {
    return ticketService.hasTicketForEvent(userId, eventId);
  }, []);

  // Get event stats
  const getEventStats = useCallback((eventId: string) => {
    return ticketService.getEventTicketStats(eventId);
  }, []);

  return {
    tickets,
    loading,
    error,
    loadTickets,
    getMyTickets,
    getActiveTickets,
    getEventTickets,
    createTicket,
    updateTicketStatus,
    verifyTicket,
    deleteTicket,
    hasTicketForEvent,
    getEventStats,
  };
};
