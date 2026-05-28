"use client"

import { useState, useEffect } from "react"
import { ProductDTO, CategoryDTO } from "@/types"
import ProductGrid from "@/components/products/ProductGrid"

export default function ProductosPage() {
  const [products, setProducts]         = useState<ProductDTO[]>([])
  const [categories, setCategories]     = useState<CategoryDTO[]>([])
  const [selectedCategory, setSelected] = useState<string | null>(null)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/productos").then((r) => r.json()),
      fetch("/api/categorias").then((r) => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(prods)
      setCategories(cats)
      setLoading(false)
    })
  }, [])

  const filtered = selectedCategory
    ? products.filter((p) => p.category.slug === selectedCategory)
    : products

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Todos los productos</h1>
        <p className="mt-1 text-blue-700/60">Explora nuestra selección gourmet</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setSelected(null)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            selectedCategory === null
              ? "bg-blue-900 text-white"
              : "bg-white text-blue-800 border border-sky-200 hover:border-sky-400"
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelected(cat.slug)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              selectedCategory === cat.slug
                ? "bg-blue-900 text-white"
                : "bg-white text-blue-800 border border-sky-200 hover:border-sky-400"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-blue-700/50">Cargando productos...</div>
      ) : (
        <ProductGrid products={filtered} />
      )}
    </div>
  )
}