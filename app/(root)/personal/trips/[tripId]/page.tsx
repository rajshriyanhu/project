"use client";

import { useDeleteTrip, useGetTripById } from "@/hooks/use-trip-hook";
import { useHeader } from "@/hooks/useHeader";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Trip } from "@/types";
import { Button } from "@/components/ui/button";
import CreateExpenseModal from "@/components/create-expense-modal";
import ExpenseList from "@/components/expense-list";
import TripDetails from "@/components/trip-details";
import AlertModal from "@/components/alert-modal";
import { useToast } from "@/hooks/use-toast";

const TripDetailsPage = () => {
  const params = useParams();
  const { data, isError, isLoading } = useGetTripById(params.tripId as string);
  const { setTitle } = useHeader();
  const [openModal, setOpenModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const { mutate: deleteTrip } = useDeleteTrip();
  const { toast } = useToast();

  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden lg:block">
            <BreadcrumbLink href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden lg:block"/>
          <BreadcrumbItem className="hidden lg:block">
            <BreadcrumbLink
              href="/personal/trips"
              className="hidden lg:block"
            >
              Trips
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden lg:block"/>
          <BreadcrumbItem>
            <BreadcrumbPage>
              {data?.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, [data]);

  if (isLoading) {
    return <>loading</>;
  }

  if (isError) {
    return <>Error</>;
  }

  const handleDeleteTrip = () => {
    deleteTrip(trip.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        toast({
          title: "Trip deleted successfully",
        });
        router.push("/personal/trips");
      },
      onError: () => {
        toast({
          title: "Something went wrong",
          description: "Trip could not be deleted",
          variant: "destructive",
        });
      },
    });
  };

  const trip = data as Trip;
  return (
    <div className="flex flex-col gap-4 px-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <span className="text-lg font-semibold capitalize">{trip.name}</span>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            className="flex-1 sm:flex-initial" 
            onClick={() => setOpenModal(true)}
          >
            Add Expense
          </Button>
          <Button
            variant="destructive"
            className="flex-1 sm:flex-initial"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Trip
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExpenseList trip={trip} />
        <TripDetails trip={trip} />
      </div>
      <CreateExpenseModal
        tripId={data.id}
        isModalOpen={openModal}
        setIsModalOpen={setOpenModal}
      />
      <AlertModal
        title="Delete Trip"
        description="Are you sure you want to delete this trip? This action cannot be undone."
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        handleDelete={handleDeleteTrip}
      />
    </div>
  );
};

export default TripDetailsPage;
