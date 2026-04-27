export const TIME_SLOTS = [
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
]

function inRange(slot: string, start: string, end: string) {
  return slot >= start && slot <= end
}

const LOUVRE_TIME_SLOTS = TIME_SLOTS.filter((slot) => inRange(slot, "09:30", "16:00"))
const EIFFEL_TIME_SLOTS = TIME_SLOTS.filter((slot) => inRange(slot, "10:00", "22:00"))

export function getTimeSlotsForProduct(productId: string) {
  if (productId === "louvre") {
    return LOUVRE_TIME_SLOTS
  }

  if (productId === "eiffel") {
    return EIFFEL_TIME_SLOTS
  }

  return TIME_SLOTS
}
