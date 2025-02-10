import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateExpenseRequest {
  tripId: string;
  categoryId: string;
  amount: number;
  description: string;
}

export interface UpdateExpenseRequest {
  tripId: string;
  expenseId: string;
  categoryId: string;
  amount: number;
  description: string;
}

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: CreateExpenseRequest) => {
      const request = {
        categoryId: values.categoryId,
        amount: values.amount,
        description: values.description,
      };
      const response = await api.post(
        `/trip/${values.tripId}/expense`,
        request
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [variables.tripId]
      });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: UpdateExpenseRequest) => {
      const request = {
        categoryId: values.categoryId,
        amount: values.amount,
        description: values.description,
      };
      const response = await api.patch(
        `/trip/${values.tripId}/expense/${values.expenseId}`,
        request
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [variables.tripId]
      });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, expenseId }: { tripId: string; expenseId: string }) => {
      const response = await api.delete(
        `/trip/${tripId}/expense/${expenseId}`
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [variables.tripId],
      });
    },
  });
};

