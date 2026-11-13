import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "rs_admin_session";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "redeemysoul-admin";
}

function sign(value: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET || adminPassword();
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  const expected = adminPassword();
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function setAdminSession(): Promise<void> {
  const token = sign("admin-ok");
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  const expected = sign("admin-ok");
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
