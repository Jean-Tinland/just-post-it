import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!password) {
    return NextResponse.json({ error: "Missing password" }, { status: 401 });
  }

  const pwd = process.env.PASSWORD as string;

  if (password !== pwd) {
    return NextResponse.json({ error: "Wrong password" }, { status: 500 });
  }

  const secret = process.env.JWT_SECRET as string;
  const expiresIn = `${process.env.JWT_DURATION}d`;
  const token = jwt.sign({}, secret, { expiresIn });

  return NextResponse.json({ token });
}
