# Email Notification System

## Overview
The Campus Connect Hub now includes an integrated email notification system that:
1. **Sends thank you emails** when users subscribe to the newsletter
2. **Notifies all subscribers** when new events are created
3. **Stores subscriptions** in localStorage for persistence

## Features

### 1. Newsletter Subscription (Footer Component)
- Users can enter their email in the "Stay Updated" section
- Upon subscription:
  - Email validation is performed
  - Duplicate subscriptions are prevented
  - A thank you email is sent to the subscriber
  - Success/error messages are displayed
  - Email is stored for future notifications

**Location:** `src/components/Footer.tsx`

### 2. Event Creation Notifications (AdminAddEvent Component)
- When an admin creates a new event, all subscribed users are notified
- Notifications include:
  - Event name
  - Event date
  - Event description
- A success message shows how many subscribers were notified

**Location:** `src/pages/AdminAddEvent.tsx`

## Architecture

### Email Service (`src/services/emailService.ts`)
The email service handles all email-related operations:

```typescript
emailService.subscribe(email)          // Subscribe user to newsletter
emailService.sendThankYouEmail(email)  // Send thank you email
emailService.notifyEventCreated(event) // Notify subscribers of new event
emailService.getSubscriptions()        // Get all subscriptions (admin)
emailService.unsubscribe(email)        // Unsubscribe user
```

### Event Notifications Hook (`src/hooks/useEventNotifications.ts`)
Custom hook for triggering event notifications:

```typescript
const { notifyNewEvent } = useEventNotifications();

// Usage in components
await notifyNewEvent({
  name: "AI/ML Hackathon",
  date: "2024-03-20",
  description: "Build AI solutions..."
});
```

## Implementation Details

### Data Storage
- Subscriptions are stored in **localStorage** under the key `campus_connect_subscriptions`
- Format: Array of email addresses
- Example: `["user1@example.com", "user2@example.com"]`

### Email Validation
- Checks for empty email
- Validates email format using regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Prevents duplicate subscriptions

### Mock Implementation
Currently, the system uses a **mock implementation** that logs emails to the console. This is safe for development and testing.

## Integration with Real Email Services

### Option 1: EmailJS (Recommended for Frontend)
```typescript
import emailjs from '@emailjs/browser';

// Initialize
emailjs.init('YOUR_PUBLIC_KEY');

// Send email
await emailjs.send('service_id', 'template_id', {
  to_email: email,
  subject: 'Welcome to Campus Connect Hub!',
  message: 'Thank you for subscribing...'
});
```

### Option 2: Backend API
```typescript
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: email,
    subject: 'Welcome to Campus Connect Hub!',
    template: 'thank-you'
  })
});
```

### Option 3: SendGrid
```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: 'noreply@campusconnect.edu',
  subject: 'Welcome to Campus Connect Hub!',
  html: '<h1>Thank you for subscribing!</h1>...'
});
```

## User Experience Flow

### Subscription Flow
1. User enters email in "Stay Updated" section (Footer)
2. Click "Subscribe" button
3. Email is validated
4. Subscription is saved to localStorage
5. Thank you email is sent
6. Success message is displayed with confirmation

### Event Notification Flow
1. Admin creates new event in AdminAddEvent page
2. Fills in event details (name, date, description, etc.)
3. Click "Create Event" button
4. System retrieves all subscribed emails
5. Sends event notification to each subscriber
6. Shows success message with count of notified subscribers
7. Navigates back to admin dashboard

## UI Components

### Footer Newsletter Section
- Email input field with placeholder
- Subscribe button with loading state
- Success/error message with icon
- Clears input and message on successful subscription

### AdminAddEvent Success Message
- Displays at top of page
- Shows event creation confirmation
- Displays subscriber notification count
- Auto-dismisses after 2 seconds

## Testing

### Manual Testing Steps

1. **Subscribe to Newsletter:**
   - Go to home page
   - Scroll to footer "Stay Updated" section
   - Enter email: `test@example.com`
   - Click "Subscribe"
   - Check browser console for confirmation logs
   - Try subscribing again (should show "already subscribed" message)

2. **Create Event with Notifications:**
   - Login as admin
   - Go to Admin Dashboard
   - Click "Add Event"
   - Fill in event details
   - Click "Create Event"
   - Check success message for subscriber count
   - Open browser console to see notification logs

3. **Check Stored Subscriptions:**
   - Open browser DevTools (F12)
   - Go to Application > Local Storage
   - Find `campus_connect_subscriptions`
   - Should show array of emails

## Console Logs

The system logs important events to the browser console:

```
📧 Sending thank you email to: user@example.com
✅ Email confirmed for: user@example.com
📧 Event notification for user@example.com: AI/ML Hackathon
✅ Event notification sent to user@example.com
📧 Event notification sent to 5 subscribers
```

## Future Enhancements

1. **Email Preferences:**
   - Allow users to choose notification frequency
   - Category-based subscriptions (hackathons, placements, etc.)
   - Unsubscribe link in emails

2. **Advanced Features:**
   - Email verification with confirmation links
   - Subscriber database instead of localStorage
   - Admin dashboard showing subscriber statistics
   - Email templates for different event types

3. **Integration:**
   - Connect to backend API for email sending
   - Use professional email service (SendGrid, Mailgun, etc.)
   - Track email open rates and clicks

4. **Security:**
   - Rate limiting on subscription endpoint
   - CAPTCHA verification
   - Protection against spam emails

## Troubleshooting

### Issue: Emails not appearing in console
**Solution:** Check browser console is open (F12). Emails are logged there by default in mock mode.

### Issue: Subscriptions not persisting
**Solution:** Ensure localStorage is enabled in browser. Check Application > Local Storage for the data.

### Issue: Multiple subscription attempts failing
**Solution:** Clear localStorage (`localStorage.clear()`) and try again.

## API Reference

### emailService.subscribe(email)
Subscribes user to newsletter and sends thank you email.

**Parameters:**
- `email` (string): User's email address

**Returns:**
```typescript
{
  success: boolean;
  message: string; // "Thank you for subscribing!" or error message
}
```

### emailService.notifyEventCreated(eventData)
Notifies all subscribers about a new event.

**Parameters:**
- `eventData` (object):
  - `name` (string): Event name
  - `date` (string): Event date
  - `description` (string): Event description

**Returns:**
```typescript
{
  success: boolean;
  count: number; // Number of subscribers notified
}
```

### useEventNotifications()
Hook for triggering event notifications in components.

**Returns:**
```typescript
{
  notifyNewEvent: (eventData) => Promise<{ success: boolean; count: number }>
}
```

## File Structure
```
src/
├── services/
│   └── emailService.ts         # Email service implementation
├── hooks/
│   └── useEventNotifications.ts # Hook for event notifications
├── components/
│   └── Footer.tsx              # Updated with subscription form
└── pages/
    └── AdminAddEvent.tsx       # Updated to send notifications
```

## Environment Variables (Future)
When integrating with real email services, add to `.env`:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_BACKEND_EMAIL_API=https://your-api.com/send-email
```

## Questions?

For implementation details or integration questions, refer to the service files:
- `src/services/emailService.ts` - Main implementation
- `src/hooks/useEventNotifications.ts` - Hook implementation
