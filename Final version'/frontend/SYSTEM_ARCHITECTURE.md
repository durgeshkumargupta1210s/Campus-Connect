# Email Notification System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAMPUS CONNECT HUB                           │
│                 Email Notification System                       │
└─────────────────────────────────────────────────────────────────┘

USER SIDE                      SYSTEM                    DATA
┌──────────────┐              ┌──────────────┐         ┌────────────┐
│   Footer     │──Submit───→  │Email Service │ ──→    │LocalStorage│
│Newsletter    │              │   Module     │         │            │
│Subscription  │◄───Message───┘              │         │Emails List │
└──────────────┘              └──────────────┘         └────────────┘

ADMIN SIDE                    
┌──────────────┐              ┌──────────────┐         
│AdminAddEvent │──Submit───→  │Notification  │ ──→    │All Users in│
│Form          │              │  Hook        │         │Subscription│
│Create Event  │◄───Message───┘              │         │  List      │
└──────────────┘              └──────────────┘         
```

## Component Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         APP ROOT                                │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
    ┌───▼────────┐          ┌────────▼──────┐
    │   Pages    │          │  Components   │
    └────┬───────┘          └────────┬──────┘
         │                           │
         │                    ┌──────▼───────┐
         │                    │    Footer    │
         │                    │              │
    ┌────▼────────────┐       │ Newsletter   │
    │ AdminAddEvent   │       │ Subscription │
    │                │       │              │
    │ • Event Form   │       └──────┬───────┘
    │ • Submit Event │              │
    │ • Notify Users │              │
    └────┬───────────┘              │
         │                          │
         │                    ┌─────▼──────────┐
         │                    │  emailService  │
         │                    │                │
         │   ┌────────────────┤ • subscribe    │
         │   │                │ • notify       │
         │   │                │ • send         │
         │   │                │ • unsub        │
         │   │                └─────┬──────────┘
         │   │                      │
         │   │              ┌───────▼────────┐
         │   │              │  localStorage  │
         │   │              │                │
         │   └─────────────▶│Subscriptions[] │
         │                  └────────────────┘
         │
         └──────────▶ useEventNotifications Hook
                             │
                             ├─ notifyNewEvent()
                             │
                             └─▶ emailService.notifyEventCreated()
```

## Data Flow - Subscription Process

```
1. USER ENTERS EMAIL IN FOOTER
   ┌──────────────────┐
   │ User typed email │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────────┐
   │ Click "Subscribe"    │
   └────────┬─────────────┘
            │
            ▼
   ┌──────────────────────┐
   │ handleSubscribe()    │
   │ (Footer Component)   │
   └────────┬─────────────┘
            │
            ▼
2. EMAIL SERVICE PROCESSES
   ┌──────────────────────────┐
   │ emailService.subscribe() │
   │                          │
   │ ✓ Validate email         │
   │ ✓ Check duplicates       │
   │ ✓ Store in localStorage  │
   │ ✓ Send thank you email   │
   └────────┬─────────────────┘
            │
            ├─────┬─────────┬────────────────┐
            ▼     ▼         ▼                ▼
         Valid  Invalid  Duplicate    Storage
         Email   Email    Error        Success
            │     │         │             │
            ▼     ▼         ▼             ▼
         ✅OK  ❌Error  ❌Error        ✅OK
                                        │
                                        ▼
3. USER SEES MESSAGE
   ┌──────────────────────┐
   │ Success Message      │
   │ ✓ Check your email   │
   │                      │
   │ Auto-dismiss in 5s   │
   └──────────────────────┘
```

## Data Flow - Event Notification Process

```
1. ADMIN CREATES EVENT
   ┌────────────────────────┐
   │ Fill Event Details     │
   │ • Name                 │
   │ • Date                 │
   │ • Description          │
   │ • Category             │
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────┐
   │ Click "Create Event"
   └────────┬───────────┘
            │
            ▼
2. TRIGGER NOTIFICATIONS
   ┌─────────────────────────────┐
   │ handleSubmit() (AdminAddEvent)
   │                             │
   │ await notifyNewEvent({      │
   │   name: eventName,          │
   │   date: eventDate,          │
   │   description: desc         │
   │ })                          │
   └────────┬────────────────────┘
            │
            ▼
3. NOTIFICATION HOOK
   ┌────────────────────────────────┐
   │ useEventNotifications()        │
   │                                │
   │ • Get all subscriptions        │
   │ • Loop through each email      │
   │ • Send email to each           │
   └────────┬───────────────────────┘
            │
            ▼
4. EMAIL SERVICE SENDS
   ┌─────────────────────────────────┐
   │ notifyEventCreated()            │
   │                                 │
   │ for each email:                 │
   │   • sendEventNotification()     │
   │   • Log to console              │
   │   • Add to count                │
   └────────┬────────────────────────┘
            │
            ▼
5. DISPLAY SUCCESS
   ┌────────────────────────────┐
   │ Success Message:           │
   │ ✓ Event created!           │
   │ ✓ Notified X subscribers   │
   │                            │
   │ Auto-navigate in 2s        │
   └────────────────────────────┘
```

## localStorage Structure

```
KEY: "campus_connect_subscriptions"

VALUE (JSON Array):
[
  "student1@example.com",
  "student2@example.com",
  "professor@example.com",
  "admin@example.com"
]

OPERATIONS:
• Get:    JSON.parse(localStorage.getItem('campus_connect_subscriptions'))
• Add:    emails.push(newEmail) → localStorage.setItem(...)
• Remove: emails.filter() → localStorage.setItem(...)
• Clear:  localStorage.removeItem(...)
```

## Message Type States

```
SUBSCRIPTION MESSAGES:
┌──────────────────────────┐
│ SUCCESS (Green)          │
│ ✓ Thank you for          │
│   subscribing!           │
│   Check your email.      │
│ (Auto-dismiss 5s)        │
└──────────────────────────┘

┌──────────────────────────┐
│ ERROR (Red)              │
│ ✗ Invalid email          │
│ ✗ Already subscribed     │
│ ✗ Failed to subscribe    │
│ (Stays until fixed)      │
└──────────────────────────┘

EVENT CREATION MESSAGES:
┌──────────────────────────┐
│ SUCCESS (Green)          │
│ ✓ Event created!         │
│ ✓ Notified X subscribers │
│ (Auto-navigate 2s)       │
└──────────────────────────┘
```

## File Dependencies

```
Footer.tsx
    ├─ emailService.ts ────────┐
    └─ Components/UI            │
                                │
AdminAddEvent.tsx               │
    ├─ useEventNotifications.ts ─┤
    │      │                    │
    │      └─ emailService.ts ◄─┘
    └─ Components/UI

emailService.ts
    └─ sendThankYouEmail() ──┐
    └─ sendEventNotification() ◄─┘ (Mock implementations)
```

## Integration Points

```
CURRENT (Mock Implementation):
┌──────────────────┐
│ localStorage     │
│ (Browser)        │
└──────────────────┘
       │
       ▼
┌──────────────────────┐
│ Console Logging      │
│ (Development)        │
└──────────────────────┘

FUTURE (Production):
┌──────────────────────┐
│ EmailJS / SendGrid   │
│ / Custom Backend     │
└──────────┬───────────┘
           │
           ▼
        ┌─────────────────────┐
        │ User's Email Inbox  │
        │ • Thank You Email   │
        │ • Event Updates     │
        │ • Notifications     │
        └─────────────────────┘
```

## Browser Storage Visualization

```
DevTools View (F12):
┌─ Application
├─ Local Storage
│   └─ http://localhost:5173
│       └─ campus_connect_subscriptions: "[email1, email2, ...]"
│
└─ Console
    ├─ 📧 Thank you email sent to: user@example.com
    ├─ ✅ Email confirmed for: user@example.com
    ├─ 📧 Event notification for user@example.com
    └─ ✅ Event notification sent to 5 subscribers
```

## Timeline of Events

```
SUBSCRIPTION TIMELINE:
─────────────────────

t=0s:    User enters email & clicks Subscribe
         
t=0.1s:  System validates email format
         
t=0.2s:  Check for duplicates in localStorage
         
t=0.3s:  Store email in localStorage
         
t=0.5s:  Send thank you email (mock)
         
t=1.0s:  Display success message
         
t=5.0s:  Auto-clear message (if successful)


EVENT NOTIFICATION TIMELINE:
────────────────────────────

t=0s:    Admin submits event form
         
t=0.1s:  System triggers notification hook
         
t=0.2s:  Retrieve all subscriptions from localStorage
         
t=0.3s:  Loop through each email address
         
t=0.4s:  Send notification email to each (mock)
         
t=0.8s:  Calculate total count notified
         
t=1.0s:  Display success message with count
         
t=2.0s:  Auto-navigate to dashboard
```

---

This architecture provides a complete, scalable email notification system that can be easily extended with real email services.
