import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Workshops from "./pages/Workshops";
import Placements from "./pages/Placements";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminAddEvent from "./pages/AdminAddEvent";
import AdminAddOpportunity from "./pages/AdminAddOpportunity";
import EventDetails from "./pages/EventDetails";
import PaymentCheckout from "./pages/PaymentCheckout";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyPayments from "./pages/MyPayments";
import MyTickets from "./pages/MyTickets";
import OpportunityDetail from "./pages/OpportunityDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateAccountNow from "./pages/CreateAccountNow";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import ClubDetail from "./pages/ClubDetail";
import JoinClub from "./pages/JoinClub";
import AdminAddClub from "./pages/AdminAddClub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-account" element={<CreateAccountNow />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route 
            path="/event/:eventId/checkout" 
            element={
              <ProtectedRoute requiredUserType="user">
                <PaymentCheckout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/event/:eventId/payment-success" 
            element={
              <ProtectedRoute requiredUserType="user">
                <PaymentSuccess />
              </ProtectedRoute>
            } 
          />
          <Route path="/hackathons" element={<Events />} />
          <Route path="/hackathons/:eventId" element={<EventDetails />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/workshops/:eventId" element={<EventDetails />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/opportunities" element={<Placements />} />
          <Route path="/resume-analysis" element={<ResumeAnalysis />} />
          <Route path="/opportunity/:id" element={<OpportunityDetail />} />
          <Route path="/community" element={<Community />} />
          <Route path="/club/:id" element={<ClubDetail />} />
          <Route path="/club/:id/join" element={<JoinClub />} />
          <Route path="/resources" element={<Resources />} />

          {/* User Routes - Protected */}
          <Route 
            path="/my-payments" 
            element={
              <ProtectedRoute requiredUserType="user">
                <MyPayments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-tickets" 
            element={
              <ProtectedRoute requiredUserType="user">
                <MyTickets />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user" 
            element={
              <ProtectedRoute requiredUserType="user">
                <UserDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes - Protected */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredUserType="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredUserType="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/add-event" 
            element={
              <ProtectedRoute requiredUserType="admin">
                <AdminAddEvent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/edit-event/:id" 
            element={
              <ProtectedRoute requiredUserType="admin">
                <AdminAddEvent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/add-opportunity" 
            element={
              <ProtectedRoute requiredUserType="admin">
                <AdminAddOpportunity />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/add-club" 
            element={
              <ProtectedRoute requiredUserType="admin">
                <AdminAddClub />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/edit-club/:id" 
            element={
              <ProtectedRoute requiredUserType="admin">
                <AdminAddClub />
              </ProtectedRoute>
            } 
          />

          {/* Catch All - 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
