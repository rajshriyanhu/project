import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Button } from "./ui/button";
import { useGetAllCategories } from "@/hooks/use-category-hook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useCreateExpense, useUpdateExpense } from "@/hooks/use-expense-hook";
import { useToast } from "@/hooks/use-toast";
import { Expense } from "@/types";

const expenseFormSchema = z.object({
  category: z.string(),
  description: z.string().min(1, "Expense description is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
});

export type expenseFormType = z.infer<typeof expenseFormSchema>;

export default function CreateExpenseModal({
  expense,
  tripId,
  isModalOpen,
  setIsModalOpen,
}: {
  expense?: Expense;
  tripId: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data, isLoading } = useGetAllCategories();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const { mutateAsync: createExpense, isPending } = useCreateExpense();
  const { mutateAsync: updateExpense, isPending: isUpdating } =
    useUpdateExpense();

  const { toast } = useToast();
  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof expenseFormSchema>) {
    console.log(values);
    if (expense) {
      await updateExpense({
        amount: values.amount,
        categoryId: values.category,
        description: values.description,
        expenseId: expense.id,
        tripId: tripId,
      })
        .then(() => {
          setIsModalOpen(false);
          toast({
            title: "Expense updated successfully",
          });
          form.reset();
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Error",
            description: "Something went wrong",
            variant: "destructive",
          });
        });
        return;
    }
    await createExpense({
      amount: values.amount,
      categoryId: values.category,
      description: values.description,
      tripId: tripId,
    })
      .then(() => {
        setIsModalOpen(false);
        toast({
          title: "Expense Created",
        });
        form.reset();
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      });
  }

  useEffect(() => {
    if (data) setCategories(data);
  }, [data, isLoading]);

  useEffect(() => {
    if (expense) {
      form.setValue("description", expense.description);
      form.setValue("category", expense.categoryId);
      form.setValue("amount", expense.amount);
    }
  }, [expense]);

  console.log(categories);
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {expense ? "Edit Expense" : "Add a new Expense"}{" "}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category for your expense" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value !== undefined && field.value !== null
                          ? `₹${new Intl.NumberFormat("en-IN").format(
                              field.value
                            )}`
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/₹|,/g, ""); // Remove ₹ and commas

                        // Allow only numbers
                        if (/^\d*$/.test(value)) {
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }
                      }}
                      onBlur={() => {
                        // If field value is NaN or invalid, reset it
                        if (isNaN(field.value)) {
                          field.onChange(undefined);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isPending || isUpdating} type="submit">
                {expense ? "Save" : "Create Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
