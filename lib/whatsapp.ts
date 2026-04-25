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