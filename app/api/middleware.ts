import { NextRequest, NextResponse } from "next/server";

export const authenticate = (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }

  return null; 
};

