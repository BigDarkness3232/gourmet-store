import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">

      {/* Número 404 */}
      <h1 className="text-[120px] font-black leading-none text-sky-100 select-none sm:text-[160px]">
        404
      </h1>

      {/* Contenido */}
      <div className="-mt-6 flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-blue-900">
          Página no encontrada
        </h2>
        <p className="max-w-sm text-blue-700/60">
          Lo sentimos, la página que buscas no existe o fue movida a otra dirección.
        </p>

        <div className="mt-4 flex gap-3">
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
            Ver productos
          </Link>
        </div>
      </div>

    </div>
  )
}