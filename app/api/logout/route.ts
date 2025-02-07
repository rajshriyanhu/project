import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refreshToken")?.value; 

    if (!refreshToken) {
      return NextResponse.json({ message: "User already logged out" }, { status: 200 });
    }

    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}