import { auth } from "@/auth"
import { NextResponse } from "next/server"

const roleRoutes: Record<string, string[]> = {
  "/admin/dashboard":  ["ADMIN"],
  "/admin/ordenes":    ["ADMIN", "REPARTIDOR"],
  "/admin/inventario": ["ADMIN", "INVENTARIO"],
  "/admin/usuarios":   ["ADMIN"],
  "/admin/categorias": ["ADMIN"],
}

const publicAdminRoutes = ["/admin/login", "/admin/sin-permiso"]

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Rutas públicas del admin — dejar pasar siempre
  if (publicAdminRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  // Sin sesión → login
  if (!req.auth?.user) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  const role = req.auth.user.role ?? ""

  // Redirigir /admin según rol
  if (pathname === "/admin") {
    if (role === "REPARTIDOR") return NextResponse.redirect(new URL("/admin/ordenes", req.url))
    if (role === "INVENTARIO") return NextResponse.redirect(new URL("/admin/inventario", req.url))
    return NextResponse.redirect(new URL("/admin/dashboard", req.url))
  }

  // Verificar permisos por ruta
  for (const [route, roles] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(route) && !roles.includes(role)) {
      return NextResponse.redirect(new URL("/admin/sin-permiso", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}