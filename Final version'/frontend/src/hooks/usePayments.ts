import { useState, useCallback } from 'react';
import { Payment } from '@/services/paymentService';
import { APIClient, API_ENDPOINTS } from '@/config/api';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await APIClient.get<{ payments?: any[] } | any[]>(API_ENDPOINTS.PAYMENTS_LIST);
      const paymentsList = Array.isArray(data) ? data : (data.payments || []);
      
      // Map backend payment format to frontend format
      const mappedPayments: Payment[] = paymentsList.map((p: any) => ({
        id: p._id || p.id,
        userId: p.user?._id || p.user || '',
        userEmail: p.user?.email || p.userEmail || '',
        userName: p.user?.name || p.userName || '',
        eventId: p.relatedId?._id || p.relatedId || '',
        eventTitle: p.relatedId?.title || p.description || 'Event',
        amount: p.amount || 0,
        currency: p.currency || 'INR',
        paymentMethod: p.paymentMethod === 'credit_card' || p.paymentMethod === 'debit_card' ? 'card' :
                      p.paymentMethod === 'net_banking' ? 'netbanking' : p.paymentMethod || 'card',
        status: p.status || 'pending',
        transactionId: p.transactionId || '',
        paymentDate: p.paidAt || p.createdAt || new Date().toISOString(),
        createdAt: p.createdAt || new Date().toISOString()
      }));
      
      setPayments(mappedPayments);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load payments';
      setError(errorMsg);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentsByEventId = useCallback((eventId: string) => {
    return payments.filter(p => (p as any).eventId === eventId);
  }, [payments]);

  const getPaymentsByUserId = useCallback((userId: string) => {
    return payments.filter(p => (p as any).userId === userId);
  }, [payments]);

  const createPayment = useCallback(async (paymentData: any) => {
    try {
      setError(null);
      setLoading(true);
      
      // Map frontend payment data to backend format
      const backendPaymentData = {
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod === 'card' ? 'credit_card' : 
                      paymentData.paymentMethod === 'upi' ? 'upi' : 
                      paymentData.paymentMethod === 'netbanking' ? 'net_banking' : 'credit_card',
        description: `Payment for ${paymentData.eventTitle || 'event'}`,
        relatedTo: 'ticket', // Payment is for event ticket
        relatedId: paymentData.eventId
      };
      
      const newPayment = await APIClient.post(API_ENDPOINTS.PAYMENTS_CREATE, backendPaymentData);
      
      // Complete the payment immediately (for simulated payments)
      if (paymentData.status === 'completed') {
        await APIClient.put(API_ENDPOINTS.PAYMENTS_COMPLETE(newPayment.payment._id || newPayment.payment.id), {
          transactionId: newPayment.payment.transactionId
        });
      }
      
      return { success: true, data: newPayment.payment || newPayment };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create payment';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePaymentStatus = useCallback(async (id: string, status: 'pending' | 'completed' | 'failed', transactionId?: string) => {
    try {
      setError(null);
      setLoading(true);
      
      if (status === 'completed') {
        await APIClient.put(API_ENDPOINTS.PAYMENTS_COMPLETE(id), {
          transactionId: transactionId || `TXN-${Date.now()}`
        });
      } else if (status === 'failed') {
        // You might need to add a failed endpoint or use refund endpoint
        await APIClient.put(API_ENDPOINTS.PAYMENTS_REFUND(id), {});
      }
      
      // Reload payments to get updated data
      await loadPayments();
      
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update payment';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [loadPayments]);

  const getEventRevenue = useCallback((eventId: string) => {
    return paymentService.getEventRevenue(eventId);
  }, []);

  const getCompletedPayments = useCallback(() => {
    return paymentService.getCompletedPayments();
  }, []);

  const deletePayment = useCallback(async (id: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // Use refund endpoint to delete/cancel payment
      await APIClient.delete(API_ENDPOINTS.PAYMENTS_REFUND(id));
      
      // Reload payments
      await loadPayments();
      
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete payment';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [loadPayments]);

  return {
    payments,
    loading,
    error,
    loadPayments,
    getPaymentsByEventId,
    getPaymentsByUserId,
    createPayment,
    updatePaymentStatus,
    getEventRevenue,
    getCompletedPayments,
    deletePayment,
  };
};
