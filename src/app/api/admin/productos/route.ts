import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { name, description, price, image, stock, featured, categoryId } = await req.json()

  if (!name || !categoryId || !image) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: { name, description, price, image, stock, featured, categoryId },
    include: { category: true },
  })

  return NextResponse.json({ ok: true, product })
}