import { NextResponse, type NextRequest } from "next/server";

// Primera barrera: sin cookie de sesión → /login. La verificación criptográfica
// y de permisos se hace en el servidor en cada página/servicio.
export function middleware(req: NextRequest) {
  if (!req.cookies.get("mc_pm_sesion")) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/((?!login|_next|favicon|meridiano-isotipo|api/logout).*)"] };
