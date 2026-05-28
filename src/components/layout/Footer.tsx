import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-sky-200 bg-blue-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">

          {/* Marca */}
          <div>
            <p className="text-lg font-semibold">
              Gourmet<span className="text-sky-400">Store</span>
            </p>
            <p className="mt-2 text-sm text-sky-200">
              Productos gourmet seleccionados con pasión y calidad.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-sky-400">Tienda</p>
            <ul className="space-y-2 text-sm text-sky-100">
              <li><Link href="/productos" className="hover:text-white transition">Todos los productos</Link></li>
              <li><Link href="/carrito" className="hover:text-white transition">Mi carrito</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-sky-400">Contacto</p>
            <ul className="space-y-2 text-sm text-sky-100">
              <li>contacto@gourmetstore.cl</li>
              <li>+56 9 1234 5678</li>
            </ul>
          </div>

        </div>

        <div className="mt-10 border-t border-blue-800 pt-6 text-center text-xs text-sky-300">
          © {new Date().getFullYear()} GourmetStore. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}