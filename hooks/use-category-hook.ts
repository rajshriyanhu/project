import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetAllCategories = () => {
    return useQuery({
      queryKey: ["allCategories"],
      queryFn: async () => {
        const response = await api.get(`/category`);
        return response.data;
      },
    });
  };