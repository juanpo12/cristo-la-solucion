import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas que requieren autenticación de admin
  if (pathname.startsWith("/admin")) {
    // Rutas públicas del admin
    const publicAdminRoutes = ["/admin/login", "/admin/unauthorized"];

    if (publicAdminRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // Crear cliente de Supabase para middleware
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Verificar autenticación
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      // Verificar que el usuario tenga rol de admin
      const role = user.user_metadata?.role;
      if (role !== "admin" && role !== "superadmin") {
        return NextResponse.redirect(
          new URL("/admin/unauthorized", request.url)
        );
      }

      return response;
    } catch (error) {
      console.error("Error en middleware de autenticación:", error);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
