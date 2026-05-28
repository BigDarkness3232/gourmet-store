import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { name, slug } = await req.json()

  if (!name || !slug) {
    return NextResponse.json({ error: "Nombre y slug son requeridos" }, { status: 400 })
  }

  const exists = await prisma.category.findUnique({ where: { slug } })
  if (exists) {
    return NextResponse.json({ error: "Ya existe una categoría con ese slug" }, { status: 400 })
  }

  const category = await prisma.category.create({
    data: { name, slug },
    include: { _count: { select: { products: true } } },
  })

  return NextResponse.json({ ok: true, category })
}