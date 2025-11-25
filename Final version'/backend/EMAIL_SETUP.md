# Email Notification Setup

## Overview
The application now sends email notifications for:
1. **User Registration Confirmation** - When a user registers for a paid event or workshop
2. **Admin Event Creation** - When an admin creates a new event

## Configuration

### Environment Variables
Add these to your `.env` file in the backend directory:

```env
# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:8080
```

### Gmail Setup
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Campus Connect Hub"
   - Copy the generated 16-character password
   - Use this as `EMAIL_PASS` in your `.env` file

### Other Email Providers
For other providers (Outlook, SendGrid, etc.), update the email configuration:

```env
# Outlook
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false

# SendGrid
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
```

## Email Triggers

### 1. Registration Confirmation
Emails are sent when:
- User registers for a **paid event** (after payment completion)
- User registers for a **workshop** (any workshop category)

**Location**: `backend/controllers/registrationController.js` and `backend/controllers/paymentController.js`

### 2. Event Creation Notification
Emails are sent when:
- Admin creates a new event (confirmation to admin)
- Event notification to subscribers (placeholder for future subscription system)

**Location**: `backend/controllers/eventController.js`

## Email Templates

All email templates are in `backend/utils/emailService.js`:
- `sendRegistrationConfirmation()` - Registration confirmation with event details
- `sendEventCreatedToAdmin()` - Admin confirmation when event is created
- `sendEventCreatedNotification()` - Notification to subscribers (placeholder)

## Testing

### Without Email Configuration
If email credentials are not configured, the system will:
- Log email attempts to console
- Continue normal operation
- Not throw errors

### With Email Configuration
1. Start the backend server
2. Register for a paid event or workshop
3. Check the user's email inbox
4. Create an event as admin
5. Check admin's email inbox

## Troubleshooting

### Emails Not Sending
1. Check `.env` file has correct credentials
2. Verify email provider allows SMTP access
3. Check backend console for error messages
4. Ensure firewall/network allows SMTP connections

### Gmail Issues
- Make sure 2-Step Verification is enabled
- Use App Password, not regular password
- Check if "Less secure app access" is needed (older accounts)

## Future Enhancements
- [ ] Subscription system for event notifications
- [ ] Email templates customization
- [ ] Email queue system for bulk sending
- [ ] Email delivery tracking
- [ ] Unsubscribe functionality

