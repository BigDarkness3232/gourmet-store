import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { auth } from "@/auth"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INVENTARIO")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

  const result = await cloudinary.uploader.upload(base64, {
    folder: "gourmet-store/productos",
  })

  return NextResponse.json({ url: result.secure_url })
}