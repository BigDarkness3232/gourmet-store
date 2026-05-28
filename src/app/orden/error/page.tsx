"use client"

import { useSearchParams, Suspense } from "next/navigation"
import Link from "next/link"
import { XCircle } from "lucide-react"

const reasons: Record<string, string> = {
  rejected:      "Tu pago fue rechazado por el banco. Puedes intentarlo con otra tarjeta.",
  token_missing: "Hubo un problema con la sesión de pago. Por favor intenta nuevamente.",
  server_error:  "Ocurrió un error interno. Por favor intenta más tarde.",
}

function ErrorContent() {
  const params = useSearchParams()
  const reason = params.get("reason") ?? "server_error"
  const message = reasons[reason] ?? reasons["server_error"]

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <XCircle className="h-16 w-16 text-red-400 mb-4" />

      <h1 className="text-3xl font-bold text-blue-900 mb-2">Pago no completado</h1>
      <p className="text-blue-700/60 mb-8 max-w-sm">{message}</p>

      <div className="flex gap-4">
        <Link
          href="/checkout"
          className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
        >
          Intentar nuevamente
        </Link>
        <Link
          href="/carrito"
          className="rounded-xl border border-sky-200 px-6 py-3 font-semibold text-blue-800 transition hover:border-sky-400"
        >
          Volver al carrito
        </Link>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  )
}