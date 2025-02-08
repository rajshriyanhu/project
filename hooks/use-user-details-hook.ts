import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useGetLoggedInUser() {
    return useQuery({
      queryKey: ["loggedInUser"],
      queryFn: async () => {
        const response = await api.get(`/user/me`);
        return response.data;
      },
    });
  }