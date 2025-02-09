"use client";

import { useGetTripById } from "@/hooks/use-trip-hook";
import { useHeader } from "@/hooks/useHeader";
import { useParams } from "next/navigation";
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


const TripDetailsPage = () => {
  const params = useParams();
  const { data, isError, isLoading } = useGetTripById(params.tripId as string);
  const { setTitle, setShowBackButton, setBackUrl } = useHeader();
  const [openModal, setOpenModal] = useState(false);

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

  console.log(data);
  return (
    <div className="flex flex-col gap-4 px-2">
      <div className="flex justify-between">
        <span className="text-lg font-semibold capitalize">
          {(data as Trip).name}
        </span>
        <Button onClick={() => setOpenModal(true)}>Add Expense</Button>
      </div>
      <div></div>

      <CreateExpenseModal
        isModalOpen={openModal}
        setIsModalOpen={setOpenModal}
      />
    </div>
  );
};

export default TripDetailsPage;
