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
      // ─── Recuperar datos de la sesión temporal ───────────────
      const sessionData = await prisma.order.findFirst({
        where: { buyOrder: response.buy_order },
      })

      // Solo crear si no existe (evitar duplicados)
      if (!sessionData) {
        // Obtener datos del checkout desde cookie temporal
        const checkoutCookie = req.cookies.get("checkout_data")?.value
        const checkoutData = checkoutCookie ? JSON.parse(checkoutCookie) : {}

        await prisma.order.create({
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
            userId:    checkoutData.userId    ?? null,
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
        })
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

      // Limpiar cookie de checkout
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