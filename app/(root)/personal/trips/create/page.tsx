"use client";

import TripForm from "@/components/trip-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHeader } from "@/hooks/useHeader";
import { useEffect } from "react";

const CreatetripPage = () => {
  const { setTitle, setShowBackButton } = useHeader();
  useEffect(() => {
    setTitle(<span className="text-xl font-semibold">Create a new trip</span>);
    setShowBackButton(false);
  }, []);

  return (
    <div className="h-min-screen sm:w-full md:w-1/2 mx-auto">
      <Card className="">
        <CardHeader>
          <CardTitle>Create Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <TripForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatetripPage;
