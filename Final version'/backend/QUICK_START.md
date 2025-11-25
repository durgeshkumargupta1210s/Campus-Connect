# CampusConnect Backend - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Prerequisites Check
- Have Node.js v14+ installed: `node --version`
- Have MongoDB running locally or create a MongoDB Atlas account
- Have npm: `npm --version`

### 2. Installation
```bash
cd campus-connect-backend
npm install
```

### 3. Configuration
```bash
# Create .env file from example
cp .env.example .env

# Edit .env with your MongoDB connection string
# For local MongoDB: mongodb://localhost:27017/campus-connect
# For MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/campus-connect
```

### 4. Start the Server
```bash
npm run dev
```

You should see:
```
✓ MongoDB connected
🚀 Server running on http://localhost:5000
```

### 5. Test the API
Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📁 Project Structure

```
campus-connect-backend/
├── models/              # Database schemas
│   ├── User.js
│   ├── Event.js
│   ├── Club.js
│   ├── Opportunity.js
│   ├── Registration.js
│   ├── Ticket.js
│   ├── Payment.js
│   └── CampusDrive.js
├── controllers/         # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── eventController.js
│   ├── clubController.js
│   ├── opportunityController.js
│   ├── registrationController.js
│   ├── ticketController.js
│   ├── paymentController.js
│   └── campusDriveController.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── eventRoutes.js
│   ├── clubRoutes.js
│   ├── opportunityRoutes.js
│   ├── registrationRoutes.js
│   ├── ticketRoutes.js
│   ├── paymentRoutes.js
│   └── campusDriveRoutes.js
├── middleware/         # Express middleware
│   ├── authMiddleware.js
│   └── errorHandler.js
├── server.js           # Main server file
├── package.json
├── .env.example
└── README.md
```

## 🔑 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| GET | /users/profile | Get user profile |
| PUT | /users/profile | Update user profile |
| GET | /events | Get all events |
| POST | /events | Create event |
| GET | /clubs | Get all clubs |
| POST | /clubs/:id/join | Join club |
| GET | /opportunities | Get opportunities |
| POST | /opportunities/:id/apply | Apply for opportunity |
| POST | /registrations | Register for event |
| GET | /tickets | Get tickets |
| GET | /payments | Get payments |
| GET | /campus-drives | Get campus drives |

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get a token by logging in:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

Use the returned token in subsequent requests.

## 🗄️ MongoDB Setup

### Local MongoDB
```bash
# Install MongoDB locally, then run:
mongod

# Connect to MongoDB shell (new terminal):
mongosh
```

### MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string
5. Add to `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-connect
```

## 🐛 Common Issues

### MongoDB Connection Error
- Make sure MongoDB is running
- Check connection string in `.env`
- For MongoDB Atlas, whitelist your IP

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Kill it
kill -9 <PID>
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables

```env
# Required
MONGODB_URI=mongodb://localhost:27017/campus-connect
PORT=5000

# Security
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d
BCRYPT_SALT=10

# Environment
NODE_ENV=development

# Optional
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🚀 Frontend Integration

The frontend (in `../campus-connect-hub`) should use these API endpoints:

```javascript
const API_BASE = 'http://localhost:5000/api';

// Example API calls
fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
.then(res => res.json())
.then(data => {
  localStorage.setItem('token', data.token);
});
```

## 📚 Next Steps

1. **Connect Frontend**: Update frontend API calls to point to this backend
2. **Add Payment Gateway**: Integrate Razorpay or Stripe
3. **Email Notifications**: Add email service
4. **File Uploads**: Setup AWS S3 or similar
5. **Testing**: Add unit and integration tests
6. **Deployment**: Deploy to Heroku, AWS, or DigitalOcean

## 🤝 Contributing

Make changes and test thoroughly before committing:

```bash
# Start dev server
npm run dev

# Run tests (when added)
npm test
```

## 📞 Support

For help:
1. Check README.md for detailed API documentation
2. Check existing issues on GitHub
3. Review error logs in console

---

Happy coding! 🎉
