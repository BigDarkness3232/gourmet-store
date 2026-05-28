// ─── Categoría ───────────────────────────────────────────────
export interface Category {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

// Sin fechas internas (lo que expone la API)
export type CategoryDTO = Omit<Category, "createdAt" | "updatedAt">


// ─── Producto ─────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  description: string
  price: number          // En pesos CLP (ej: 12900 = $12.900)
  image: string
  stock: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
  categoryId: string     // FK hacia Category
  category: CategoryDTO  // Relación anidada (como Prisma include)
}

// Sin fechas internas (lo que expone la API)
export type ProductDTO = Omit<Product, "createdAt" | "updatedAt">


// ─── Carrito ──────────────────────────────────────────────────
export interface CartItem {
  id: string
  productId: string
  product: ProductDTO
  quantity: number
}


// ─── Orden / Pedido ───────────────────────────────────────────
export type OrderStatus = "pendiente" | "pagado" | "enviado" | "entregado" | "cancelado"

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product: ProductDTO
  quantity: number
  unitPrice: number      // Precio al momento de la compra
}

export interface Order {
  id: string
  status: OrderStatus
  total: number
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
  // Aquí irá customerId cuando agregues autenticación
}


// ─── Webpay ───────────────────────────────────────────────────
// Lo usaremos más adelante al integrar Transbank
export interface WebpayTransaction {
  token: string
  url: string            // URL de redirección al formulario de pago
}

export interface WebpayResult {
  buyOrder: string
  sessionId: string
  amount: number
  status: "AUTHORIZED" | "FAILED" | "NULLIFIED"
  authorizationCode?: string
  cardNumber?: string    // Últimos 4 dígitos
}