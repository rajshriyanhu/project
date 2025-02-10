import { TripFormSchema } from "@/components/trip-form";
import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripId: string) => {
      const response = await api.delete(`/trip/${tripId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTrips'] });
    },
  });
};