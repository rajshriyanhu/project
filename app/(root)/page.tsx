"use client";

import { useHeader } from "@/hooks/useHeader";
import { useEffect } from "react";

export default function Home() {
  const { setTitle } = useHeader();
  useEffect(() => {
    setTitle(<span className="">Dynamic Page Title</span>);
  }, []);
  
  return <div>Home Page</div>;
}
