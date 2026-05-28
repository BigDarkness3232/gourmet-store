import { prisma } from "@/lib/prisma"
import InventarioTable from "@/components/admin/InventarioTable"

async function getProductos() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })
}

export default async function InventarioPage() {
  const productos = await getProductos()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-900">Inventario</h1>
        <p className="text-blue-700/60 text-sm mt-1">Gestión de stock y precios</p>
      </div>
      <InventarioTable productos={productos} />
    </div>
  )
}