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
    const { name} = data;

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category", error);
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
  
      const categories = await prisma.category.findMany({
        where: {
        },
      });
      return NextResponse.json(categories, { status: 200 });
    } catch (error) {
      console.error("Error fetching categories", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }