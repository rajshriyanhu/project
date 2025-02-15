import { authenticate } from "@/lib/authMiddleware";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ tripId: string; expenseId: string }> }
) {
  try {
    const userId = await authenticate(req);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const data = await req.json();
    const { categoryId, amount, description, date, receiptUrl } = data;

    if (!categoryId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { tripId, expenseId } = await params; 

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
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
      where: { tripId: tripId, userId: userId },
    });
    if (!tripUser) {
      return NextResponse.json(
        { error: "User not authorized for this trip" },
        { status: 403 }
      );
    }

    const expense = await prisma.expense.update({
      where: {
        id: expenseId,
      },
      data: {
        amount,
        categoryId,
        description,
        date,
        receiptUrl,
      },
    });
    return NextResponse.json(
      { message: "Expense updated successfully", expense },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating expense detail", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ tripId: string; expenseId: string }> }
) {
  try {
    const userId = await authenticate(req);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { tripId, expenseId } = await params; // tripId & expenseId are now inferred as strings

    const tripUser = await prisma.tripUser.findFirst({
      where: {
        tripId,
        userId,
        role: "OWNER",
      },
    });

    if (!tripUser) {
      return NextResponse.json(
        { error: "Unauthorized: Only the OWNER can update this trip" },
        { status: 403 }
      );
    }

    const expense = await prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });

    return NextResponse.json(
      { expense, message: "Expense deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting expense detail", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
