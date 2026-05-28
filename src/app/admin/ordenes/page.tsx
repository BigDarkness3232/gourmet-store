import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import OrdenesTable from "@/components/admin/OrdenesTable"

async function getOrdenes() {
  return prisma.order.findMany({
    include: {
      items: { include: { product: true } },
      user:  true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function OrdenesPage() {
  const [ordenes, session] = await Promise.all([getOrdenes(), auth()])
  const role = session?.user.role ?? "REPARTIDOR"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-900">Órdenes</h1>
        <p className="text-blue-700/60 text-sm mt-1">Gestión y seguimiento de pedidos</p>
      </div>
      <OrdenesTable ordenes={ordenes} role={role} />
    </div>
  )
}