export interface WhatsAppOrderParams {
  waNumber: string
  customerName: string
  customerPhone: string
  productName: string
  variantName: string
  quantity: number
  price: string
  productUrl: string
}

export function buildWhatsAppURL(params: WhatsAppOrderParams): string {
  const message = [
    `Hi Printkul! I'd like to place an order.`,
    ``,
    `*Product:* ${params.productName}`,
    `*Variant:* ${params.variantName}`,
    `*Quantity:* ${params.quantity} pcs`,
    `*Indicative Price:* ₹${params.price}`,
    ``,
    `*Name:* ${params.customerName}`,
    `*Phone:* ${params.customerPhone}`,
    ``,
    `*Product Link:* ${params.productUrl}`,
    ``,
    `Please confirm availability and share payment details.`,
  ].join('\n')

  const encoded = encodeURIComponent(message)
  return `https://wa.me/${params.waNumber}?text=${encoded}`
}

export function buildGenericWhatsAppURL(waNumber: string, message = 'Hi Printkul! I have a question about your products.'): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${waNumber}?text=${encoded}`
}

export interface CartWhatsAppParams {
  waNumber: string
  customerName: string
  customerPhone: string
  items: {
    productName: string
    variantName: string
    quantity: number
    price: string
  }[]
}

export function buildCartWhatsAppURL(params: CartWhatsAppParams): string {
  const itemLines = params.items.map((item, i) =>
    `${i + 1}. ${item.productName} — ${item.variantName}, ${item.quantity} pcs — ₹${item.price}`
  )

  const subtotal = params.items.reduce((sum, item) => sum + parseFloat(item.price || "0"), 0)

  const message = [
    `Hi Printkul! I'd like to place an order.`,
    ``,
    `*Cart (${params.items.length} item${params.items.length > 1 ? 's' : ''}):*`,
    ...itemLines,
    ``,
    `*Subtotal:* ₹${subtotal.toLocaleString("en-IN")}`,
    ``,
    `*Name:* ${params.customerName}`,
    `*Phone:* ${params.customerPhone}`,
    ``,
    `Please confirm availability and share payment details.`,
  ].join('\n')

  const encoded = encodeURIComponent(message)
  return `https://wa.me/${params.waNumber}?text=${encoded}`
}