import { TripFormSchema } from "@/components/trip-form";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateTrip = () => {
  return useMutation({
    mutationFn: async (values: TripFormSchema) => {
      const response = await api.post("/trip", values);
      return response.data;
    },
  });
};

export const useGetAllTrips = () => {
  return useQuery({
    queryKey: ["allTrips"],
    queryFn: async () => {
      const response = await api.get(`/trip`);
      return response.data;
    },
  });
};

export const useGetTripById = (tripId: string) => {
  return useQuery({
    queryKey: [tripId],
    queryFn: async () => {
      const response = await api.get(`/trip/${tripId}`);
      return response.data;
    }
  })
}