import Link from "next/link"
import { ShieldX } from "lucide-react"

export default function SinPermisoPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <ShieldX className="h-16 w-16 text-red-400" />
      <h1 className="text-2xl font-bold text-blue-900">Sin permisos</h1>
      <p className="text-blue-700/60 max-w-sm">
        No tienes acceso a esta sección. Contacta al administrador si crees que es un error.
      </p>
      <Link
        href="/admin/dashboard"
        className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
      >
        Volver al panel
      </Link>
    </div>
  )
}