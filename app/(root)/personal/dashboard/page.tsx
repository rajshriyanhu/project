"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllTrips } from "@/hooks/use-trip-hook";
import { useHeader } from "@/hooks/useHeader";
import { formatDateString } from "@/lib/utils";
import { Trip } from "@/types";
import { Wallet, Plane, Calendar, TrendingUp } from "lucide-react";
import { useEffect } from "react";

const DashboardPage = () => {
  const { data: trips } = useGetAllTrips();
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle(
      <span className="text-xl font-semibold">
        Dashboard
      </span>
    );
  }, []);

  const totalBudget =
    trips?.reduce((acc: number, trip: Trip) => acc + trip.budget, 0) || 0;
  const totalExpenses =
    trips?.reduce((acc: number, trip: Trip) => acc + trip.totalExpenses, 0) ||
    0;
  const activeTrips =
    trips?.filter((trip: Trip) => new Date(trip.endDate) >= new Date())
      .length || 0;

  return (
    <div className="space-y-6 p-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalBudget.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalExpenses.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTrips}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trips */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trips?.slice(0, 5).map((trip: Trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">{trip.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {trip.destination}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-medium">
                    ₹{trip.totalExpenses.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateString(trip.startDate)} -{" "}
                    {formatDateString(trip.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
