# Payment & Registration Flow Documentation

## Overview
Complete integrated system for event payment, registration, ticket generation, and email notifications.

## User Journey

### 1. Event Discovery & Details
**Page**: `/events` or `/hackathons` or `/workshops`
- User browses available events
- Clicks on a paid event card to view details

### 2. Event Details Page
**Route**: `/events/:eventId` (or `/hackathons/:eventId` / `/workshops/:eventId`)
**Component**: `EventDetails.tsx`

**Features:**
- Display event information (date, location, duration, price, capacity, etc.)
- Show event status (ongoing, completed, etc.)
- Display participant count
- **For Free Events**: Show registration form with individual/team options
- **For Paid Events**: Show payment button instead of registration form

**Paid Event Display:**
```
- Event fee badge showing ₹{price}
- "Proceed to Payment" button (CTA)
- Button disabled if user already registered
```

### 3. Payment Checkout Page
**Route**: `/event/:eventId/checkout`
**Component**: `PaymentCheckout.tsx`

**User Input:**
1. Full Name (pre-filled from auth context)
2. Email (pre-filled from auth context)
3. Phone Number
4. Payment Method Selection:
   - Credit/Debit Card
   - UPI (Google Pay, PhonePe, etc.)
   - Net Banking

**Order Summary (Right Panel):**
- Event name
- Event fee
- Processing fee (₹0)
- Total amount
- Payment deadline (if applicable)
- Security badge "Secure Payment Gateway"

**On Payment Submission:**
1. Form validation (all fields required)
2. Create payment record → Payment ID generated
3. Create registration in admin system
4. Create ticket with:
   - Unique ticket number (format: CCH-EVT-{timestamp})
   - Verification code (6-digit alphanumeric)
   - QR code value: `{ticketId}|{verificationCode}`
5. Send two emails:
   - **Ticket Confirmation Email** with QR code
   - **Registration Confirmation Email** with event details
6. Redirect to success page (after 2 seconds)

### 4. Payment Success Page
**Route**: `/event/:eventId/payment-success`
**Component**: `PaymentSuccess.tsx`

**Displays:**
- Confirmation message
- Ticket preview:
  - Ticket number
  - Verification code
  - QR code section
  - Entry instructions
- Quick links:
  - "View My Tickets" → `/my-tickets`
  - "Browse More Events" → `/events`

### 5. My Tickets Page
**Route**: `/my-tickets`
**Component**: `MyTickets.tsx`

**Features:**
- List all user's tickets
- Filter by status: All, Active, Used, Cancelled
- For each ticket, display:
  - Event name and details
  - Ticket number
  - Verification code (with copy button)
  - QR code (canvas-based, generated from ticket ID + verification code)
  - Status badge
  - Download PDF button
  - Action buttons:
    - Mark as used (for active tickets)
    - Cancel ticket (with confirmation)
    - View event details

**PDF Download:**
- Uses html2canvas to capture ticket display
- Converts to PDF using jsPDF
- Saves as `{eventTitle}-ticket-{ticketNumber}.pdf`

### 6. Admin Dashboard
**Route**: `/admin` or `/admin/dashboard`
**Component**: `AdminDashboard.tsx`

**Registrations Tab Shows:**
- All event registrations
- User details (name, email, phone)
- Event details (title, date, category)
- Registration status
- Payment status (if paid event)
- Registration date

**Analytics:**
- Total registrations count
- Registrations per event
- Payment tracking (completed, pending, failed)
- Revenue generated per paid event

---

## Data Models

### Payment Record
```typescript
{
  id: string;              // pay-{timestamp}
  eventId: string;
  eventTitle: string;
  userId: string;          // User email
  userEmail: string;
  userName: string;
  amount: number;          // Event fee in INR
  currency: string;        // 'INR'
  paymentMethod: 'card' | 'upi' | 'netbanking';
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;   // TXN-{timestamp}
  paymentDate: string;     // ISO timestamp
  registrationId?: string; // Link to registration
}
```

### Registration Record
```typescript
{
  id: string;
  eventId: string;
  eventTitle: string;
  eventCategory: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  registrationDate: string;    // ISO timestamp
  status: 'registered';
  paymentId?: string;          // Link to payment
  paymentStatus?: 'completed' | 'pending' | 'failed';
}
```

### Ticket Record
```typescript
{
  id: string;              // ticket_{uuid}
  ticketNumber: string;    // CCH-{category}-{autoIncrement}
  eventId: string;
  eventTitle: string;
  userId: string;          // User email
  userEmail: string;
  userName: string;
  eventDate: string;
  eventLocation: string;
  eventTime?: string;
  verificationCode: string; // 6-char alphanumeric
  qrCodeValue: string;     // {ticketId}|{verificationCode}
  paymentId?: string;      // Link to payment
  registrationId?: string; // Link to registration
  status: 'active' | 'used' | 'cancelled';
  createdAt: string;       // ISO timestamp
  usedAt?: string;         // When marked as used
}
```

---

## Email Templates

### 1. Ticket Confirmation Email
**Subject**: `Your Event Ticket Confirmation - {EventTitle}`

**Contains:**
- Greeting with user name
- Event details (title, date, location, ticket number)
- QR code as embedded image
- Verification code (large, monospace font)
- Entry instructions:
  - Arrive 15 minutes early
  - Show email at entry
  - Staff will verify code
- Support contact information
- Footer with company info

**Sent By**: `emailService.sendTicketConfirmationEmail()`
**Triggered**: When payment is completed

### 2. Registration Confirmation Email
**Subject**: `Registration Confirmed - {EventTitle}`

**Contains:**
- Greeting with user name
- Event details (title, date)
- Confirmation of registration
- Note about upcoming ticket email
- Support contact information

**Sent By**: `emailService.sendRegistrationConfirmation()`
**Triggered**: When payment is completed (separate from ticket email)

---

## Storage & Persistence

### localStorage Keys
- `campus_connect_payments` - All payments
- `campus_connect_registrations` - Event registrations
- `campus_connect_tickets` - All user tickets
- `campus_connect_email_logs` - Email history (last 50)

### Data Flow
1. User initiates payment → Payment record created
2. Payment completed → Registration + Ticket created
3. Ticket created → Confirmation emails sent
4. Admin views dashboard → Reads from registrations storage
5. User views My Tickets → Reads from tickets storage

---

## Key Services

### paymentService
- `createPayment()` - Create new payment record
- `getPaymentsByEventId()` - Get payments for specific event
- `getPaymentsByUserId()` - Get user's payments
- `updatePaymentStatus()` - Update payment status
- `getEventRevenue()` - Calculate event revenue

### registrationService
- `addRegistration()` - Add new registration
- `getRegistrationsByEventId()` - Get event registrations
- `getRegistrationsByUserId()` - Get user's registrations
- `getEventRegistrationCount()` - Count registrations

### ticketService
- `createTicket()` - Create new ticket with QR code
- `getTicketsByUserId()` - Get user's tickets
- `verifyTicket()` - Verify ticket with verification code
- `updateTicketStatus()` - Mark as used/cancelled
- `hasTicketForEvent()` - Check if user has ticket

### emailService
- `sendTicketConfirmationEmail()` - Send QR ticket email
- `sendRegistrationConfirmation()` - Send registration email
- `sendThankYouEmail()` - Send subscription confirmation
- `notifyEventCreated()` - Notify all subscribers of new event

---

## Integration Points

### EventDetails Component
```tsx
// For paid events
<Button onClick={() => navigate(`/event/${eventId}/checkout`)}>
  Proceed to Payment
</Button>

// For free events
// Show registration form with individual/team options
```

### PaymentCheckout Component
```tsx
// Flow:
1. User submits payment form
2. createPayment() → Payment ID
3. registrationService.addRegistration() → Registration created
4. createTicket() → Ticket with QR code
5. emailService.sendTicketConfirmationEmail() → QR email
6. emailService.sendRegistrationConfirmation() → Confirmation email
7. Navigate to success page
```

### AdminDashboard Component
```tsx
// On load:
1. Initialize registrationService
2. Get all registrations: registrationService.getAllRegistrations()
3. Get all group registrations: groupRegistrationService.getAllGroupRegistrations()
4. Get all payments: paymentService.getAllPayments()
5. Display in Registrations tab
```

---

## User Experience

### Happy Path (Paid Event)
1. ✅ User views event details
2. ✅ Clicks "Proceed to Payment"
3. ✅ Fills payment form
4. ✅ Selects payment method
5. ✅ Clicks "Complete Payment"
6. ✅ Sees success message
7. ✅ Redirected to success page with ticket preview
8. ✅ Receives ticket email with QR code
9. ✅ Receives registration confirmation email
10. ✅ Can view tickets in "My Tickets"
11. ✅ Admin sees registration in dashboard

### Admin Experience
1. ✅ Access admin dashboard
2. ✅ View all event registrations
3. ✅ See payment status for each registration
4. ✅ View registration statistics
5. ✅ Track event revenue
6. ✅ Export registration data (if implemented)

---

## Error Handling

### Payment Failures
- Validation errors (missing fields)
- Invalid payment method
- Payment processing errors
- User-friendly error messages displayed

### Email Failures
- Graceful degradation - payment succeeds even if email fails
- Errors logged for debugging
- Console warnings if email sending fails

### Ticket Creation Failures
- Logged but doesn't block payment success
- User still redirected to success page
- Can retry from MyTickets

---

## Testing Checklist

### Payment Flow
- [ ] User can navigate to event details
- [ ] Paid event shows payment button
- [ ] Free event shows registration form
- [ ] Payment form validates inputs
- [ ] Payment method selection works
- [ ] Payment submission succeeds
- [ ] Payment record created
- [ ] Registration record created
- [ ] Ticket created with QR code
- [ ] Emails sent successfully
- [ ] Success page displays ticket info
- [ ] User can view ticket in My Tickets

### Admin Dashboard
- [ ] Registration appears in admin dashboard
- [ ] Payment status shows correctly
- [ ] User details are accurate
- [ ] Registration count is correct
- [ ] Can filter registrations

### Emails
- [ ] Ticket confirmation email received
- [ ] QR code displays in email
- [ ] Verification code in email
- [ ] Registration confirmation email received
- [ ] Entry instructions clear

### My Tickets
- [ ] User's tickets displayed
- [ ] QR code generates and displays
- [ ] Verification code visible
- [ ] Can copy verification code
- [ ] Can download PDF
- [ ] Can mark as used
- [ ] Can cancel ticket
- [ ] Status filtering works

---

## Future Enhancements

1. **Real Payment Gateway Integration**
   - Stripe, PayPal, Razorpay integration
   - Real payment processing

2. **Advanced Features**
   - Multiple ticket tiers
   - Early bird discounts
   - Group discounts
   - Refund processing

3. **Analytics**
   - Revenue charts
   - Registration trends
   - Payment method analytics

4. **Notifications**
   - SMS notifications
   - Push notifications
   - Event reminders

5. **Export & Reporting**
   - CSV export of registrations
   - PDF reports
   - Email reports

---

## Summary

This complete payment and registration system provides:
- ✅ Secure payment checkout for paid events
- ✅ Automatic registration upon payment
- ✅ Unique QR code generation for venue entry
- ✅ Email confirmations with QR codes
- ✅ Ticket management interface
- ✅ Admin dashboard with registration tracking
- ✅ Complete event lifecycle management

All data is persisted in localStorage and integrated seamlessly with the admin portal for event management and oversight.
