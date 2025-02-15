'use client';

import TripCard from "@/components/trip-card";
import { useGetAllTrips } from "@/hooks/use-trip-hook";
import { useHeader } from "@/hooks/useHeader";
import { Trip } from "@/types";
import { useEffect } from "react";

export default function TripPage() {
  const { setTitle } = useHeader();
  const {data, isLoading, isError} = useGetAllTrips();
    useEffect(() => {
      setTitle(
        <span className="text-xl font-semibold">
          Manage your trips 
        </span>
      );
    }, []);

  if(isLoading){
    return <>loading</>
  }

  if(isError){
    return <>Error</>
  }
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {
        data.map((trip : Trip, index: number) => {
          return <TripCard trip={trip} index={index} key={trip.id} />
        })
      }
      
    </div>
  )
}
