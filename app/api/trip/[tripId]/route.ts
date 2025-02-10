import { authenticate } from "@/lib/authMiddleware";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const userId = await authenticate(req);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const trip = await prisma.trip.findFirst({
      where: {
        id: params.tripId,
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        expenses: {
          include: {
            category: true,
          },
        },
      },
    });
    return NextResponse.json(trip, { status: 200 });
  } catch (error) {
    console.error("Error fetching trip detail", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const userId = await authenticate(req);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const tripUser = await prisma.tripUser.findFirst({
      where: {
        tripId: params.tripId,
        userId: userId,
        role: "OWNER",
      },
    });

    if (!tripUser) {
      return NextResponse.json(
        { error: "Unauthorized: Only the OWNER can update this trip" },
        { status: 403 }
      );
    }

    const data = await req.json();
    const {
      name,
      description,
      destination,
      startDate,
      endDate,
      currency,
      budget,
    } = data;

    const trip = await prisma.trip.update({
      where: {
        id: params.tripId,
      },
      data: {
        name,
        destination,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        currency,
        budget,
      },
    });

    return NextResponse.json(
      { trip, message: "Trip details updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating trip detail", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const userId = await authenticate(req);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const tripUser = await prisma.tripUser.findFirst({
      where: {
        tripId: params.tripId,
        userId: userId,
        role: "OWNER",
      },
    });

    if (!tripUser) {
      return NextResponse.json(
        { error: "Unauthorized: Only the OWNER can update this trip" },
        { status: 403 }
      );
    }

    await prisma.expense.deleteMany({
      where: {
        tripId: params.tripId,
      },
    });

    await prisma.tripUser.deleteMany({
      where: {
        tripId: params.tripId,
      },
    });

    await prisma.trip.delete({
      where: {
        id: params.tripId,
      },
    });

    return NextResponse.json(
      { message: "Trip deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting trip detail", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
