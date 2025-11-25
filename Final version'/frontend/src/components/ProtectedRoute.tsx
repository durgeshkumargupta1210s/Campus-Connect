import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType: 'user' | 'admin' | null;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredUserType }) => {
  const { isLoggedIn, userType } = useAuth();

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check access based on required user type
  let hasAccess = true;
  
  if (requiredUserType === 'user') {
    // 'user' means any logged-in user (student, admin, etc. can all make payments)
    hasAccess = isLoggedIn;
  } else if (requiredUserType === 'admin') {
    // Only admins can access
    hasAccess = userType === 'admin';
  } else if (requiredUserType === null) {
    // No restriction - any logged-in user
    hasAccess = isLoggedIn;
  }
  
  // If user doesn't have access, show access denied
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-background flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center py-12">
            <div className="flex justify-center mb-6">
              <div className="bg-red-500/20 p-4 rounded-lg">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              {requiredUserType === 'admin' 
                ? "This page is only accessible to administrators. Please contact support if you believe this is an error."
                : "This page is only accessible to registered users. Please log in with a regular account."}
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => window.location.href = '/'}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
              <Button
                onClick={() => window.location.href = '/login'}
                variant="outline"
                className="w-full"
              >
                Switch Account
              </Button>
            </div>
            
            <div className="mt-8 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm text-muted-foreground">
                Current role: <span className="font-semibold text-foreground capitalize">{userType || 'None'}</span>
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // User has required permissions
  return <>{children}</>;
};

export default ProtectedRoute;
