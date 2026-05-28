import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authService } from "../main";
import { Toaster } from "react-hot-toast";

import type {
  AppContextType,
  User,
  LocationData,
} from "../type";

// ================= CONTEXT =================

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

// ================= PROVIDER =================

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const [isAuth, setIsAuth] = useState(false);

  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState<LocationData | null>(null);

  const [loadingLocation, setLoadingLocation] = useState(false);

  const [city, setCity] = useState("Fetching Location...");

  // ================= FETCH USER =================

  async function fetchUser() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get(
        `${authService}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(data);

      setIsAuth(true);
    } catch (error) {
      console.log(error);

      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  // ================= USE EFFECT =================

  useEffect(() => {
    fetchUser();
  }, []);

  // ================= RETURN =================

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        isAuth,
        setUser,
        setIsAuth,
        setLoading,
        location,
        loadingLocation,
        city,
      }}
    >
      {children}

      <Toaster />
    </AppContext.Provider>
  );
};

// ================= CUSTOM HOOK =================

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppData must be used within AppProvider");
  }

  return context;
};