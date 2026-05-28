import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where:   { id },
    include: { category: true },
  })

  if (!product) {
    return { title: "Producto no encontrado" }
  }

  return {
    title:       product.name,
    description: product.description,
    openGraph: {
      title:       `${product.name} — GourmetStore`,
      description: product.description,
      images:      [{ url: product.image, alt: product.name }],
    },
  }
}