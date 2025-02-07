import { LoginFormSchema } from "@/components/login-form";
import { SignUpFormSchema } from "@/components/signup-form";
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (values: SignUpFormSchema) => {
      const response = await api.post("/auth/signup", values);
      return response.data;
    },
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (values: LoginFormSchema) => {
      const response = await api.post("/auth/login", values);
      return response.data;
    },
  });
};

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/logout");
      return response.data;
    },
  });
}
