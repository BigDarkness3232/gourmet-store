"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { useCart } from "@/context/CartContext"

function ExitoContent() {
  const params = useSearchParams()
  const { clearCart } = useCart()

  const orderId   = params.get("orderId") ?? ""
  const amount    = Number(params.get("amount") ?? 0)
  const authCode  = params.get("authCode") ?? ""
  const cardLast4 = params.get("cardLast4") ?? ""

  useEffect(() => {
    clearCart()
  }, [clearCart])

  const formattedAmount = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(amount)

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />

      <h1 className="text-3xl font-bold text-blue-900 mb-2">¡Pago exitoso!</h1>
      <p className="text-blue-700/60 mb-8">Tu pedido ha sido procesado correctamente.</p>

      <div className="w-full max-w-sm rounded-2xl border border-sky-100 bg-white p-6 shadow-sm text-left">
        <h2 className="font-bold text-blue-900 mb-4">Detalle del pago</h2>
        <div className="flex flex-col gap-3 text-sm text-blue-800">
          <div className="flex justify-between">
            <span className="text-blue-700/60">N° de orden</span>
            <span className="font-medium">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700/60">Monto pagado</span>
            <span className="font-medium">{formattedAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700/60">Código autorización</span>
            <span className="font-medium">{authCode}</span>
          </div>
          {cardLast4 && (
            <div className="flex justify-between">
              <span className="text-blue-700/60">Tarjeta</span>
              <span className="font-medium">**** {cardLast4}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
        >
          Volver al inicio
        </Link>
        <Link
          href="/productos"
          className="rounded-xl border border-sky-200 px-6 py-3 font-semibold text-blue-800 transition hover:border-sky-400"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}

export default function ExitoPage() {
  return (
    <Suspense>
      <ExitoContent />
    </Suspense>
  )
}