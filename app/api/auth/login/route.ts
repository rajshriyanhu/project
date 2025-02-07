import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
  
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
  
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const headers = setRefreshTokenCookie(refreshToken)

    await prisma.refreshToken.create({
      data: { userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });

    return new NextResponse(
      JSON.stringify({
        message: "User logged in successfully",
        accessToken,
        user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
      console.log("Error in signup:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}