import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { firstName, lastName, email, passwordHash },
    });

    if (!user || !user.id) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: { userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });

    const headers = setRefreshTokenCookie(refreshToken);

    return new NextResponse(
      JSON.stringify({
        message: "User registered successfully",
        accessToken,
        user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
      }),
      {
        status: 201,
        headers,
      }
    );
  } catch (error) {
      console.log("Error in signup:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}