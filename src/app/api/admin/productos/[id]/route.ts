import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INVENTARIO")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { id } = await params
  const { name, description, price, stock, featured, categoryId, image } = await req.json()

  const product = await prisma.product.update({
    where: { id },
    data:  { name, description, price, stock, featured, categoryId, image },
    include: { category: true },
  })

  return NextResponse.json({ ok: true, product })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { id } = await params

  // Verificar si tiene órdenes activas
  const activeOrders = await prisma.orderItem.count({
    where: {
      productId: id,
      order: {
        status: { notIn: ["ENTREGADO", "CANCELADO"] },
      },
    },
  })

  if (activeOrders > 0) {
    return NextResponse.json(
      { error: "No puedes eliminar un producto con órdenes activas." },
      { status: 400 }
    )
  }

  // Eliminar OrderItems primero, luego el producto
  await prisma.$transaction([
    prisma.orderItem.deleteMany({ where: { productId: id } }),
    prisma.product.delete({ where: { id } }),
  ])

  return NextResponse.json({ ok: true })
}