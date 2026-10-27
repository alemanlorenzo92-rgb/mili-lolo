import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "mili_lolo_session";

function getSecretKey(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.trim().length === 0) {
    return null;
  }
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir archivos estáticos y recursos internos de Next.js
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/public") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const secretKey = getSecretKey();
  let isAuthenticated = false;

  if (token && secretKey) {
    try {
      await jwtVerify(token, secretKey, { algorithms: ["HS256"] });
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  const isAuthRoute = pathname === "/login" || pathname === "/setup";

  // Login y setup siguen siendo públicas (evita bucles de redirección si el JWT tiene firma válida pero la fila Session fue revocada o expiró)
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Si no está autenticado y quiere ingresar a contenido privado
  if (!isAuthenticated) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto recursos estáticos
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
