import { NextRequest, NextResponse } from "next/server"
import { WebpayPlus, Options, IntegrationApiKeys, IntegrationCommerceCodes, Environment } from "transbank-sdk"

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId } = await req.json()

    if (!amount || !orderId) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `https://${req.headers.get("host")}`
    const returnUrl = `${baseUrl}/api/webpay/confirm`

    console.log("Return URL:", returnUrl)

    const tx = new WebpayPlus.Transaction(
      new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration
      )
    )

    const response = await tx.create(
      orderId,              // buyOrder: ID único de la orden
      `session-${orderId}`, // sessionId
      amount,               // monto en pesos CLP
      returnUrl             // URL de retorno tras el pago
    )

    return NextResponse.json({
      token: response.token,
      url: response.url,
    })
  } catch (error) {
    console.error("Webpay init error:", error)
    return NextResponse.json({ error: "Error al iniciar transacción" }, { status: 500 })
  }
}