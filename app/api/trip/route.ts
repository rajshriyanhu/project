import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function POST(req: Request) {
  try {
    const userId = await authenticate(req);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const data = await req.json();
    const { name, description, destination, startDate, endDate, currency, budget } = data;

    const trip = await prisma.trip.create({
      data: {
        name,
        destination,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        currency,
        budget,
        users: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
      include: { users: true },
    });

    return NextResponse.json({ trip }, { status: 201 });
  } catch (error) {
    console.error("Error creating trip", error);
    return NextResponse.json(
      { error: `Internal Server Error ${error}` },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
    try {
      const userId = await authenticate(req);
      if (!userId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
  
      const trips = await prisma.trip.findMany({
        where: {
          users: {
            some: {
              userId: userId, 
            },
          },
        },
        include: {
          expenses: {
            select: {
              amount: true,
            },
          },
        }
      });

      const tripsWithTotal = trips.map(trip => ({
        ...trip,
        totalExpenses: trip.expenses.reduce((sum, expense) => sum + expense.amount, 0),
        expenses: undefined, // Remove the expenses array
      }));

      return NextResponse.json(tripsWithTotal, { status: 200 });
    } catch (error) {
      console.error("Error fetching trips:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }