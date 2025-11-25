# CampusConnect Backend API

A comprehensive Node.js/Express backend for the CampusConnect campus management platform. Built with MongoDB for data persistence, JWT for authentication, and a RESTful API architecture.

## Features

- **User Management**: Registration, login, profile management, role-based access control
- **Events**: Create, manage, and register for campus events
- **Clubs**: Join clubs, manage club memberships, and view club activities
- **Opportunities**: Campus drives, internships, placements, and recruitment
- **Registrations**: Event registration and attendance tracking
- **Tickets**: Event tickets with QR code support
- **Payments**: Payment processing and transaction management
- **Security**: JWT authentication, password hashing, CORS, helmet protection

## Tech Stack

- **Framework**: Express.js (Node.js)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, CORS
- **Environment**: dotenv

## Installation

### Prerequisites
- Node.js v14+
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone <repo-url>
cd campus-connect-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/campus-connect
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
BCRYPT_SALT=10
```

4. **Start the server**

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### User Routes

All user routes require JWT authentication header:
```
Authorization: Bearer <token>
```

#### Get Profile
```
GET /users/profile
```

#### Update Profile
```
PUT /users/profile
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "9876543210",
  "college": "XYZ College",
  "branch": "Computer Science",
  "semester": "6",
  "bio": "Interested in web development",
  "skills": ["JavaScript", "React", "Node.js"],
  "interests": ["Tech", "Sports"]
}
```

### Events Routes

#### Get All Events
```
GET /events?category=technical&status=upcoming&page=1&limit=10
```

#### Create Event (Admin/Club Head only)
```
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Hackathon 2024",
  "description": "Annual hackathon event",
  "category": "hackathon",
  "date": "2024-03-15T10:00:00Z",
  "time": "10:00 AM",
  "location": "Main Campus",
  "capacity": 100,
  "organizer": "<club_id>"
}
```

#### Get Event Details
```
GET /events/<event_id>
```

#### Update Event
```
PUT /events/<event_id>
Authorization: Bearer <token>
```

#### Delete Event
```
DELETE /events/<event_id>
Authorization: Bearer <token>
```

#### Get Upcoming Events
```
GET /events/upcoming
```

### Clubs Routes

#### Get All Clubs
```
GET /clubs?category=technical&status=active&page=1&limit=10
```

#### Create Club
```
POST /clubs
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Tech Club",
  "description": "For tech enthusiasts",
  "category": "technical",
  "email": "techclub@college.edu",
  "location": "Building A"
}
```

#### Join Club
```
POST /clubs/<club_id>/join
Authorization: Bearer <token>
```

#### Leave Club
```
POST /clubs/<club_id>/leave
Authorization: Bearer <token>
```

### Opportunities Routes

#### Get Opportunities
```
GET /opportunities?type=internship&status=active&page=1&limit=10
```

#### Create Opportunity
```
POST /opportunities
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Summer Internship",
  "description": "Backend development internship",
  "type": "internship",
  "company": "TechCorp",
  "position": "Backend Developer",
  "salary": "₹20,000/month",
  "deadline": "2024-02-28",
  "location": "Mumbai",
  "requirements": ["Node.js", "MongoDB"],
  "benefits": ["Stipend", "Certificate"]
}
```

#### Apply for Opportunity
```
POST /opportunities/<opportunity_id>/apply
Authorization: Bearer <token>
```

### Registrations Routes

#### Register for Event
```
POST /registrations
Authorization: Bearer <token>
Content-Type: application/json

{
  "eventId": "<event_id>"
}
```

#### Get User Registrations
```
GET /registrations?page=1&limit=10
Authorization: Bearer <token>
```

#### Cancel Registration
```
PUT /registrations/<registration_id>/cancel
Authorization: Bearer <token>
```

### Tickets Routes

#### Create Ticket
```
POST /tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "eventId": "<event_id>",
  "type": "standard",
  "price": 500,
  "quantity": 1
}
```

#### Get User Tickets
```
GET /tickets
Authorization: Bearer <token>
```

#### Check-in Ticket
```
PUT /tickets/<ticket_id>/check-in
Authorization: Bearer <token>
```

### Payments Routes

#### Create Payment
```
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500,
  "paymentMethod": "upi",
  "description": "Event ticket payment",
  "relatedTo": "ticket",
  "relatedId": "<ticket_id>"
}
```

#### Get User Payments
```
GET /payments?status=completed&page=1&limit=10
Authorization: Bearer <token>
```

#### Complete Payment
```
PUT /payments/<payment_id>/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "transactionId": "TXN123456"
}
```

### Campus Drives Routes

#### Get Campus Drives
```
GET /campus-drives?status=upcoming
```

#### Create Campus Drive
```
POST /campus-drives
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Campus Drive 2024",
  "company": "TechCorp",
  "description": "Full-time placement drive",
  "date": "2024-03-20",
  "location": "Main Auditorium",
  "positions": [
    {
      "title": "Software Engineer",
      "count": 10,
      "salary": "8-12 LPA"
    }
  ]
}
```

#### Register for Campus Drive
```
POST /campus-drives/<drive_id>/register
Authorization: Bearer <token>
```

## User Roles

- **student**: Can register for events, apply for opportunities, join clubs
- **admin**: Full access to all resources, can manage users and events
- **club_head**: Can create and manage events, club management
- **recruiter**: Can post opportunities and campus drives

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "message": "Error description",
  "errors": ["Field-specific errors (if applicable)"]
}
```

Common Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## Database Models

### User
- name, email, password
- role, phone, college, branch, semester
- bio, profileImage, resume
- skills, interests
- clubsJoined, registeredEvents, tickets, applications

### Event
- title, description, category, date, time
- location, venue, imageUrl, capacity
- organizer (Club), createdBy (User)
- registrations, status, tags

### Club
- name, description, category
- head (User), members[], events[]
- contact info, social links

### Opportunity
- title, description, type, company
- position, salary, deadline, date
- requirements, benefits
- applications[], status

### Registration
- event, user, status
- checkInTime, feedback (rating + comment)

### Ticket
- user, event, ticketNumber
- type, price, quantity, status
- qrCode, checkedInAt

### Payment
- user, transactionId, amount
- paymentMethod, status
- relatedTo, relatedId
- gateway info, metadata

### CampusDrive
- title, company, description, date
- positions[], registeredStudents[], selectedStudents[]
- status, postedBy

## Future Enhancements

- [ ] Email notifications
- [ ] SMS notifications
- [ ] Payment gateway integration (Razorpay, Stripe)
- [ ] QR code generation for tickets
- [ ] Resume analysis
- [ ] Advanced filtering and search
- [ ] Webhook support
- [ ] Rate limiting
- [ ] Caching with Redis
- [ ] File upload with cloud storage

## Deployment

### MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Heroku
```bash
heroku create campus-connect-backend
heroku config:set MONGODB_URI=<your_mongodb_uri>
git push heroku main
```

### Environment Variables for Production
```
NODE_ENV=production
MONGODB_URI=<production_mongodb_uri>
JWT_SECRET=<strong_random_secret>
JWT_EXPIRE=7d
PORT=5000
```

## Support

For issues and feature requests, please create an issue on GitHub.

## License

ISC
