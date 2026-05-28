"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, Lock } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useSession } from "next-auth/react"

interface FormData {
  nombre: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  region: string
}

const initialForm: FormData = {
  nombre: "",
  email: "",
  telefono: "",
  direccion: "",
  ciudad: "",
  region: "",
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems } = useCart()
  const { data: session } = useSession()
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(price)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
  }

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {}
    if (!form.nombre.trim())    newErrors.nombre    = "El nombre es requerido"
    if (!form.email.trim())     newErrors.email     = "El email es requerido"
    if (!form.telefono.trim())  newErrors.telefono  = "El teléfono es requerido"
    if (!form.direccion.trim()) newErrors.direccion = "La dirección es requerida"
    if (!form.ciudad.trim())    newErrors.ciudad    = "La ciudad es requerida"
    if (!form.region.trim())    newErrors.region    = "La región es requerida"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)

    try {
      const orderId = `orden-${Date.now()}`

      // Guardar datos del checkout en cookie temporal
      const checkoutData = {
        ...form,
        userId: session?.user?.id ?? null,
        items: items.map((i) => ({
          productId: i.productId,
          quantity:  i.quantity,
          unitPrice: i.product.price,
        })),
      }
      document.cookie = `checkout_data=${JSON.stringify(checkoutData)}; path=/; max-age=3600`

      const res = await fetch("/api/webpay/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice, orderId }),
      })

      const data = await res.json()

      if (!res.ok || !data.token) {
        alert("Error al iniciar el pago. Intenta nuevamente.")
        return
      }

      const form2 = document.createElement("form")
      form2.method = "POST"
      form2.action = data.url
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = "token_ws"
      input.value = data.token
      form2.appendChild(input)
      document.body.appendChild(form2)
      form2.submit()
    } catch {
      alert("Error de conexión. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-lg text-blue-800">No tienes productos en el carrito.</p>
        <Link href="/productos" className="text-sky-500 underline hover:text-sky-600">
          Ir a la tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">

      {/* Volver */}
      <Link
        href="/carrito"
        className="mb-8 inline-flex items-center gap-2 text-sm text-blue-700 hover:text-sky-500 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al carrito
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-blue-900">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Formulario */}
        <div className="flex flex-col gap-6 lg:col-span-2">

          {/* Datos personales */}
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-blue-900">Datos de contacto</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nombre completo" name="nombre"    value={form.nombre}    error={errors.nombre}    onChange={handleChange} />
              <Field label="Email"            name="email"    value={form.email}     error={errors.email}     onChange={handleChange} type="email" />
              <Field label="Teléfono"         name="telefono" value={form.telefono}  error={errors.telefono}  onChange={handleChange} type="tel" />
            </div>
          </div>

          {/* Dirección */}
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-blue-900">Dirección de entrega</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Dirección" name="direccion" value={form.direccion} error={errors.direccion} onChange={handleChange} />
              </div>
              <Field label="Ciudad"  name="ciudad" value={form.ciudad} error={errors.ciudad} onChange={handleChange} />
              <Field label="Región"  name="region" value={form.region} error={errors.region} onChange={handleChange} />
            </div>
          </div>

          {/* Método de pago */}
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-blue-900">Método de pago</h2>
            <div className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
              <CreditCard className="h-5 w-5 text-sky-500" />
              <span className="text-sm font-medium text-blue-800">Webpay Plus — Tarjetas de crédito y débito</span>
              <Lock className="ml-auto h-4 w-4 text-sky-400" />
            </div>
            <p className="mt-2 text-xs text-blue-700/50">
              Serás redirigido al portal seguro de Transbank para completar el pago.
            </p>
          </div>

        </div>

        {/* Resumen */}
        <div className="h-fit rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-blue-900">Resumen</h2>

          <div className="flex flex-col gap-2 text-sm text-blue-700">
            {items.map(({ id, product, quantity }) => (
              <div key={id} className="flex justify-between">
                <span className="line-clamp-1 max-w-[160px]">{product.name} x{quantity}</span>
                <span>{formattedPrice(product.price * quantity)}</span>
              </div>
            ))}
          </div>

          <div className="my-4 border-t border-sky-100" />

          <div className="flex flex-col gap-2 text-sm text-blue-700">
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} productos)</span>
              <span>{formattedPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="text-sky-500 font-medium">Por calcular</span>
            </div>
          </div>

          <div className="my-4 border-t border-sky-100" />

          <div className="flex justify-between font-bold text-blue-900">
            <span>Total</span>
            <span>{formattedPrice(totalPrice)}</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Lock className="h-4 w-4" />
            {loading ? "Redirigiendo a Webpay..." : "Pagar con Webpay"}
          </button>

          <p className="mt-3 text-center text-xs text-blue-700/40">
            Pago 100% seguro con Transbank
          </p>
        </div>

      </div>
    </div>
  )
}

// ─── Componente campo reutilizable ────────────────────────────
interface FieldProps {
  label: string
  name: string
  value: string
  error?: string
  type?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function Field({ label, name, value, error, type = "text", onChange }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-blue-800">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`rounded-xl border px-3 py-2 text-sm text-blue-900 outline-none transition focus:ring-2 focus:ring-sky-300 ${
          error ? "border-red-400 bg-red-50" : "border-sky-200 bg-sky-50"
        }`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}