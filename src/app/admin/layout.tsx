import AdminSidebar from "@/components/admin/AdminSidebar"
import { auth } from "@/auth"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  // Si no hay sesión el middleware ya redirige, aquí solo renderizamos
  if (!session?.user) {
    return <>{children}</>
  }

  // Login page no necesita sidebar
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar role={session.user.role} name={session.user.name ?? ""} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}