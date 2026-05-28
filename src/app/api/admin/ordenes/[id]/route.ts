import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { sendOrderShipped, sendOrderDelivered } from "@/lib/email"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const role = session.user.role
  if (role !== "ADMIN" && role !== "REPARTIDOR") {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { id } = await params
  const { status } = await req.json()

  const validStatuses = ["PENDIENTE", "PAGADO", "EN_CAMINO", "ENTREGADO", "CANCELADO"]
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
  }

  const order = await prisma.order.update({
    where: { id },
    data:  { status },
    include: { user: true },
  })

  // Enviar email según nuevo estado
  if (order.email) {
    if (status === "EN_CAMINO") {
      await sendOrderShipped({
        to:       order.email,
        nombre:   order.nombre,
        orderId:  order.buyOrder,
        direccion: `${order.direccion}, ${order.ciudad}, ${order.region}`,
      })
    } else if (status === "ENTREGADO") {
      await sendOrderDelivered({
        to:      order.email,
        nombre:  order.nombre,
        orderId: order.buyOrder,
      })
    }
  }

  return NextResponse.json({ ok: true, order })
}