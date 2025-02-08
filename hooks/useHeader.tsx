'use client';

import { createContext, ReactNode, useContext, useState } from "react";

interface HeaderContextType {
  showBackButton: boolean;
  backUrl: string;
  title: ReactNode;
  setShowBackButton: (show: boolean) => void;
  setBackUrl: (url: string) => void;
  setTitle: (title: ReactNode) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [showBackButton, setShowBackButton] = useState(false);
  const [backUrl, setBackUrl] = useState("/");
  const [title, setTitle] = useState<ReactNode>(null);

  return (
    <HeaderContext.Provider
      value={{ showBackButton, backUrl, title, setShowBackButton, setBackUrl, setTitle }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};