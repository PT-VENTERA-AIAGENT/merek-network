import { NextRequest, NextResponse } from "next/server";
import { getBrandByHost } from "@/lib/brands";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const brand = getBrandByHost(host);

  const res = NextResponse.next();
  res.headers.set("x-brand-id", brand.id);
  res.headers.set("x-brand-host", host);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
