import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Define the shape of the User object (matching your DB)
interface User {
  id: string;
  github_id: string;
  email: string;
  name: string;
  avatar_url: string;
  plan: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("error")) {
    console.error("Authentication failed:", params.get("error"));
  }
  checkUser();
}, []);

  const checkUser = async () => {
    try {
      // We need to set 'withCredentials: true' to send the cookie
      const { data } = await axios.get("http://localhost:3000/api/auth/me", {
        withCredentials: true,
      });
      setUser(data.user);
    } catch (error: any) {
      setUser(null);
      if (error?.response?.status !== 401) {
        console.error("Error checking user", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    // Redirect to backend auth endpoint
    window.location.href = "http://localhost:3000/api/auth/github";
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
      setUser(null);
      window.location.href = "/"; 
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
