import { ProductDTO } from "@/types"
import ProductCard from "./ProductCard"

interface Props {
  products: ProductDTO[]
  title?: string
}

export default function ProductGrid({ products, title }: Props) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center text-blue-700/60">
        No hay productos disponibles.
      </div>
    )
  }

  return (
    <section>
      {title && (
        <h2 className="mb-6 text-2xl font-bold text-blue-900">{title}</h2>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}