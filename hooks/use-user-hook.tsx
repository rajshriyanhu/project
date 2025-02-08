'use client';

import { useState, useEffect } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

const USER_STORAGE_KEY = "user_data";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const saveUser = (userData: User) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const clearUser = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  return { user, saveUser, clearUser };
};