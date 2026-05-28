"use client"

import { AlertTriangle } from "lucide-react"

interface Props {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmModal({ title, message, onConfirm, onCancel, loading }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl p-6 flex flex-col items-center text-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-blue-900">{title}</h2>
          <p className="mt-1 text-sm text-blue-700/60">{message}</p>
        </div>
        <div className="flex w-full gap-3 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-sky-200 py-2.5 text-sm font-medium text-blue-800 hover:border-sky-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition disabled:opacity-60"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  )
}