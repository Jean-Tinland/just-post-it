import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function check(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    throw new Error("Missing authorization");
  }

  const secret = process.env.JWT_SECRET as string;

  const decoded = jwt.verify(authorization, secret);

  if (!decoded) {
    throw new Error("Invalid token");
  }
}
