import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = "GourmetStore <onboarding@resend.dev>" // Cambiar por tu dominio en producción

// ─── Helper de formato ────────────────────────────────────────
const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n)

// ─── Estilos base del email ───────────────────────────────────
const baseStyle = `
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background: #f0f9ff;
  padding: 32px 16px;
`

const cardStyle = `
  background: white;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #e0f2fe;
`

const headerStyle = `
  text-align: center;
  margin-bottom: 24px;
`

const logoStyle = `
  font-size: 24px;
  font-weight: bold;
  color: #1e3a5f;
`

const badgeStyle = (color: string) => `
  display: inline-block;
  background: ${color};
  color: white;
  border-radius: 999px;
  padding: 4px 16px;
  font-size: 13px;
  font-weight: 600;
  margin-top: 8px;
`

const btnStyle = `
  display: inline-block;
  background: #38bdf8;
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  margin-top: 24px;
`

// ─── 1. Email de confirmación de compra ───────────────────────
export async function sendOrderConfirmation(data: {
  to: string
  nombre: string
  orderId: string
  total: number
  items: { name: string; quantity: number; unitPrice: number }[]
}) {
  const itemsHtml = data.items.map((i) => `
    <tr>
      <td style="padding: 8px 0; color: #1e3a5f;">${i.name} x${i.quantity}</td>
      <td style="padding: 8px 0; color: #1e3a5f; text-align: right;">${formatPrice(i.unitPrice * i.quantity)}</td>
    </tr>
  `).join("")

  await resend.emails.send({
    from:    FROM,
    to:      data.to,
    subject: "✅ Confirmación de tu pedido — GourmetStore",
    html: `
      <div style="${baseStyle}">
        <div style="${cardStyle}">
          <div style="${headerStyle}">
            <div style="${logoStyle}">Gourmet<span style="color:#38bdf8">Store</span></div>
            <div style="${badgeStyle("#22c55e")}">✅ Pago confirmado</div>
          </div>
          <h2 style="color:#1e3a5f; margin-bottom:4px;">¡Gracias por tu compra, ${data.nombre}!</h2>
          <p style="color:#64748b; margin-top:0;">Tu pedido ha sido recibido y está siendo preparado.</p>
          <hr style="border:none; border-top:1px solid #e0f2fe; margin: 24px 0;" />
          <table style="width:100%">
            ${itemsHtml}
            <tr>
              <td style="padding-top:12px; font-weight:bold; color:#1e3a5f; border-top:1px solid #e0f2fe;">Total</td>
              <td style="padding-top:12px; font-weight:bold; color:#1e3a5f; text-align:right; border-top:1px solid #e0f2fe;">${formatPrice(data.total)}</td>
            </tr>
          </table>
          <p style="color:#64748b; font-size:13px; margin-top:24px;">N° de orden: <strong>${data.orderId}</strong></p>
          <div style="text-align:center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/mis-ordenes" style="${btnStyle}">Ver mis pedidos</a>
          </div>
        </div>
      </div>
    `,
  })
}

// ─── 2. Email pedido en camino ────────────────────────────────
export async function sendOrderShipped(data: {
  to: string
  nombre: string
  orderId: string
  direccion: string
}) {
  await resend.emails.send({
    from:    FROM,
    to:      data.to,
    subject: "📦 Tu pedido está en camino — GourmetStore",
    html: `
      <div style="${baseStyle}">
        <div style="${cardStyle}">
          <div style="${headerStyle}">
            <div style="${logoStyle}">Gourmet<span style="color:#38bdf8">Store</span></div>
            <div style="${badgeStyle("#38bdf8")}">📦 En camino</div>
          </div>
          <h2 style="color:#1e3a5f;">¡Tu pedido está en camino, ${data.nombre}!</h2>
          <p style="color:#64748b;">Nuestro repartidor está llevando tu pedido a:</p>
          <p style="background:#f0f9ff; border-radius:12px; padding:12px 16px; color:#1e3a5f; font-weight:600;">
            📍 ${data.direccion}
          </p>
          <p style="color:#64748b; font-size:13px;">N° de orden: <strong>${data.orderId}</strong></p>
          <div style="text-align:center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/mis-ordenes" style="${btnStyle}">Ver estado del pedido</a>
          </div>
        </div>
      </div>
    `,
  })
}

// ─── 3. Email pedido entregado ────────────────────────────────
export async function sendOrderDelivered(data: {
  to: string
  nombre: string
  orderId: string
}) {
  await resend.emails.send({
    from:    FROM,
    to:      data.to,
    subject: "🎉 Tu pedido fue entregado — GourmetStore",
    html: `
      <div style="${baseStyle}">
        <div style="${cardStyle}">
          <div style="${headerStyle}">
            <div style="${logoStyle}">Gourmet<span style="color:#38bdf8">Store</span></div>
            <div style="${badgeStyle("#8b5cf6")}">🎉 Entregado</div>
          </div>
          <h2 style="color:#1e3a5f;">¡Tu pedido fue entregado, ${data.nombre}!</h2>
          <p style="color:#64748b;">Esperamos que disfrutes tus productos gourmet. ¡Gracias por elegirnos!</p>
          <p style="color:#64748b; font-size:13px;">N° de orden: <strong>${data.orderId}</strong></p>
          <div style="text-align:center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/productos" style="${btnStyle}">Volver a la tienda</a>
          </div>
        </div>
      </div>
    `,
  })
}