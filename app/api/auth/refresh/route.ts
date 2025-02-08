import jwt from "jsonwebtoken";
import {prisma} from "@/lib/prisma";
import { generateAccessToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export async function GET() {
  
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refreshToken")?.value; 
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }
  if (!refreshToken) return NextResponse.json({ error: "No refresh token" }, { status: 401 });

  const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!storedToken)  return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string };
    const newAccessToken = generateAccessToken(decoded.userId);
    return NextResponse.json({
      accessToken: newAccessToken
    }, {
      status: 200
    })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}