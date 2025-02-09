"use client";

import api from "@/lib/axios";
import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { createContext, useContext } from "react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch initial token
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const res = await api.get("/auth/refresh", { withCredentials: true });
        setToken(res.data.accessToken);
      } catch (error) {
        setToken(null);
      }
    };
    fetchAccessToken();
  }, []);

  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !isRefreshing) {
          setIsRefreshing(true);
          console.log("Access token expired, attempting refresh...");
          try {
            const res = await api.get("/auth/refresh", { withCredentials: true });
            const newToken = res.data.accessToken;
            setToken(newToken);
            setIsRefreshing(false);

            error.config.headers.Authorization = `Bearer ${newToken}`;
            return api.request(error.config);
          } catch (refreshError) {
            setToken(null);
            setIsRefreshing(false);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [isRefreshing]);

  console.log(token)

  return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
}