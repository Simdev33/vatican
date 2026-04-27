export const BOOKING_TIME_ZONE = "Europe/Paris"

function getZonedParts(date: Date, timeZone = BOOKING_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)

  const valueByType = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return {
    dateKey: `${valueByType.year}-${valueByType.month}-${valueByType.day}`,
    minutes: Number(valueByType.hour) * 60 + Number(valueByType.minute),
  }
}

function slotToMinutes(slot: string) {
  const [hours, minutes] = slot.split(":").map(Number)
  return hours * 60 + minutes
}

export function isPastBookingSlot(visitDate: string, visitTime: string, now = new Date()) {
  const current = getZonedParts(now)

  if (visitDate < current.dateKey) return true
  if (visitDate > current.dateKey) return false

  return slotToMinutes(visitTime) <= current.minutes
}

export function isPastBookingDate(visitDate: string, now = new Date()) {
  return visitDate < getZonedParts(now).dateKey
}
