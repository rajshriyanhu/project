"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { useCreateTrip } from "@/hooks/use-trip-hook";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
  destination: z.string().min(2).max(50),
  startDate: z.date(),
  endDate: z.date(),
  currency: z.string(),
  budget: z.number(),
});

export type TripFormSchema = z.infer<typeof formSchema>;

export default function TripForm() {
  const {mutateAsync: createTrip, isPending} = useCreateTrip();
  const {toast} = useToast();
  const router = useRouter();
  const [calendarOpen1, setCalendarOpen1] = useState(false);
  const [calendarOpen2, setCalendarOpen2] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      destination: "",
      currency: "INR",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    await createTrip(values)
    .then((res) => {
      toast({
        title: 'Trip created successfully!'
      })
      router.push('/personal/trips')
    })
    .catch((err) => {
      toast({
        title: 'Something went wrong',
        description: err,
        variant: 'destructive'
      })
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Date of Trip</FormLabel>
              <div className="border rounded-md w-full">
                <Popover open={calendarOpen1} onOpenChange={setCalendarOpen1}>
                  <PopoverTrigger className="w-full" asChild>
                    <FormControl>
                      <Button variant="ghost">
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick start date</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      captionLayout="dropdown-buttons"
                      fromYear={1980}
                      toYear={2100}
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setCalendarOpen1(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ending Date of Trip</FormLabel>
              <div className="border rounded-md w-full">
                <Popover open={calendarOpen2} onOpenChange={setCalendarOpen2}>
                  <PopoverTrigger className="w-full" asChild>
                    <FormControl>
                      <Button variant="ghost">
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick end date</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      captionLayout="dropdown-buttons"
                      fromYear={1980}
                      toYear={2100}
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setCalendarOpen2(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
                <FormLabel>
                  Estimated Budget (₹)
                </FormLabel>
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
        <Button disabled={isPending} type="submit">Submit</Button>
      </form>
    </Form>
  );
}
