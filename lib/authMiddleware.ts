import jwt from "jsonwebtoken";

export async function authenticate(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null; 
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { userId: string };
    return decoded.userId; 
  } catch (err) {
    return null;
  }
}