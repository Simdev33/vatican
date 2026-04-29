import type { Locale } from "@/lib/i18n"

export type TicketTypeOption = {
  id: string
  label: string
}

export type TicketBreakdownItem = {
  id?: string
  label: string
  quantity: number
}

const EN_DEFAULT_TICKET_TYPE_OPTIONS: TicketTypeOption[] = [
  { id: "adult", label: "Adult" },
  { id: "child", label: "Child" },
  { id: "infant", label: "Infant" },
]

const EN_TICKET_TYPE_OPTIONS_BY_PRODUCT: Record<string, TicketTypeOption[]> = {
  louvre: EN_DEFAULT_TICKET_TYPE_OPTIONS,
  boat: EN_DEFAULT_TICKET_TYPE_OPTIONS,
  eiffel: EN_DEFAULT_TICKET_TYPE_OPTIONS,
}

const TICKET_TYPE_PRODUCT_IDS = Object.keys(EN_TICKET_TYPE_OPTIONS_BY_PRODUCT)

const TICKET_TYPE_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    adult: "Adult",
    child: "Child",
    infant: "Infant",
  },
  fr: {
    adult: "Adulte",
    child: "Enfant",
    infant: "Bébé",
  },
  de: {
    adult: "Erwachsener",
    child: "Kind",
    infant: "Kleinkind",
  },
  es: {
    adult: "Adulto",
    child: "Niño",
    infant: "Bebé",
  },
  it: {
    adult: "Adulto",
    child: "Bambino",
    infant: "Neonato",
  },
}

export function getTicketTypeOptions(productId: string, locale: Locale = "en") {
  return (EN_TICKET_TYPE_OPTIONS_BY_PRODUCT[productId] ?? EN_DEFAULT_TICKET_TYPE_OPTIONS).map((option) => ({
    ...option,
    label: TICKET_TYPE_LABELS[locale][option.id] ?? option.label,
  }))
}

export function hasTicketTypeOptions(productId: string) {
  return TICKET_TYPE_PRODUCT_IDS.includes(productId)
}
