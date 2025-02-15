'use client'

import { useTheme } from "next-themes";
import React from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      onClick={() => {
        if (theme === "light") setTheme("dark");
        else setTheme("light");
      }}
      variant='outline'
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-gray-600" />
      ) : (
        <Sun className="h-5 w-5 text-gray-400" />
      )}
    </Button>
  );
};

export default ThemeToggle;