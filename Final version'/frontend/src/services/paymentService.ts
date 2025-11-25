export interface Payment {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'upi' | 'netbanking';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  paymentDate: string;
  registrationId?: string;
}

const PAYMENTS_KEY = 'campus_connect_payments';

export const paymentService = {
  initialize: () => {
    if (!localStorage.getItem(PAYMENTS_KEY)) {
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify([]));
    }
  },

  getAllPayments: (): Payment[] => {
    paymentService.initialize();
    const data = localStorage.getItem(PAYMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getPaymentsByEventId: (eventId: string): Payment[] => {
    const payments = paymentService.getAllPayments();
    return payments.filter(p => p.eventId === eventId);
  },

  getPaymentsByUserId: (userId: string): Payment[] => {
    const payments = paymentService.getAllPayments();
    return payments.filter(p => p.userId === userId);
  },

  getPaymentById: (id: string): Payment | null => {
    const payments = paymentService.getAllPayments();
    return payments.find(p => p.id === id) || null;
  },

  createPayment: (paymentData: Omit<Payment, 'id' | 'paymentDate' | 'status' | 'transactionId'>): Payment => {
    const payments = paymentService.getAllPayments();
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      paymentDate: new Date().toISOString(),
      status: 'pending',
      transactionId: `TXN-${Date.now()}`,
    };
    payments.push(newPayment);
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    return newPayment;
  },

  updatePaymentStatus: (id: string, status: 'pending' | 'completed' | 'failed', transactionId?: string): Payment | null => {
    const payments = paymentService.getAllPayments();
    const payment = payments.find(p => p.id === id);
    if (!payment) return null;
    
    payment.status = status;
    if (transactionId) payment.transactionId = transactionId;
    
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    return payment;
  },

  getEventRevenue: (eventId: string): number => {
    const payments = paymentService.getPaymentsByEventId(eventId);
    return payments
      .filter(p => p.status === 'completed')
      .reduce((total, p) => total + p.amount, 0);
  },

  getCompletedPayments: (): Payment[] => {
    const payments = paymentService.getAllPayments();
    return payments.filter(p => p.status === 'completed');
  },

  deletePayment: (id: string): boolean => {
    const payments = paymentService.getAllPayments();
    const filtered = payments.filter(p => p.id !== id);
    if (filtered.length === payments.length) return false;
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(filtered));
    return true;
  },
};
