import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "./lib/locales";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = (locales as readonly string[]).some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
