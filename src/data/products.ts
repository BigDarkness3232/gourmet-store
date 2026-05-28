import { ProductDTO, CategoryDTO } from "@/types"

// ─── Categorías ───────────────────────────────────────────────
export const categories: CategoryDTO[] = [
  { id: "1", name: "Aceites & Vinagretas", slug: "aceites" },
  { id: "2", name: "Conservas",            slug: "conservas" },
  { id: "3", name: "Quesos & Embutidos",   slug: "quesos" },
  { id: "4", name: "Dulces & Mermeladas",  slug: "dulces" },
]

// ─── Helper para encontrar categoría ──────────────────────────
const getCategory = (slug: string): CategoryDTO =>
  categories.find((c) => c.slug === slug)!

// ─── Productos ────────────────────────────────────────────────
export const products: ProductDTO[] = [
  {
    id: "1",
    name: "Aceite de Oliva Extra Virgen",
    description: "Aceite de oliva premium de primera prensada en frío, cosecha temprana. Sabor intenso con notas frutales.",
    price: 12900,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500",
    stock: 20,
    featured: true,
    categoryId: "1",
    category: getCategory("aceites"),
  },
  {
    id: "2",
    name: "Vinagre Balsámico de Módena",
    description: "Vinagre balsámico IGP envejecido 12 años. Perfecto para ensaladas y carnes.",
    price: 9900,
    image: "https://images.unsplash.com/photo-1556909114-44e3e9399a2b?w=500",
    stock: 15,
    featured: true,
    categoryId: "1",
    category: getCategory("aceites"),
  },
  {
    id: "3",
    name: "Mermelada de Higos con Nueces",
    description: "Elaborada artesanalmente con higos frescos y nueces seleccionadas. Sin conservantes.",
    price: 6900,
    image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500",
    stock: 30,
    featured: true,
    categoryId: "4",
    category: getCategory("dulces"),
  },
  {
    id: "4",
    name: "Queso Manchego Curado",
    description: "Queso manchego D.O.P. curado 6 meses. Elaborado con leche pura de oveja manchega.",
    price: 15900,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500",
    stock: 10,
    featured: true,
    categoryId: "3",
    category: getCategory("quesos"),
  },
  {
    id: "5",
    name: "Conserva de Tomates Secos",
    description: "Tomates secos en aceite de oliva con hierbas mediterráneas. Ideal para pastas y pizzas.",
    price: 5900,
    image: "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=500",
    stock: 25,
    featured: false,
    categoryId: "2",
    category: getCategory("conservas"),
  },
  {
    id: "6",
    name: "Paté de Pato con Trufa",
    description: "Paté artesanal de pato con trufa negra. Textura suave y sabor sofisticado.",
    price: 11900,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500",
    stock: 12,
    featured: false,
    categoryId: "3",
    category: getCategory("quesos"),
  },
  {
    id: "7",
    name: "Miel de Flores Silvestres",
    description: "Miel pura de flores silvestres, recolectada de forma artesanal. Sin procesar ni pasteurizar.",
    price: 7900,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500",
    stock: 18,
    featured: false,
    categoryId: "4",
    category: getCategory("dulces"),
  },
  {
    id: "8",
    name: "Alcachofas en Conserva",
    description: "Corazones de alcachofa seleccionados y conservados en aceite de oliva virgen extra.",
    price: 6400,
    image: "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=500",
    stock: 22,
    featured: false,
    categoryId: "2",
    category: getCategory("conservas"),
  },
]

// ─── Helpers de consulta (simulan queries de Prisma) ──────────
export const getFeaturedProducts = (): ProductDTO[] =>
  products.filter((p) => p.featured)

export const getProductsByCategory = (slug: string): ProductDTO[] =>
  products.filter((p) => p.category.slug === slug)

export const getProductById = (id: string): ProductDTO | undefined =>
  products.find((p) => p.id === id)