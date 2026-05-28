import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // ─── Usuarios ─────────────────────────────────────────────
  const adminPass     = await bcrypt.hash("admin1234", 10)
  const repartPass    = await bcrypt.hash("repart1234", 10)
  const inventPass    = await bcrypt.hash("invent1234", 10)

  await prisma.user.upsert({
    where:  { email: "admin@gourmet.cl" },
    update: {},
    create: { name: "Admin",      email: "admin@gourmet.cl",     password: adminPass,  role: "ADMIN" },
  })

  await prisma.user.upsert({
    where:  { email: "repartidor@gourmet.cl" },
    update: {},
    create: { name: "Repartidor", email: "repartidor@gourmet.cl", password: repartPass, role: "REPARTIDOR" },
  })

  await prisma.user.upsert({
    where:  { email: "inventario@gourmet.cl" },
    update: {},
    create: { name: "Inventario", email: "inventario@gourmet.cl", password: inventPass, role: "INVENTARIO" },
  })

  // ─── Categorías ───────────────────────────────────────────
  const cats = [
    { name: "Aceites & Vinagretas", slug: "aceites" },
    { name: "Conservas",            slug: "conservas" },
    { name: "Quesos & Embutidos",   slug: "quesos" },
    { name: "Dulces & Mermeladas",  slug: "dulces" },
  ]

  for (const cat of cats) {
    await prisma.category.upsert({
      where:  { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // ─── Productos ────────────────────────────────────────────
  const aceites   = await prisma.category.findUnique({ where: { slug: "aceites" } })
  const conservas = await prisma.category.findUnique({ where: { slug: "conservas" } })
  const quesos    = await prisma.category.findUnique({ where: { slug: "quesos" } })
  const dulces    = await prisma.category.findUnique({ where: { slug: "dulces" } })

  const products = [
    { name: "Aceite de Oliva Extra Virgen",  description: "Primera prensada en frío, cosecha temprana.",         price: 12900, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500", stock: 20, featured: true,  categoryId: aceites!.id },
    { name: "Vinagre Balsámico de Módena",   description: "Envejecido 12 años, perfecto para ensaladas.",        price:  9900, image: "https://images.unsplash.com/photo-1556909114-44e3e9399a2b?w=500", stock: 15, featured: true,  categoryId: aceites!.id },
    { name: "Mermelada de Higos con Nueces", description: "Artesanal, sin conservantes.",                        price:  6900, image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500", stock: 30, featured: true,  categoryId: dulces!.id },
    { name: "Queso Manchego Curado",         description: "D.O.P. curado 6 meses, leche de oveja manchega.",     price: 15900, image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500", stock: 10, featured: true,  categoryId: quesos!.id },
    { name: "Conserva de Tomates Secos",     description: "En aceite de oliva con hierbas mediterráneas.",       price:  5900, image: "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=500", stock: 25, featured: false, categoryId: conservas!.id },
    { name: "Paté de Pato con Trufa",        description: "Artesanal con trufa negra, textura suave.",           price: 11900, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500", stock: 12, featured: false, categoryId: quesos!.id },
    { name: "Miel de Flores Silvestres",     description: "Recolectada artesanalmente, sin procesar.",           price:  7900, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500", stock: 18, featured: false, categoryId: dulces!.id },
    { name: "Alcachofas en Conserva",        description: "Corazones en aceite de oliva virgen extra.",          price:  6400, image: "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=500", stock: 22, featured: false, categoryId: conservas!.id },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where:  { id: p.name },
      update: { price: p.price, stock: p.stock },
      create: p,
    })
  }

  console.log("✅ Seed completado")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())