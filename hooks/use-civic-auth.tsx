"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createCivicAuthPlugin } from "@civic/auth/nextjs"

interface CivicUser {
  walletAddress: string
  role?: "user" | "admin"
  isVerified: boolean
}

interface CivicAuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: CivicUser | null
  login: () => Promise<void>
  logout: () => Promise<void>
}

const CivicAuthContext = createContext<CivicAuthContextType | undefined>(undefined)

// Initialize Civic Auth SDK with client-side check
let civicAuth: ReturnType<typeof createCivicAuthPlugin> | null = null;

// Only initialize on the client side
if (typeof window !== "undefined") {
  civicAuth = createCivicAuthPlugin({
    clientId: process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID!,
    redirectUrl: window.location.origin,
  });
}

export function CivicAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<CivicUser | null>(null)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        if (!civicAuth) {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);

        // Check if user is already authenticated with Civic
        const isLoggedIn = await civicAuth.isLoggedIn();

        if (isLoggedIn) {
          // Get user's wallet address
          const walletAddress = await civicAuth.getWalletAddress();

          // Get verification status
          const isVerified = true; // Placeholder, would be from Civic API

          const newUser: CivicUser = {
            walletAddress,
            role: localStorage.getItem("civic_admin") === "true" ? "admin" : "user",
            isVerified,
          };

          setUser(newUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial auth check
    checkAuth();

    // Setup polling for auth changes instead of relying on events
    // This is a workaround since the new package doesn't support events
    const authCheckInterval = setInterval(async () => {
      if (!civicAuth) return;

      const isLoggedIn = await civicAuth.isLoggedIn().catch(() => false);
      
      // If auth state changed from logged out to logged in
      if (isLoggedIn && !isAuthenticated) {
        checkAuth();
      } 
      // If auth state changed from logged in to logged out
      else if (!isLoggedIn && isAuthenticated) {
        setUser(null);
        setIsAuthenticated(false);
      }
    }, 2000); // Check every 2 seconds

    return () => {
      clearInterval(authCheckInterval);
    };
  }, [isAuthenticated]);

  const login = async () => {
    if (!civicAuth) {
      throw new Error("Civic Auth not initialized (client-side only)");
    }

    setIsLoading(true);

    try {
      // Trigger Civic Auth login flow
      await civicAuth.signIn();

      // Check if login was successful
      const isLoggedIn = await civicAuth.isLoggedIn();

      if (isLoggedIn) {
        const walletAddress = await civicAuth.getWalletAddress();

        if (walletAddress) {
          const newUser: CivicUser = {
            walletAddress,
            role: localStorage.getItem("civic_admin") === "true" ? "admin" : "user",
            isVerified: true, // Placeholder, would be from Civic API
          };

          setUser(newUser);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!civicAuth) {
      throw new Error("Civic Auth not initialized (client-side only)");
    }

    try {
      // Call Civic Auth logout method
      await civicAuth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <CivicAuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </CivicAuthContext.Provider>
  );
}

export function useCivicAuth() {
  const context = useContext(CivicAuthContext);

  if (context === undefined) {
    throw new Error("useCivicAuth must be used within a CivicAuthProvider");
  }

  return context;
}