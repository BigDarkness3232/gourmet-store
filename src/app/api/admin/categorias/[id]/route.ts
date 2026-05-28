import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { id } = await params
  const { name, slug } = await req.json()

  const category = await prisma.category.update({
    where: { id },
    data:  { name, slug },
    include: { _count: { select: { products: true } } },
  })

  return NextResponse.json({ ok: true, category })
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

  const count = await prisma.product.count({ where: { categoryId: id } })
  if (count > 0) {
    return NextResponse.json(
      { error: "No puedes eliminar una categoría con productos asociados" },
      { status: 400 }
    )
  }

  await prisma.category.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}