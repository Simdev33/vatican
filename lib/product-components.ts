export const PRODUCT_COMPONENTS: Record<string, string[]> = {
  louvre: ["louvre"],
  eiffel: ["eiffel"],
  boat: ["boat"],
  "louvre-boat-eiffel": ["louvre", "boat", "eiffel"],
  "louvre-eiffel": ["louvre", "eiffel"],
  "eiffel-boat": ["eiffel", "boat"],
}

export function getProductComponentIds(productId: string) {
  return PRODUCT_COMPONENTS[productId] ?? [productId]
}
