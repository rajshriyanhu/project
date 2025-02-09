import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { formatDateString } from "@/lib/utils";
import { Trip } from "@/types";
import { useRouter } from "next/navigation";

export default function TripCard({
  trip,
  index,
}: {
  trip: Trip;
  index: number;
}) {
    const router = useRouter();
  return (
    <Card className="w-[350px] relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('/trip-card/bg-${index + (1 % 4)}.jpg')`,
        }}
      />

      <div className="relative z-10">
        <CardHeader>
          <CardTitle>{trip.name}</CardTitle>
          <CardDescription>{trip.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div>
            {formatDateString(trip.startDate)} from{" "}
            {formatDateString(trip.endDate)}
          </div>
          <div>
            Your Budget -
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(trip.budget)}
          </div>
          <div>
            Current Expense -
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(trip.budget)}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button onClick={() => router.push(`/personal/trips/${trip.id}`)} variant="secondary">View Details</Button>
          <Button variant="default">Add Expense</Button>
        </CardFooter>
      </div>
    </Card>
  );
}
