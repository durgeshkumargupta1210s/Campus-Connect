import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { APIClient, API_ENDPOINTS, LoginResponse } from "../config/api";

interface AuthContextType {
  isLoggedIn: boolean;
  userType: "student" | "admin" | "club_head" | "recruiter" | null;
  userName: string | null;
  userEmail: string | null;
  userId: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"student" | "admin" | "club_head" | "recruiter" | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load auth data from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedAuth = localStorage.getItem("authData");
    
    if (storedToken && storedAuth) {
      try {
        const { userId, name, email, role } = JSON.parse(storedAuth);
        setToken(storedToken);
        setUserId(userId);
        setUserName(name);
        setUserEmail(email);
        setUserType(role);
        setIsLoggedIn(true);
        APIClient.setToken(storedToken);
      } catch (err) {
        console.error("Failed to restore auth data:", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authData");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await APIClient.post<LoginResponse>(API_ENDPOINTS.AUTH_LOGIN, {
        email,
        password,
      });

      const { token: newToken, user } = response;
      
      // Set token
      APIClient.setToken(newToken);
      setToken(newToken);

      // Set user data
      setUserId(user.id);
      setUserName(user.name);
      setUserEmail(user.email);
      setUserType(user.role as any);
      setIsLoggedIn(true);

      // Store in localStorage
      localStorage.setItem("authToken", newToken);
      localStorage.setItem("authData", JSON.stringify({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }));
    } catch (err: any) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await APIClient.post<LoginResponse>(API_ENDPOINTS.AUTH_REGISTER, {
        name,
        email,
        password,
        role,
      });

      const { token: newToken, user } = response;
      
      // Set token
      APIClient.setToken(newToken);
      setToken(newToken);

      // Set user data
      setUserId(user.id);
      setUserName(user.name);
      setUserEmail(user.email);
      setUserType(user.role as any);
      setIsLoggedIn(true);

      // Store in localStorage
      localStorage.setItem("authToken", newToken);
      localStorage.setItem("authData", JSON.stringify({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }));
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await APIClient.post(API_ENDPOINTS.AUTH_LOGOUT, {});
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      APIClient.clearToken();
      setIsLoggedIn(false);
      setUserType(null);
      setUserName(null);
      setUserEmail(null);
      setUserId(null);
      setToken(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("authData");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userType,
        userName,
        userEmail,
        userId,
        token,
        login,
        register,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
