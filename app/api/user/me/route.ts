import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { authenticate } from "@/lib/authMiddleware";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const userId = await authenticate(req);
        if (!userId) {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, email: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}