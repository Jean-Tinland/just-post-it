import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import jwt from "jsonwebtoken";
import {
  checkLoginRateLimit,
  clearLoginFailures,
  getClientKey,
  registerLoginFailure,
} from "@/lib/login-rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);
  const rateLimit = checkLoginRateLimit(clientKey);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many failed attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    password?: unknown;
  } | null;
  const password =
    typeof body?.password === "string" ? body.password : undefined;

  if (!password) {
    return NextResponse.json(
      { error: "Missing password" },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  if (password.length > 512) {
    return NextResponse.json(
      { error: "Password is too long" },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const pwd = process.env.PASSWORD;
  if (!pwd) {
    return NextResponse.json(
      { error: "Missing PASSWORD config" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  if (!safeEqual(password, pwd)) {
    registerLoginFailure(clientKey);
    return NextResponse.json(
      { error: "Invalid credentials" },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Missing JWT_SECRET config" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const durationDays = Number(process.env.JWT_DURATION ?? "90");
  const expiresInDays =
    Number.isFinite(durationDays) && durationDays > 0
      ? Math.trunc(durationDays)
      : 90;
  const expiresIn = expiresInDays * 24 * 60 * 60;
  const token = jwt.sign({}, secret, { expiresIn });

  clearLoginFailures(clientKey);

  return NextResponse.json(
    { token, expiresInDays },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}
