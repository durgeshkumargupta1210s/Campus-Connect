import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Events from './pages/Events'
import EventsDetails from './pages/EventsDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import {Toaster} from 'react-hot-toast'
import Footer from './components/Footer'
import { Layout } from 'lucide-react'
import Dashboard from './pages/admin/Dashboard'
import AddEvents from './pages/admin/AddEvents'
import ListEvents from './pages/admin/ListEvents'
import ListBookings from './pages/admin/ListBookings'

const App = () => {
  // checking admin route
  const isAdminRoute=useLocation().pathname.startsWith('/admin')

  return (
    <>
    {/* for notifications,react-hot-toast */}
    <Toaster/>
    {/* navbar already made in components and only see when you are not on admin route means you are on user route */}
    {!isAdminRoute && <Navbar/>}
      {/* crating routes for different pages */}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/events' element={<Events/>}/>
        <Route path='/events/:id' element={<EventsDetails/>}/>
        <Route path='/events/:id/:date' element={<SeatLayout/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
        <Route path='/favorite' element={<Favorite/>}/>
        <Route path='/admin/*' element={<Layout/>}/>
        <Route index element={<Dashboard/>}/>
        <Route path='add-events'  element={<AddEvents/>}/>
        <Route path='list-events' element={<ListEvents/>}/>
        <Route path='list-bookings' element={<ListBookings/>}/>

      </Routes>
      {/* same as it will also not show when admin path */}
       {!isAdminRoute && <Footer/>}



    </>
  )
}

export default App 