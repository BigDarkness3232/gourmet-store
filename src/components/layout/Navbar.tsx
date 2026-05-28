"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X, User, LogOut, Package, LayoutDashboard } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { useSession, signOut } from "next-auth/react"

const links = [
  { label: "Inicio",    href: "/" },
  { label: "Productos", href: "/productos" },
]

export default function Navbar() {
  const { totalItems }      = useCart()
  const { data: session }   = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)

  const isCliente = session?.user.role === "CLIENTE"
  const isPanel   = ["ADMIN", "REPARTIDOR", "INVENTARIO"].includes(session?.user.role ?? "")

  const panelHref =
    session?.user.role === "REPARTIDOR" ? "/admin/ordenes" :
    session?.user.role === "INVENTARIO" ? "/admin/inventario" :
    "/admin/dashboard"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-semibold tracking-tight text-blue-900">
          Gourmet<span className="text-sky-400">Store</span>
        </Link>

        {/* Links escritorio */}
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-blue-800 transition hover:text-sky-500">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-4">

          {/* Botón panel para admin/repartidor/inventario */}
          {isPanel && (
            <Link
              href={panelHref}
              className="hidden md:flex items-center gap-1.5 rounded-xl border border-blue-800 px-3 py-1.5 text-sm font-semibold text-blue-800 hover:bg-blue-900 hover:text-white transition"
            >
              <LayoutDashboard className="h-4 w-4" />
              Panel
            </Link>
          )}

          {/* Carrito */}
          <Link href="/carrito" className="relative">
            <ShoppingCart className="h-6 w-6 text-blue-800 transition hover:text-sky-500" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Usuario */}
          {session && isCliente ? (
            <div className="relative">
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 rounded-xl border border-sky-200 px-3 py-1.5 text-sm font-medium text-blue-800 hover:border-sky-400 transition"
              >
                <User className="h-4 w-4 text-sky-400" />
                {session.user.name?.split(" ")[0]}
              </button>

              {userMenu && (
                <div className="absolute right-0 top-10 z-50 w-48 rounded-xl border border-sky-100 bg-white shadow-lg overflow-hidden">
                  <Link
                    href="/mis-ordenes"
                    onClick={() => setUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-blue-800 hover:bg-sky-50 transition"
                  >
                    <Package className="h-4 w-4 text-sky-400" />
                    Mis pedidos
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-50 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : !session ? (
            <Link
              href="/login"
              className="rounded-xl bg-sky-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-sky-600 transition"
            >
              Ingresar
            </Link>
          ) : null}

          {/* Hamburguesa móvil */}
          <button className="md:hidden text-blue-800" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="border-t border-sky-100 bg-white md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-4 py-3 text-sm font-medium text-blue-800 hover:bg-sky-50 hover:text-sky-500"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {!session && (
            <Link
              href="/login"
              className="block px-4 py-3 text-sm font-semibold text-sky-500 hover:bg-sky-50"
              onClick={() => setMenuOpen(false)}
            >
              Ingresar
            </Link>
          )}
        </div>
      )}
    </header>
  )
}