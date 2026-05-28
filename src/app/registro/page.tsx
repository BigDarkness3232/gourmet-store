"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react"

export default function RegistroPage() {
  const router = useRouter()
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" })
  const [showPass, setShowPass] = useState(false)
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)

    const res = await fetch("/api/auth/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? "Error al registrarse")
      setLoading(false)
      return
    }

    // Login automático tras registro
    await signIn("credentials", {
      email:    form.email,
      password: form.password,
      redirect: false,
    })

    router.push("/mis-ordenes")
    router.refresh()
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-sky-100 bg-white p-8 shadow-sm">

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-blue-900">Crear cuenta</h1>
          <p className="mt-1 text-sm text-blue-700/60">Regístrate para hacer seguimiento de tus pedidos</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field icon={<User className="h-4 w-4 text-sky-400" />}
            label="Nombre completo" name="name" value={form.name}
            placeholder="Juan Pérez" onChange={handleChange} />

          <Field icon={<Mail className="h-4 w-4 text-sky-400" />}
            label="Email" name="email" value={form.email} type="email"
            placeholder="tu@email.com" onChange={handleChange} />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-blue-800">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-400" />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                className="w-full rounded-xl border border-sky-200 bg-sky-50 py-2 pl-9 pr-10 text-sm text-blue-900 outline-none focus:ring-2 focus:ring-sky-300"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Field icon={<Lock className="h-4 w-4 text-sky-400" />}
            label="Confirmar contraseña" name="confirm" value={form.confirm}
            type="password" placeholder="Repite tu contraseña" onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-sky-500 py-3 font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-blue-700/60">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-sky-500 hover:text-sky-600">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

function Field({ icon, label, name, value, type = "text", placeholder, onChange }: {
  icon: React.ReactNode; label: string; name: string; value: string
  type?: string; placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-blue-800">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
        <input
          type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder} required
          className="w-full rounded-xl border border-sky-200 bg-sky-50 py-2 pl-9 pr-3 text-sm text-blue-900 outline-none focus:ring-2 focus:ring-sky-300"
        />
      </div>
    </div>
  )
}