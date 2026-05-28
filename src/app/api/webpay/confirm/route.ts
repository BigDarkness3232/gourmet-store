import { NextRequest, NextResponse } from "next/server"
import { WebpayPlus, Options, IntegrationApiKeys, IntegrationCommerceCodes, Environment } from "transbank-sdk"
import { prisma } from "@/lib/prisma"
import { sendOrderConfirmation } from "@/lib/email"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token_ws")

    if (!token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/orden/error?reason=token_missing`
      )
    }

    const tx = new WebpayPlus.Transaction(
      new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration
      )
    )

    const response = await tx.commit(token)

    if (response.response_code === 0) {
      const sessionData = await prisma.order.findFirst({
        where: { buyOrder: response.buy_order },
      })

      if (!sessionData) {
        const checkoutCookie = req.cookies.get("checkout_data")?.value
        const checkoutData = checkoutCookie ? JSON.parse(checkoutCookie) : {}

        // Verificar si el userId existe en la BD
        let validUserId = null
        if (checkoutData.userId) {
          const userExists = await prisma.user.findUnique({
            where: { id: checkoutData.userId },
          })
          validUserId = userExists ? checkoutData.userId : null
        }

        const order = await prisma.order.create({
          data: {
            buyOrder:  response.buy_order,
            status:    "PAGADO",
            total:     response.amount,
            authCode:  response.authorization_code,
            cardLast4: response.card_detail?.card_number ?? "",
            nombre:    checkoutData.nombre    ?? "Cliente",
            email:     checkoutData.email     ?? "",
            telefono:  checkoutData.telefono  ?? "",
            direccion: checkoutData.direccion ?? "",
            ciudad:    checkoutData.ciudad    ?? "",
            region:    checkoutData.region    ?? "",
            userId:    validUserId,
            items: {
              create: (checkoutData.items ?? []).map((item: {
                productId: string
                quantity: number
                unitPrice: number
              }) => ({
                productId: item.productId,
                quantity:  item.quantity,
                unitPrice: item.unitPrice,
              })),
            },
          },
          include: { items: { include: { product: true } } },
        })

        if (order.email) {
          await sendOrderConfirmation({
            to:      order.email,
            nombre:  order.nombre,
            orderId: order.buyOrder,
            total:   order.total,
            items:   order.items.map((i) => ({
              name:      i.product.name,
              quantity:  i.quantity,
              unitPrice: i.unitPrice,
            })),
          })
        }
      }

      const params = new URLSearchParams({
        status:    "success",
        orderId:   response.buy_order,
        amount:    response.amount.toString(),
        authCode:  response.authorization_code,
        cardLast4: response.card_detail?.card_number ?? "",
      })

      const res = NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/orden/exito?${params}`
      )

      res.cookies.delete("checkout_data")
      return res
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/orden/error?reason=rejected`
    )
  } catch (error) {
    console.error("Webpay confirm error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/orden/error?reason=server_error`
    )
  }
}