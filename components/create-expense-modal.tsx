import {
  Dialog,
  DialogContent,
  DialogDescription,
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

const expenseFormSchema = z.object({
  category: z.string().min(1, "Expense name is required"),
  description: z.string().min(1, "Expense description is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
});

export type expenseFormType = z.infer<typeof expenseFormSchema>;

export default function CreateExpenseModal({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof expenseFormSchema>) {
    console.log(values);
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new Expense </DialogTitle>
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
                        let value = e.target.value.replace(/₹|,/g, ""); // Remove ₹ and commas

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
                <Button variant='outline' type='button'>Cancel</Button>
              <Button type="submit">Create Expense</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
