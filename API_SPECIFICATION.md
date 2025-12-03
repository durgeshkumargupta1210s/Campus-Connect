# CampusConnect API Specification v1.0

## Base Information
- **API Version:** 1.0
- **Base URL:** `https://api.campusconnect.com/v1` (Prod) | `http://localhost:3000/api/v1` (Dev)
- **Authentication:** Bearer Token (JWT)
- **Response Format:** JSON
- **Rate Limit:** 100 requests/15 minutes per IP

---

## Authentication Endpoints

### 1. Register User
```http
POST /auth/register

Content-Type: application/json

{
  "email": "student@college.edu",
  "password": "SecurePassword@123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "rollNumber": "CSE/2022/001",
  "department": "CSE",
  "year": 2
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "student@college.edu",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "emailVerified": false
  },
  "message": "Registration successful. Please verify your email."
}
```

### 2. Login
```http
POST /auth/login

Content-Type: application/json

{
  "email": "student@college.edu",
  "password": "SecurePassword@123"
}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "student@college.edu",
      "firstName": "John",
      "role": "STUDENT"
    }
  }
}

Error (401):
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect"
  }
}
```

### 3. Refresh Token
```http
POST /auth/refresh

Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Events Endpoints

### 1. Get All Events (Paginated)
```http
GET /events?page=1&limit=20&category=TECHNICAL&search=hackathon&sortBy=-eventDate

Headers:
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "evt_001",
      "title": "Tech Hackathon 2025",
      "description": "...",
      "category": "TECHNICAL",
      "eventDate": "2025-03-21T14:00:00Z",
      "location": {
        "venue": "Main Hall",
        "address": "College Campus"
      },
      "maxCapacity": 200,
      "registeredCount": 145,
      "isPaid": true,
      "price": {
        "amount": 100,
        "currency": "INR"
      },
      "poster": "https://cdn.example.com/poster.jpg",
      "isFeatured": true,
      "tags": ["hackathon", "coding", "innovation"],
      "status": "PUBLISHED"
    }
    // ... more events
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 247,
    "pages": 13
  }
}
```

### 2. Get Event by ID
```http
GET /events/:eventId

Response (200):
{
  "success": true,
  "data": {
    "_id": "evt_001",
    "title": "Tech Hackathon 2025",
    "description": "...",
    "category": "TECHNICAL",
    "eventDate": "2025-03-21T14:00:00Z",
    "endDate": "2025-03-22T14:00:00Z",
    "registrationDeadline": "2025-03-20T23:59:59Z",
    "location": {
      "venue": "Main Hall",
      "address": "College Campus",
      "coordinates": {
        "type": "Point",
        "coordinates": [77.2167, 28.6139]
      }
    },
    "maxCapacity": 200,
    "registeredCount": 145,
    "isPaid": true,
    "price": {
      "amount": 100,
      "currency": "INR",
      "earlyBirdPrice": 75,
      "earlyBirdDeadline": "2025-03-15T23:59:59Z"
    },
    "agenda": [
      {
        "time": "2:00 PM - 2:30 PM",
        "activity": "Opening Ceremony",
        "speaker": "Dr. John Smith"
      },
      {
        "time": "2:30 PM - 4:00 PM",
        "activity": "Coding Challenge Round 1",
        "speaker": ""
      }
    ],
    "poster": "https://cdn.example.com/poster.jpg",
    "banner": "https://cdn.example.com/banner.jpg",
    "videoLink": "https://youtube.com/watch?v=xxx",
    "organizerId": "org_001",
    "clubId": "club_001",
    "likes": 234,
    "views": 1245,
    "tags": ["hackathon", "coding"],
    "status": "PUBLISHED",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-20T14:30:00Z"
  }
}

Error (404):
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Event not found"
  }
}
```

### 3. Create Event (Club Admin +)
```http
POST /events

Headers:
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Tech Hackathon 2025",
  "description": "A 24-hour hackathon for students to showcase innovation",
  "category": "TECHNICAL",
  "eventDate": "2025-03-21T14:00:00Z",
  "endDate": "2025-03-22T14:00:00Z",
  "registrationDeadline": "2025-03-20T23:59:59Z",
  "location": {
    "venue": "Main Hall",
    "address": "College Campus",
    "coordinates": [77.2167, 28.6139]
  },
  "maxCapacity": 200,
  "isPaid": true,
  "price": {
    "amount": 100,
    "currency": "INR",
    "earlyBirdPrice": 75,
    "earlyBirdDeadline": "2025-03-15T23:59:59Z"
  },
  "agenda": [
    {
      "time": "2:00 PM - 2:30 PM",
      "activity": "Opening Ceremony",
      "speaker": "Dr. John Smith"
    }
  ],
  "poster": "https://cdn.example.com/poster.jpg",
  "banner": "https://cdn.example.com/banner.jpg",
  "tags": ["hackathon", "coding"],
  "allowTeamRegistration": true,
  "minTeamSize": 2,
  "maxTeamSize": 4
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "evt_001",
    "title": "Tech Hackathon 2025",
    "status": "DRAFT",
    "organizerId": "user_123",
    // ... rest of event data
  },
  "message": "Event created successfully"
}

Error (400):
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "eventDate": "Event date must be in the future",
      "maxCapacity": "Maximum capacity must be at least 1"
    }
  }
}
```

### 4. Update Event (Own Event)
```http
PUT /events/:eventId

Headers:
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Tech Hackathon 2025 - Updated",
  "description": "...",
  "maxCapacity": 250,
  // ... other fields to update
}

Response (200):
{
  "success": true,
  "data": {
    // Updated event data
  },
  "message": "Event updated successfully"
}
```

### 5. Get Event Recommendations
```http
GET /events/recommendations?limit=10

Headers:
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": [
    {
      "eventId": "evt_001",
      "title": "Tech Hackathon 2025",
      "recommendationScore": 0.92,
      "reason": "Based on your interest in coding",
      "relevanceExplanation": "This event matches 5 of your interests"
    }
    // ... more recommendations
  ]
}
```

---

## Bookings Endpoints

### 1. Create Booking
```http
POST /bookings

Headers:
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "eventId": "evt_001",
  "numberOfTickets": 2,
  "ticketType": "GENERAL",
  "attendees": [
    {
      "name": "John Doe",
      "email": "john@college.edu",
      "phone": "+919876543210",
      "rollNumber": "CSE/2022/001"
    },
    {
      "name": "Jane Smith",
      "email": "jane@college.edu",
      "phone": "+919876543211",
      "rollNumber": "CSE/2022/002"
    }
  ],
  "specialRequirements": "Vegetarian meals needed"
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "book_001",
    "bookingRef": "BOOK-2025-001234",
    "eventId": "evt_001",
    "userId": "user_123",
    "numberOfTickets": 2,
    "totalPrice": 200,
    "paymentStatus": "PENDING",
    "status": "PENDING",
    "qrCode": "https://cdn.example.com/qr/BOOK-2025-001234.png",
    "qrId": "QR-2025-001234",
    "createdAt": "2025-01-21T10:30:00Z"
  },
  "paymentRequired": true,
  "paymentGateway": "RAZORPAY"
}
```

### 2. Verify Payment
```http
POST /bookings/:bookingId/verify-payment

Headers:
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "paymentId": "pay_2nsd3nsd",
  "orderId": "order_2nsd3nsd",
  "signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}

Response (200):
{
  "success": true,
  "data": {
    "_id": "book_001",
    "status": "CONFIRMED",
    "paymentStatus": "SUCCESS",
    "qrCode": "https://cdn.example.com/qr/BOOK-2025-001234.png",
    "message": "Payment verified. Your ticket is ready!"
  }
}
```

### 3. Get My Bookings
```http
GET /bookings?status=CONFIRMED&page=1&limit=10

Headers:
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "book_001",
      "bookingRef": "BOOK-2025-001234",
      "event": {
        "_id": "evt_001",
        "title": "Tech Hackathon 2025",
        "eventDate": "2025-03-21T14:00:00Z"
      },
      "numberOfTickets": 2,
      "status": "CONFIRMED",
      "entryStatus": "NOT_SCANNED",
      "qrCode": "https://cdn.example.com/qr/BOOK-2025-001234.png",
      "createdAt": "2025-01-21T10:30:00Z"
    }
    // ... more bookings
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### 4. Cancel Booking
```http
PUT /bookings/:bookingId/cancel

Headers:
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "cancellationReason": "Unable to attend due to illness"
}

Response (200):
{
  "success": true,
  "data": {
    "_id": "book_001",
    "status": "CANCELLED",
    "refundAmount": 200,
    "refundStatus": "INITIATED",
    "refundedAt": "2025-01-21T11:00:00Z"
  },
  "message": "Booking cancelled. Refund will be processed within 3-5 business days."
}
```

---

## QR Code Endpoints

### 1. Validate QR at Entry
```http
POST /qr/validate

Headers:
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "qrData": "QR-2025-001234",
  "eventId": "evt_001",
  "scannedAt": "2025-03-21T14:15:00Z",
  "location": "Main Entrance"
}

Response (200):
{
  "success": true,
  "data": {
    "isValid": true,
    "booking": {
      "bookingRef": "BOOK-2025-001234",
      "userName": "John Doe",
      "numberOfTickets": 2,
      "ticketType": "GENERAL"
    },
    "entryStatus": "VERIFIED",
    "message": "Entry granted. Welcome!"
  }
}

Error (409):
{
  "success": false,
  "error": {
    "code": "DUPLICATE_ENTRY",
    "message": "This ticket has already been used for entry",
    "data": {
      "previousScanTime": "2025-03-21T14:10:00Z",
      "scannedBy": "admin_001"
    }
  }
}
```

### 2. Bulk Scan Entries (Admin)
```http
POST /admin/qr/bulk-scan

Headers:
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "eventId": "evt_001",
  "scans": [
    {
      "qrData": "QR-2025-001234",
      "timestamp": "2025-03-21T14:15:00Z"
    },
    {
      "qrData": "QR-2025-001235",
      "timestamp": "2025-03-21T14:16:00Z"
    }
  ]
}

Response (200):
{
  "success": true,
  "data": {
    "totalScans": 2,
    "successfulScans": 2,
    "failedScans": 0,
    "results": [
      {
        "qrData": "QR-2025-001234",
        "status": "SUCCESS",
        "message": "Entry granted"
      },
      {
        "qrData": "QR-2025-001235",
        "status": "SUCCESS",
        "message": "Entry granted"
      }
    ],
    "currentAttendance": 245
  }
}
```

---

## Resources Endpoints

### 1. Get All Resources
```http
GET /resources?type=PYQ&subject=DSA&semester=3&page=1&limit=20

Headers:
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "res_001",
      "title": "DSA Question Bank 2024",
      "description": "Comprehensive collection of DSA questions from past years",
      "type": "PYQ",
      "subject": "DSA",
      "semester": 3,
      "difficulty": "INTERMEDIATE",
      "fileUrl": "https://cdn.example.com/dsa_2024.pdf",
      "fileName": "dsa_2024.pdf",
      "downloads": 234,
      "views": 1200,
      "rating": 4.5,
      "uploadedBy": {
        "_id": "faculty_001",
        "name": "Dr. Sharma"
      },
      "createdAt": "2024-12-01T10:00:00Z"
    }
    // ... more resources
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "pages": 8
  }
}
```

### 2. Download Resource
```http
POST /resources/:resourceId/download

Headers:
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": {
    "downloadUrl": "https://cdn.example.com/dsa_2024.pdf",
    "expiresIn": 3600,
    "fileName": "dsa_2024.pdf"
  },
  "message": "Download link generated"
}
```

### 3. Rate Resource
```http
POST /resources/:resourceId/rate

Headers:
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent resource, very helpful!"
}

Response (201):
{
  "success": true,
  "data": {
    "rating": 4.6,
    "totalRatings": 25,
    "userRating": 5
  }
}
```

---

## Admin Endpoints

### 1. Dashboard Statistics
```http
GET /admin/dashboard

Headers:
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": {
    "summary": {
      "totalUsers": 5234,
      "totalEvents": 127,
      "totalBookings": 12456,
      "totalRevenue": 1234567,
      "activeEvents": 15
    },
    "topEvents": [
      {
        "_id": "evt_001",
        "title": "Tech Hackathon 2025",
        "registrations": 245,
        "revenue": 24500
      }
      // ... more
    ],
    "recentBookings": [
      {
        "bookingRef": "BOOK-2025-001234",
        "event": "Tech Hackathon 2025",
        "user": "John Doe",
        "amount": 200,
        "status": "CONFIRMED",
        "createdAt": "2025-01-21T10:30:00Z"
      }
      // ... more
    ],
    "systemHealth": {
      "uptime": "99.9%",
      "avgResponseTime": "145ms",
      "errorRate": "0.02%"
    }
  }
}
```

### 2. Approve Event (Moderation)
```http
PUT /admin/events/:eventId/approve

Headers:
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "approved": true,
  "comments": "Event details look good. Approved."
}

Response (200):
{
  "success": true,
  "data": {
    "_id": "evt_001",
    "status": "PUBLISHED",
    "approvedBy": "admin_001",
    "approvedAt": "2025-01-21T11:00:00Z"
  }
}
```

### 3. Fraud Report
```http
POST /admin/fraud-detection/report

Headers:
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "bookingId": "book_001",
  "reason": "Duplicate payment detected",
  "severity": "HIGH"
}

Response (201):
{
  "success": true,
  "data": {
    "reportId": "fraud_001",
    "status": "UNDER_REVIEW",
    "createdAt": "2025-01-21T11:30:00Z"
  }
}
```

---

## Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_CREDENTIALS | 401 | Email or password incorrect |
| TOKEN_EXPIRED | 401 | JWT token has expired |
| UNAUTHORIZED | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Request validation failed |
| DUPLICATE_ENTRY | 409 | Ticket already scanned |
| CAPACITY_FULL | 409 | Event capacity exceeded |
| PAYMENT_FAILED | 402 | Payment gateway error |
| SERVER_ERROR | 500 | Internal server error |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |

---

## Webhook Events

### Payment Success Webhook
```
POST /webhooks/razorpay

Body:
{
  "event": "payment.authorized",
  "created_at": 1704067200,
  "data": {
    "payment": {
      "id": "pay_2nsd3nsd",
      "entity": "payment",
      "amount": 20000,
      "currency": "INR",
      "status": "authorized",
      "notes": {
        "bookingId": "book_001"
      }
    }
  }
}
```

---

## Rate Limiting

- **Public Endpoints:** 100 requests/15 minutes per IP
- **Authenticated Endpoints:** 1000 requests/15 minutes per user
- **Admin Endpoints:** 5000 requests/15 minutes per admin
- **Payment APIs:** 50 requests/15 minutes per user

---

**Last Updated:** January 2025
**Version:** 1.0.0
