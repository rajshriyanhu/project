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
  const { setTitle, setShowBackButton } = useHeader();
  const [openModal, setOpenModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const { mutate: deleteTrip } = useDeleteTrip();
  const { toast } = useToast();

  useEffect(() => {
    setTitle(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-lg font-semibold">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/personal/trips"
              className="text-lg font-semibold"
            >
              Trips
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-lg font-semibold capitalize">
              {data?.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    setShowBackButton(false);
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

  console.log(data);
  const trip = data as Trip;
  return (
    <div className="flex flex-col gap-4 px-2">
      <div className="flex justify-between">
        <span className="text-lg font-semibold capitalize">{trip.name}</span>
        <div className="flex gap-2">
          <Button onClick={() => setOpenModal(true)}>Add Expense</Button>
          <Button
            variant="destructive"
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
