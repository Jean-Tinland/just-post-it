import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export class AuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
  }
}

export function check(request: NextRequest) {
  const token =
    parseAuthorization(request.headers.get("authorization")) ||
    request.cookies.get("token")?.value;

  if (!token) {
    throw new AuthError("Missing authorization");
  }

  try {
    checkToken(token);
  } catch {
    throw new AuthError("Invalid token");
  }
}

export function checkToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT secret");
  }

  jwt.verify(token, secret, { algorithms: ["HS256"] });
}

function parseAuthorization(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const bearerPrefix = "Bearer ";
  if (trimmed.startsWith(bearerPrefix)) {
    const token = trimmed.slice(bearerPrefix.length).trim();
    return token || null;
  }

  return trimmed;
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}
