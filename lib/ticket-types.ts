import type { Locale } from "@/lib/i18n"

export type TicketTypeOption = {
  id: string
  label: string
}

export type TicketBreakdownItem = {
  id?: string
  label: string
  quantity: number
  unitPrice?: number
  totalPrice?: number
}

const EN_DEFAULT_TICKET_TYPE_OPTIONS: TicketTypeOption[] = [
  { id: "adult-18", label: "Adult (18+)" },
  { id: "child-under-18", label: "Child (Under 18yrs)" },
]

const EN_TICKET_TYPE_OPTIONS_BY_PRODUCT: Record<string, TicketTypeOption[]> = {
  louvre: EN_DEFAULT_TICKET_TYPE_OPTIONS,
  boat: EN_DEFAULT_TICKET_TYPE_OPTIONS,
  eiffel: [
    { id: "adult-25", label: "Adult (25+)" },
    { id: "young-12-24", label: "Young (12-24 years old)" },
    { id: "children-4-11", label: "Children (4-11 years old)" },
    { id: "small-children-under-4", label: "Small children (Younger than 4 years old)" },
  ],
}

const TICKET_TYPE_PRODUCT_IDS = Object.keys(EN_TICKET_TYPE_OPTIONS_BY_PRODUCT)

const TICKET_TYPE_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    "adult-18": "Adult (18+)",
    "child-under-18": "Child (Under 18yrs)",
    "adult-25": "Adult (25+)",
    "young-12-24": "Young (12-24 years old)",
    "children-4-11": "Children (4-11 years old)",
    "small-children-under-4": "Small children (Younger than 4 years old)",
  },
  fr: {
    "adult-18": "Adulte (18+)",
    "child-under-18": "Enfant (moins de 18 ans)",
    "adult-25": "Adulte (25+)",
    "young-12-24": "Jeune (12-24 ans)",
    "children-4-11": "Enfant (4-11 ans)",
    "small-children-under-4": "Jeune enfant (moins de 4 ans)",
  },
  de: {
    "adult-18": "Erwachsener (18+)",
    "child-under-18": "Kind (unter 18 Jahren)",
    "adult-25": "Erwachsener (25+)",
    "young-12-24": "Jugendlicher (12-24 Jahre)",
    "children-4-11": "Kinder (4-11 Jahre)",
    "small-children-under-4": "Kleinkinder (unter 4 Jahren)",
  },
  es: {
    "adult-18": "Adulto (18+)",
    "child-under-18": "Niño (menor de 18 años)",
    "adult-25": "Adulto (25+)",
    "young-12-24": "Joven (12-24 años)",
    "children-4-11": "Niños (4-11 años)",
    "small-children-under-4": "Niños pequeños (menores de 4 años)",
  },
  it: {
    "adult-18": "Adulto (18+)",
    "child-under-18": "Bambino (meno di 18 anni)",
    "adult-25": "Adulto (25+)",
    "young-12-24": "Giovane (12-24 anni)",
    "children-4-11": "Bambini (4-11 anni)",
    "small-children-under-4": "Bambini piccoli (meno di 4 anni)",
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
