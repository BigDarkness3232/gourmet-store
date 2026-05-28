"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tag,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { Role } from "@prisma/client"

interface Props {
  role: Role
  name: string
}

const allLinks = [
  {
    href:  "/admin/dashboard",
    label: "Dashboard",
    icon:  LayoutDashboard,
    roles: ["ADMIN"] as Role[],
  },
  {
    href:  "/admin/ordenes",
    label: "Órdenes",
    icon:  ShoppingBag,
    roles: ["ADMIN", "REPARTIDOR"] as Role[],
  },
  {
    href:  "/admin/inventario",
    label: "Inventario",
    icon:  Package,
    roles: ["ADMIN", "INVENTARIO"] as Role[],
  },
  {
    href:  "/admin/usuarios",
    label: "Usuarios",
    icon:  Users,
    roles: ["ADMIN"] as Role[],
  },
  {
    href:  "/admin/categorias",
    label: "Categorías",
    icon:  Tag,
    roles: ["ADMIN"] as Role[],
  },
]

const roleLabels: Record<Role, string> = {
  ADMIN:      "Administrador",
  REPARTIDOR: "Repartidor",
  INVENTARIO: "Gestor de Inventario",
  CLIENTE:    "Cliente",
}

export default function AdminSidebar({ role, name }: Props) {
  const pathname = usePathname()
  const links = allLinks.filter((l) => l.roles.includes(role))

  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white flex flex-col">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-blue-800">
        <p className="text-lg font-bold">
          Gourmet<span className="text-sky-400">Store</span>
        </p>
        <p className="text-xs text-sky-300 mt-0.5">Panel de control</p>
      </div>

      {/* Usuario */}
      <div className="px-6 py-4 border-b border-blue-800">
        <p className="text-sm font-semibold truncate">{name}</p>
        <p className="text-xs text-sky-400 mt-0.5">{roleLabels[role]}</p>
      </div>

      {/* Links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                active
                  ? "bg-sky-500 text-white"
                  : "text-sky-100 hover:bg-blue-800"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {active && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          )
        })}
      </nav>

      {/* Cerrar sesión */}
      <div className="px-3 py-4 border-t border-blue-800">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sky-100 hover:bg-blue-800 transition"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>

    </aside>
  )
}