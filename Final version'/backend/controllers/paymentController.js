import Payment from '../models/Payment.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import Registration from '../models/Registration.js';
import { sendRegistrationConfirmation } from '../utils/emailService.js';
import { v4 as uuidv4 } from 'uuid';

export const createPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, description, relatedTo, relatedId } = req.body;

    const payment = await Payment.create({
      user: req.user._id,
      transactionId: `TXN-${uuidv4()}`,
      amount,
      paymentMethod,
      description,
      relatedTo,
      relatedId,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Payment initiated',
      payment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const { status, page = 1, limit = 100 } = req.query;
    
    // Admin can see all payments, regular users see only their own
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate('user', 'name email')
      .populate({
        path: 'relatedId',
        select: 'title',
        model: 'Event'
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await Payment.countDocuments(filter);

    res.json({
      payments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const completePayment = async (req, res) => {
  try {
    const { transactionId } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        paidAt: Date.now(),
        'gateway.gatewayTransactionId': transactionId
      },
      { new: true }
    ).populate('user').populate('relatedId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // If payment is for event registration or ticket, send confirmation email
    if (payment.relatedTo === 'registration' || payment.relatedTo === 'ticket') {
      let event;
      let registration = null;
      
      if (payment.relatedId) {
        // Try to get event from registration or directly
        if (payment.relatedTo === 'registration') {
          registration = await Registration.findById(payment.relatedId).populate('event');
          if (registration && registration.event) {
            event = registration.event;
          }
        } else {
          // If it's a ticket, the relatedId is the event ID
          event = await Event.findById(payment.relatedId);
          // Also try to find registration for this event and user
          if (event && payment.user) {
            registration = await Registration.findOne({
              event: event._id,
              user: payment.user._id
            });
          }
        }
      }

      if (event && payment.user) {
        const eventDate = event.date ? new Date(event.date).toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'TBA';

        // Determine if it's a workshop
        const isWorkshop = event.category === 'workshop';
        
        // Send confirmation email for paid events or workshops
        await sendRegistrationConfirmation(
          payment.user.email,
          payment.user.name,
          event.title,
          eventDate,
          event.location || 'TBA',
          true, // isPaid (since payment was completed)
          payment.amount
        );
      }
    }

    res.json({
      message: 'Payment completed successfully',
      payment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'refunded',
        refundedAt: Date.now()
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      message: 'Payment refunded successfully',
      payment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
