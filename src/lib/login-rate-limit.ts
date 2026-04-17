import type { NextRequest } from "next/server";

type Attempt = {
  count: number;
  windowStart: number;
  blockedUntil: number;
};

type RateLimitState = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, Attempt>();

export function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export function checkLoginRateLimit(clientKey: string): RateLimitState {
  const now = Date.now();
  const current = attempts.get(clientKey);

  if (!current) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((current.blockedUntil - now) / 1000),
      ),
    };
  }

  if (now - current.windowStart > WINDOW_MS) {
    attempts.delete(clientKey);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function registerLoginFailure(clientKey: string) {
  const now = Date.now();
  const current = attempts.get(clientKey);

  if (!current || now - current.windowStart > WINDOW_MS) {
    attempts.set(clientKey, {
      count: 1,
      windowStart: now,
      blockedUntil: 0,
    });
    return;
  }

  const nextCount = current.count + 1;
  const blockedUntil =
    nextCount >= MAX_ATTEMPTS ? now + BLOCK_MS : current.blockedUntil;

  attempts.set(clientKey, {
    count: nextCount,
    windowStart: current.windowStart,
    blockedUntil,
  });
}

export function clearLoginFailures(clientKey: string) {
  attempts.delete(clientKey);
}
