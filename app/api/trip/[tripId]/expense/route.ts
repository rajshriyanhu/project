import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function POST(
  req: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const userId = await authenticate(req);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const data = await req.json();
    const { categoryId, amount, description, date, receiptUrl } = data;

    if ( !categoryId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.findUnique({ where: { id: params.tripId } });
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const tripUser = await prisma.tripUser.findFirst({
      where: { tripId: params.tripId, userId: userId },
    });
    if (!tripUser) {
      return NextResponse.json(
        { error: "User not authorized for this trip" },
        { status: 403 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        tripId : params.tripId,
        userId: userId,
        categoryId,
        amount,
        description,
        date: date ? new Date(date) : new Date(),
        receiptUrl,
      },
    });
    return NextResponse.json(
      { message: "Expense created successfully", expense },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating trip", error);
    console.error("Error creating expense", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const userId = await authenticate(req);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const expenses = await prisma.expense.findMany({
      where: {
        tripId: params.tripId,
      },
    });
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("Error fetching expenses", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
