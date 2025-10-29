// src/App.jsx

import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Import Public Pages & Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Events from './pages/Events'
import EventsDetails from './pages/EventsDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'

// Import Admin Layout & Pages
// ✅ This is the corrected import for your admin layout
import AdminLayout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddEvents from './pages/admin/AddEvents'
import ListEvents from './pages/admin/ListEvents'
import ListBookings from './pages/admin/ListBookings'


const App = () => {
  // checking admin route to conditionally show public navbar/footer
  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  return (
    <>
      {/* for notifications, react-hot-toast */}
      <Toaster />

      {/* Navbar will only show when you are NOT on an admin route */}
      {!isAdminRoute && <Navbar />}

      {/* creating routes for different pages */}
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/events' element={<Events />} />
        <Route path='/events/:id' element={<EventsDetails />} />
        <Route path='/events/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/favorite' element={<Favorite />} />

        {/* ✅ Admin Routes are now correctly nested inside the AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-events" element={<AddEvents />} />
          <Route path="list-events" element={<ListEvents />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>

      {/* Footer will also not show on admin routes */}
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App