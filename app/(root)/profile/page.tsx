"use client";

import { useGetLoggedInUser } from "@/hooks/use-user-details-hook";
import { useUser } from "@/hooks/use-user-hook";
import { useHeader } from "@/hooks/useHeader";
import React, { useEffect } from "react";

export default function ProfilePage() {
  const { data } = useGetLoggedInUser();
  const { user } = useUser();
  const { setTitle, setShowBackButton, setBackUrl } = useHeader();
  useEffect(() => {
    setTitle(
      <span>
        {user?.firstName} {user?.lastName}
      </span>
    );
    setShowBackButton(true);
    setBackUrl("/");
  }, [user]);
  console.log(data)

  return <div></div>;
}
