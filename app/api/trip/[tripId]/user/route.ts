import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const userId = await authenticate(req);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const data = await req.json();
    const { userId : guestUserId, role  } = data;
    const {tripId} = await params;

    if (!guestUserId || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tripUser = await prisma.tripUser.create({
        data : {
            userId: guestUserId,
            role : role,
            tripId: tripId
        }
    });
    
    return NextResponse.json(
      { message: "User added to trip successfully", tripUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding user trip", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const userId = await authenticate(req);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const {tripId} = await params;
    const users = await prisma.tripUser.findMany({
      where: {
        tripId: tripId,
      },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
