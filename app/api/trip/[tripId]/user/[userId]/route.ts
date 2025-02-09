import { authenticate } from "@/lib/authMiddleware";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { tripId: string; userId: string } }
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

    const deletedUser = await prisma.tripUser.delete({
      where: {
        userId_tripId: {
          tripId: params.tripId,
          userId: params.userId,
        },
      },
    });

    return NextResponse.json(
      { message: "User deleted from trip successfully", deletedUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error deleting user from trip", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
