# Campus Connect - Quick Start Guide

## Prerequisites
- Node.js v18+ installed
- MongoDB Atlas account with active cluster (or local MongoDB)
- Port 3000 (server) and 5173 (client) available

## Setup Instructions

### 1. Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example and add your MongoDB URI)
# Edit .env with your credentials:
# - MONGODB_URI: Your MongoDB Atlas connection string
# - CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY (optional, for auth)

# Start the server
npm run server          # Dev mode with nodemon
# OR
npm start              # Production mode
```

The server will start on **http://localhost:3000**

Health check endpoint:
```
GET http://localhost:3000/
```

### 2. Client Setup

```bash
# In a new terminal, navigate to client directory
cd client

# Install dependencies
npm install

# Fix vulnerabilities (optional)
npm audit fix

# Start the dev server
npm run dev
```

The client will start on **http://localhost:5173**

### 3. Verify Integration

Once both servers are running:

1. Open **http://localhost:5173** in your browser
2. The app should load the Events page
3. API calls to `http://localhost:3000/api/events` should work

## API Endpoints

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Shows
- `GET /api/shows` - List all shows
- `GET /api/shows/:id` - Get show by ID
- `GET /api/shows/event/:eventId` - Get shows for an event
- `GET /api/shows/:id/seats` - Get available seats for a show
- `POST /api/shows` - Create new show
- `PUT /api/shows/:id` - Update show
- `DELETE /api/shows/:id` - Delete show

### Bookings
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/user/:userId` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `DELETE /api/bookings/:id` - Delete booking

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/profile` - Get user profile with bookings
- `POST /api/users` - Create/update user
- `DELETE /api/users/:id` - Delete user

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/bookings/recent` - Recent bookings
- `GET /api/admin/events/stats` - Events with statistics

## Build for Production

### Server
```bash
cd server
npm install --production
npm start
```

### Client
```bash
cd client
npm run build
npm run preview  # Preview production build
```

## Environment Variables

See `.env.example` in both `server/` and `client/` directories for required variables.

### Server (.env)
```
MONGODB_URI=<your-mongodb-connection-string>
CLERK_PUBLISHABLE_KEY=<optional>
CLERK_SECRET_KEY=<optional>
CLIENT_URL=http://localhost:5173
PORT=3000
```

### Client (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_CURRENCY=₹
VITE_CLERK_PUBLISHABLE_KEY=<optional>
```

## Troubleshooting

### Server won't start
1. Check if port 3000 is already in use
2. Verify MongoDB URI is correct in `.env`
3. Check internet connection (for MongoDB Atlas)

### Client dev server issues
1. Check if port 5173 is in use
2. Clear `node_modules` and reinstall: `rm -r node_modules && npm install`
3. Clear Vite cache: `rm -r .vite`

### API calls failing
1. Verify both server and client are running
2. Check `VITE_API_URL` in client `.env` matches server URL
3. Check browser console for CORS errors

## Project Structure

```
Campus-Connect/
├── server/
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Route handlers
│   ├── routes/          # API route definitions
│   ├── configs/         # Database configuration
│   ├── server.js        # Express app entry
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Next Steps

1. Test the API endpoints using a tool like Postman or curl
2. Seed the database with sample events
3. Configure payment gateway (if using payments)
4. Set up authentication properly (Clerk or JWT)
5. Deploy to production (Vercel, Railway, Render, etc.)

---

For more details, check the project's main README.md
