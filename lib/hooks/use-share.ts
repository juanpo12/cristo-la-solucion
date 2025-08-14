"use client"

export interface ShareableProduct {
  id: number
  name: string
  author: string
  price: number
  originalPrice?: number
  image: string
  description: string
}

export function useShare() {
  const shareProduct = async (product: ShareableProduct) => {
    const shareData = {
      title: `${product.name} - ${product.author}`,
      text: `¡Mira este increíble libro de ${product.author}! "${product.name}" - ${product.description.substring(0, 100)}...`,
      url: `${window.location.origin}/tienda?product=${product.id}`,
    }

    try {
      // Verificar si el navegador soporta Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        return { success: true, method: "native" }
      } else {
        // Fallback: copiar al portapapeles
        const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareText)
          return { success: true, method: "clipboard" }
        } else {
          // Fallback para navegadores más antiguos
          const textArea = document.createElement("textarea")
          textArea.value = shareText
          textArea.style.position = "fixed"
          textArea.style.left = "-999999px"
          textArea.style.top = "-999999px"
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          
          try {
            document.execCommand("copy")
            document.body.removeChild(textArea)
            return { success: true, method: "fallback" }
          } catch {
            document.body.removeChild(textArea)
            throw new Error("No se pudo copiar al portapapeles")
          }
        }
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
    }
  }

  const shareViaWhatsApp = (product: ShareableProduct) => {
    const message = encodeURIComponent(
      `¡Mira este increíble libro! 📚\n\n*${product.name}*\nPor: ${product.author}\n\n${product.description.substring(0, 150)}...\n\n💰 Precio: $${product.price}${product.originalPrice ? ` (antes $${product.originalPrice})` : ""}\n\n🔗 Ver más: ${window.location.origin}/tienda?product=${product.id}`
    )
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }

  const shareViaFacebook = (product: ShareableProduct) => {
    const url = encodeURIComponent(`${window.location.origin}/tienda?product=${product.id}`)
    const quote = encodeURIComponent(`${product.name} - ${product.author}`)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, "_blank")
  }

  const shareViaTwitter = (product: ShareableProduct) => {
    const text = encodeURIComponent(`¡Descubre "${product.name}" de ${product.author}! 📚 $${product.price}`)
    const url = encodeURIComponent(`${window.location.origin}/tienda?product=${product.id}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank")
  }

  const shareViaEmail = (product: ShareableProduct) => {
    const subject = encodeURIComponent(`Te recomiendo: ${product.name}`)
    const body = encodeURIComponent(
      `Hola,\n\nQuería recomendarte este libro que encontré:\n\n"${product.name}" por ${product.author}\n\n${product.description}\n\nPrecio: $${product.price}${product.originalPrice ? ` (antes $${product.originalPrice})` : ""}\n\nPuedes verlo aquí: ${window.location.origin}/tienda?product=${product.id}\n\n¡Espero que te guste!\n\nSaludos`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  return {
    shareProduct,
    shareViaWhatsApp,
    shareViaFacebook,
    shareViaTwitter,
    shareViaEmail,
  }
}