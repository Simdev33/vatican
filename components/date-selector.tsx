"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { isPastBookingSlot } from "@/lib/booking-time"
import { getTimeSlotsForProduct } from "@/lib/time-slots"
import { getTicketTypeOptions, type TicketBreakdownItem, type TicketTypeOption } from "@/lib/ticket-types"
import type { ProductAvailability } from "@/lib/availability"

const ADULT_TICKET_TYPE_ID = "adult"

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function TicketTypeSelector({
  productId,
  options,
  getQuantity,
  onQuantityChange,
  showError,
  title,
  errorMessage,
}: {
  productId: string
  options: TicketTypeOption[]
  getQuantity: (productId: string, typeId: string) => number
  onQuantityChange: (productId: string, typeId: string, quantity: number) => void
  showError: boolean
  title: string
  errorMessage: string
}) {
  return (
    <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
        {title}
      </p>
      <div className="space-y-2">
        {options.map((option) => {
          const quantity = getQuantity(productId, option.id)
          const minQuantity = option.id === ADULT_TICKET_TYPE_ID ? 1 : 0
          const canDecrease = quantity > minQuantity

          return (
            <div key={`${productId}-${option.id}`} className="flex items-center justify-between gap-3 text-sm text-gray-700">
              <span className="min-w-0 flex-1">{option.label}</span>
              <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => onQuantityChange(productId, option.id, quantity - 1)}
                  disabled={!canDecrease}
                  aria-label={`Decrease ${option.label}`}
                  className="flex h-9 w-9 items-center justify-center rounded-l-lg text-lg font-semibold text-[#1a365d] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-white"
                >
                  -
                </button>
                <span className="flex h-9 w-10 items-center justify-center border-x border-gray-100 text-sm font-semibold text-[#1a365d]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onQuantityChange(productId, option.id, quantity + 1)}
                  aria-label={`Increase ${option.label}`}
                  className="flex h-9 w-9 items-center justify-center rounded-r-lg text-lg font-semibold text-[#1a365d] transition-colors hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>
      {showError && (
        <p className="mt-2 text-xs font-medium text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

interface DateSelectorProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date | undefined) => void
  selectedTicket: {
    id: string
    title: string
    price: number
    ticketTypePrices?: Record<string, number>
    category: "Entry Ticket" | "River Cruise" | "Combo Ticket"
  } | null
  selectedComponents?: Array<{
    id: string
    title: string
    price: number
    ticketTypePrices?: Record<string, number>
    category: "Entry Ticket" | "River Cruise" | "Combo Ticket"
  }>
  selectedTime: string
  onTimeSelect: (time: string) => void
  availability?: ProductAvailability
  availabilityByProduct?: Record<string, ProductAvailability | undefined>
}

export function DateSelector({
  selectedDate,
  onDateSelect,
  selectedTicket,
  selectedComponents = [],
  selectedTime,
  onTimeSelect,
  availability,
  availabilityByProduct = {},
}: DateSelectorProps) {
  const { locale, t } = useLanguage()
  const [currentMonth, setCurrentMonth] = React.useState(() => new Date())
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [emailConfirmation, setEmailConfirmation] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [submitAttempted, setSubmitAttempted] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitMessage, setSubmitMessage] = React.useState<string | null>(null)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [comboSchedule, setComboSchedule] = React.useState<
    Record<string, { visitDate: string; visitTime: string }>
  >({})
  const [comboMonths, setComboMonths] = React.useState<Record<string, Date>>({})
  const [ticketQuantities, setTicketQuantities] = React.useState<Record<string, Record<string, number>>>({})
  const isComboSelection = selectedComponents.length > 1
  const isSelectedCruise = selectedTicket?.category === "River Cruise"
  const selectedTicketTimeSlots = selectedTicket ? getTimeSlotsForProduct(selectedTicket.id) : []

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const prevMonthDays = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    0
  ).getDate()

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (newDate >= today) {
      onDateSelect(newDate)
    }
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    )
  }

  const isToday = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date.toDateString() === today.toDateString()
  }

  const isPast = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date < today
  }

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const monthName = currentMonth.toLocaleString(locale, { month: "long", year: "numeric" })
  const formattedSelectedPrice = selectedTicket ? selectedTicket.price.toFixed(2).replace(".", ",") : null
  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : null
  const closedDaySet = React.useMemo(
    () => new Set(availability?.closedDays ?? []),
    [availability?.closedDays],
  )
  const closedSlotSet = React.useMemo(
    () => new Set(selectedDateKey ? availability?.closedSlots[selectedDateKey] ?? [] : []),
    [availability?.closedSlots, selectedDateKey],
  )
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const hasFullName = /\S+\s+\S+/.test(fullName.trim())
  const isEmailValid = emailRegex.test(email.trim())
  const doEmailsMatch =
    email.trim() !== "" &&
    emailConfirmation.trim() !== "" &&
    email.trim().toLowerCase() === emailConfirmation.trim().toLowerCase()
  const showNameError = submitAttempted && !hasFullName
  const showEmailError = submitAttempted && !isEmailValid
  const showEmailConfirmationError =
    submitAttempted
      ? emailConfirmation.trim() === "" || !doEmailsMatch
      : false
  const clearContactErrors = () => {
    setSubmitAttempted(false)
    setSubmitError(null)
  }
  React.useEffect(() => {
    setComboSchedule({})
    setComboMonths({})
    onDateSelect(undefined)
    onTimeSelect("")
  }, [onDateSelect, onTimeSelect, selectedTicket?.id])

  const updateComboSchedule = (productId: string, field: "visitDate" | "visitTime", value: string) => {
    setComboSchedule((current) => ({
      ...current,
      [productId]: {
        visitDate: current[productId]?.visitDate ?? "",
        visitTime: current[productId]?.visitTime ?? "",
        [field]: value,
        ...(field === "visitDate" ? { visitTime: "" } : {}),
      },
    }))
  }

  const isComboDayClosed = (productId: string, date: string) => {
    return availabilityByProduct[productId]?.closedDays.includes(date) ?? false
  }

  const isComboSlotClosed = (productId: string, date: string, slot: string) => {
    return availabilityByProduct[productId]?.closedSlots[date]?.includes(slot) ?? false
  }

  const isUnavailablePastSlot = (date: string | null | undefined, slot: string) => {
    return date ? isPastBookingSlot(date, slot) : false
  }

  const needsTimeSlot = (category: "Entry Ticket" | "River Cruise" | "Combo Ticket") => {
    return category !== "River Cruise"
  }

  const getTicketTypeQuantity = (productId: string, typeId: string) => {
    return ticketQuantities[productId]?.[typeId] ?? (typeId === ADULT_TICKET_TYPE_ID ? 1 : 0)
  }

  const getTicketTypeTotal = (productId: string) => {
    return getTicketTypeOptions(productId, locale).reduce(
      (total, option) => total + getTicketTypeQuantity(productId, option.id),
      0,
    )
  }

  const getTicketBreakdown = (productId: string): TicketBreakdownItem[] => {
    return getTicketTypeOptions(productId, locale).map((option) => ({
      id: option.id,
      label: option.label,
      quantity: getTicketTypeQuantity(productId, option.id),
    }))
  }

  const updateTicketTypeQuantity = (productId: string, typeId: string, quantity: number) => {
    const minQuantity = typeId === ADULT_TICKET_TYPE_ID ? 1 : 0
    const nextQuantity = Math.max(minQuantity, Math.floor(quantity))
    setTicketQuantities((current) => ({
      ...current,
      [productId]: {
        ...(current[productId] ?? {}),
        [typeId]: nextQuantity,
      },
    }))
    setSubmitAttempted(false)
    setSubmitError(null)
  }

  const getComboMonth = (productId: string) => {
    const scheduledDate = comboSchedule[productId]?.visitDate

    if (comboMonths[productId]) {
      return comboMonths[productId]
    }

    if (scheduledDate) {
      const [year, month] = scheduledDate.split("-").map(Number)
      return new Date(year, month - 1, 1)
    }

    return new Date(today.getFullYear(), today.getMonth(), 1)
  }

  const changeComboMonth = (productId: string, offset: number) => {
    const month = getComboMonth(productId)
    setComboMonths((current) => ({
      ...current,
      [productId]: new Date(month.getFullYear(), month.getMonth() + offset, 1),
    }))
  }

  const selectComboDate = (productId: string, date: Date) => {
    if (date < today) return

    const dateKey = formatDateKey(date)

    if (isComboDayClosed(productId, dateKey)) return

    updateComboSchedule(productId, "visitDate", dateKey)
    setComboMonths((current) => ({
      ...current,
      [productId]: new Date(date.getFullYear(), date.getMonth(), 1),
    }))
  }

  const getCalendarCells = (month: Date) => {
    const year = month.getFullYear()
    const monthIndex = month.getMonth()
    const daysCount = new Date(year, monthIndex + 1, 0).getDate()
    const firstDay = new Date(year, monthIndex, 1).getDay()
    const cells: Array<Date | null> = []

    for (let index = 0; index < firstDay; index++) {
      cells.push(null)
    }

    for (let day = 1; day <= daysCount; day++) {
      cells.push(new Date(year, monthIndex, day))
    }

    while (cells.length % 7 !== 0) {
      cells.push(null)
    }

    return cells
  }

  const hasCompleteSelection =
    !!selectedTicket &&
    (isComboSelection
      ? selectedComponents.every((component) => {
          const schedule = comboSchedule[component.id]
          return (
            schedule?.visitDate &&
            (!needsTimeSlot(component.category) || schedule?.visitTime) &&
            !isComboDayClosed(component.id, schedule.visitDate) &&
            (!needsTimeSlot(component.category) ||
              (!isComboSlotClosed(component.id, schedule.visitDate, schedule.visitTime) &&
                !isUnavailablePastSlot(schedule.visitDate, schedule.visitTime)))
          )
        })
      : !!selectedDate &&
        (isSelectedCruise || (!!selectedTime && !isUnavailablePastSlot(selectedDateKey, selectedTime))))
  const hasCompleteTicketBreakdown =
    !!selectedTicket &&
    (isComboSelection
      ? selectedComponents.every((component) => getTicketTypeTotal(component.id) > 0)
      : getTicketTypeTotal(selectedTicket.id) > 0)
  const canCompletePurchase =
    hasCompleteSelection &&
    hasCompleteTicketBreakdown &&
    hasFullName &&
    isEmailValid &&
    doEmailsMatch

  const handleOrderSubmit = async () => {
    setSubmitAttempted(true)
    setSubmitMessage(null)
    setSubmitError(null)

    const firstComboSchedule = isComboSelection
      ? comboSchedule[selectedComponents[0]?.id ?? ""]
      : null
    const firstComboComponent = isComboSelection ? selectedComponents[0] : null

    if (
      !canCompletePurchase ||
      !selectedTicket ||
      !hasCompleteTicketBreakdown ||
      (!isComboSelection && (!selectedDateKey || (!isSelectedCruise && !selectedTime))) ||
      (isComboSelection &&
        (!firstComboSchedule?.visitDate ||
          (firstComboComponent && needsTimeSlot(firstComboComponent.category) && !firstComboSchedule.visitTime)))
    ) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedTicket.id,
          visitDate: isComboSelection ? firstComboSchedule?.visitDate : selectedDateKey,
          visitTime: isComboSelection ? firstComboSchedule?.visitTime : isSelectedCruise ? "" : selectedTime,
          customerName: fullName,
          customerEmail: email,
          customerPhone: phoneNumber,
          locale,
          ticketBreakdown: isComboSelection ? undefined : getTicketBreakdown(selectedTicket.id),
          items: isComboSelection
            ? selectedComponents.map((component) => ({
                productId: component.id,
                visitDate: comboSchedule[component.id]?.visitDate,
                visitTime:
                  component.category === "River Cruise"
                    ? ""
                    : comboSchedule[component.id]?.visitTime,
                ticketBreakdown: getTicketBreakdown(component.id),
              }))
            : undefined,
        }),
      })
      const result = (await response.json()) as {
        ok: boolean
        message?: string
        orderId?: string
        orderNumber?: string
        checkoutUrl?: string
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.message ?? "Could not complete the order.")
      }

      setSubmitMessage(t.booking.redirecting)
      setSubmitAttempted(false)
      setFullName("")
      setEmail("")
      setEmailConfirmation("")
      setPhoneNumber("")
      window.location.href = result.checkoutUrl ?? `/thank-you?order=${encodeURIComponent(result.orderNumber ?? "")}`
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not complete the order.")
    } finally {
      setIsSubmitting(false)
    }
  }

  React.useEffect(() => {
    if (selectedDateKey && closedDaySet.has(selectedDateKey)) {
      onDateSelect(undefined)
      onTimeSelect("")
      return
    }

    if (selectedTime && (closedSlotSet.has(selectedTime) || isUnavailablePastSlot(selectedDateKey, selectedTime))) {
      onTimeSelect("")
    }
  }, [closedDaySet, closedSlotSet, onDateSelect, onTimeSelect, selectedDateKey, selectedTime])

  React.useEffect(() => {
    setComboSchedule((current) => {
      let changed = false
      const next = { ...current }

      for (const component of selectedComponents) {
        const schedule = current[component.id]

        if (
          schedule?.visitDate &&
          schedule.visitTime &&
          (isComboDayClosed(component.id, schedule.visitDate) ||
            isComboSlotClosed(component.id, schedule.visitDate, schedule.visitTime) ||
            isUnavailablePastSlot(schedule.visitDate, schedule.visitTime))
        ) {
          next[component.id] = { ...schedule, visitTime: "" }
          changed = true
        }
      }

      return changed ? next : current
    })
  }, [availabilityByProduct, selectedComponents])

  // Calculate days to render
  const days: Array<{ day: number; isCurrentMonth: boolean; isPrevMonth?: boolean }> = []
  
  // Previous month days
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isCurrentMonth: false, isPrevMonth: true })
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true })
  }
  
  // Next month days to complete the grid (6 rows)
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ day: i, isCurrentMonth: false })
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-[#1a365d] px-5 py-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-[#d4a853]" />
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">
            {t.booking.selectDate}
          </h3>
        </div>
        {formattedSelectedPrice && (
          <span className="rounded-full bg-[#d4a853] px-2.5 py-1 text-xs font-bold text-[#1a365d]">
            {formattedSelectedPrice}&euro;
          </span>
        )}
      </div>

      <div className="p-5">
        {!isComboSelection && (
        <>
        {/* Month Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
            aria-label={t.booking.previousMonth}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold text-[#1a365d]">{monthName}</span>
          <button
            onClick={goToNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
            aria-label={t.booking.nextMonth}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="mb-2 grid grid-cols-7 gap-0">
          {weekDays.map((day, idx) => (
            <div
              key={`${day}-${idx}`}
              className={cn(
                "py-2 text-center text-[10px] font-bold uppercase tracking-wider",
                idx >= 5 ? "text-red-400" : "text-gray-400"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((dayInfo, index) => {
            const { day, isCurrentMonth, isPrevMonth } = dayInfo
            
            if (!isCurrentMonth) {
              return (
                <div
                  key={`${isPrevMonth ? "prev" : "next"}-${index}`}
                  className="flex h-9 items-center justify-center text-xs text-gray-300"
                >
                  {day}
                </div>
              )
            }

            const dateKey = formatDateKey(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
            const past = isPast(day)
            const closed = closedDaySet.has(dateKey)
            const todayClass = isToday(day)
            const selected = isSelected(day)
            const isWeekend = (index % 7) >= 5

            return (
              <button
                key={`current-${dateKey}`}
                onClick={() => handleDateClick(day)}
                disabled={past || closed}
                className={cn(
                  "flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-all",
                  (past || closed)
                    ? "cursor-not-allowed text-gray-300"
                    : "cursor-pointer hover:bg-[#d4a853] hover:text-white",
                  closed && "bg-gray-50 text-gray-400 line-through decoration-2",
                  !past && !selected && isWeekend && "text-red-500",
                  !past && !selected && !isWeekend && "text-gray-700",
                  todayClass && !selected && "ring-2 ring-[#d4a853] ring-offset-1",
                  selected && "bg-[#1a365d] text-white"
                )}
              >
                {day}
              </button>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <button
            onClick={() => {
              onDateSelect(undefined)
              onTimeSelect("")
            }}
            className="text-sm text-gray-500 transition-colors hover:text-[#1a365d]"
          >
            {t.booking.clearSelection}
          </button>
          <button
            onClick={() => {
              onDateSelect(today)
              onTimeSelect("")
              setCurrentMonth(new Date())
            }}
            className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-[#1a365d] transition-colors hover:bg-[#d4a853] hover:text-white"
          >
            {t.booking.today}
          </button>
        </div>

        {!isSelectedCruise && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            {t.booking.selectTime}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {selectedTicketTimeSlots.map((slot) => {
              const isSelectedSlot = selectedTime === slot
              const isClosedSlot = closedSlotSet.has(slot)
              const isPastSlot = isUnavailablePastSlot(selectedDateKey, slot)
              const isDisabledSlot = !selectedDate || isClosedSlot || isPastSlot

              return (
                <button
                  key={`${selectedTicket.id}-${slot}`}
                  type="button"
                  onClick={() => selectedDate && !isDisabledSlot && onTimeSelect(slot)}
                  disabled={isDisabledSlot}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-lg border text-sm font-medium transition-all",
                    !selectedDate && "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400",
                    selectedDate && (isClosedSlot || isPastSlot) && "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-400 line-through",
                    selectedDate && !isSelectedSlot && !isClosedSlot && !isPastSlot && "border-gray-200 bg-white text-gray-700 hover:border-[#d4a853] hover:bg-[#d4a853]/10",
                    selectedDate && isSelectedSlot && "border-[#1a365d] bg-[#1a365d] text-white"
                  )}
                >
                  {slot}
                </button>
              )
            })}
          </div>
          {!selectedDate && (
            <p className="mt-2 text-xs text-gray-400">{t.booking.selectDateFirst}</p>
          )}
        </div>
        )}
        {isSelectedCruise && selectedDate && (
          <p className="mt-4 rounded-lg bg-[#1a365d]/5 px-3 py-2 text-sm font-medium text-[#1a365d]">
            {t.booking.dayPassCruise}
          </p>
        )}
        {selectedTicket && (
          <TicketTypeSelector
            productId={selectedTicket.id}
            options={getTicketTypeOptions(selectedTicket.id, locale)}
            getQuantity={getTicketTypeQuantity}
            onQuantityChange={updateTicketTypeQuantity}
            showError={submitAttempted && !hasCompleteTicketBreakdown}
            title={t.booking.ticketTypes}
            errorMessage={t.booking.ticketTypeError}
          />
        )}
        </>
        )}

        {isComboSelection && (
          <div className="space-y-4">
            {selectedComponents.map((component) => {
              const schedule = comboSchedule[component.id] ?? { visitDate: "", visitTime: "" }
              const dayClosed = schedule.visitDate
                ? isComboDayClosed(component.id, schedule.visitDate)
                : false
              const calendarMonth = getComboMonth(component.id)
              const calendarMonthLabel = calendarMonth.toLocaleString(locale, {
                month: "long",
                year: "numeric",
              })

              return (
                <div key={component.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="mb-3">
                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                      {component.title}
                    </span>
                    {schedule.visitDate && (
                      <span className="mt-1 block text-sm font-semibold text-[#1a365d]">
                        {new Date(`${schedule.visitDate}T00:00:00`).toLocaleDateString(locale, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#1a365d]">{calendarMonthLabel}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => changeComboMonth(component.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#1a365d] transition-colors hover:bg-gray-100"
                          aria-label={`Previous month for ${component.title}`}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => changeComboMonth(component.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#1a365d] transition-colors hover:bg-gray-100"
                          aria-label={`Next month for ${component.title}`}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-2 grid grid-cols-7 gap-1">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <span key={`${component.id}-${day}`} className="text-center text-[11px] font-semibold text-gray-500">
                          {day}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {getCalendarCells(calendarMonth).map((date, index) => {
                        if (!date) {
                          return <span key={`${component.id}-empty-${index}`} className="h-9" />
                        }

                        const dateKey = formatDateKey(date)
                        const isSelectedDate = schedule.visitDate === dateKey
                        const isClosedDate = isComboDayClosed(component.id, dateKey)
                        const isPastDate = date < today

                        return (
                          <button
                            key={`${component.id}-${dateKey}`}
                            type="button"
                            onClick={() => selectComboDate(component.id, date)}
                            disabled={isPastDate || isClosedDate}
                            className={cn(
                              "flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                              isSelectedDate && "bg-[#1a365d] text-white ring-2 ring-[#d4a853]",
                              !isSelectedDate && !isPastDate && !isClosedDate && "text-gray-800 hover:bg-[#d4a853]/15",
                              (isPastDate || isClosedDate) && "cursor-not-allowed text-gray-300",
                              isClosedDate && "line-through decoration-2",
                            )}
                          >
                            {date.getDate()}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {dayClosed && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {t.booking.closedDay} {component.title}.
                    </p>
                  )}

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {needsTimeSlot(component.category) ? getTimeSlotsForProduct(component.id).map((slot) => {
                      const slotClosed = schedule.visitDate
                        ? isComboSlotClosed(component.id, schedule.visitDate, slot)
                        : false
                      const pastSlot = isUnavailablePastSlot(schedule.visitDate, slot)
                      const selected = schedule.visitTime === slot
                      const disabledSlot = !schedule.visitDate || dayClosed || slotClosed || pastSlot

                      return (
                        <button
                          key={`${component.id}-${slot}`}
                          type="button"
                          onClick={() => !disabledSlot && updateComboSchedule(component.id, "visitTime", slot)}
                          disabled={disabledSlot}
                          className={cn(
                            "flex h-10 items-center justify-center rounded-lg border text-sm font-medium transition-all",
                            disabledSlot &&
                              "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-400 line-through",
                            schedule.visitDate && !dayClosed && !slotClosed && !pastSlot && !selected &&
                              "border-gray-200 bg-white text-gray-700 hover:border-[#d4a853] hover:bg-[#d4a853]/10",
                            selected && "border-[#1a365d] bg-[#1a365d] text-white",
                          )}
                        >
                          {slot}
                        </button>
                      )
                    }) : (
                      <div className="col-span-3 rounded-lg bg-[#1a365d]/5 px-3 py-2 text-sm font-medium text-[#1a365d]">
                        {t.booking.dayPassOnly}
                      </div>
                    )}
                  </div>
                  <TicketTypeSelector
                    productId={component.id}
                    options={getTicketTypeOptions(component.id, locale)}
                    getQuantity={getTicketTypeQuantity}
                    onQuantityChange={updateTicketTypeQuantity}
                    showError={submitAttempted && getTicketTypeTotal(component.id) === 0}
                    title={t.booking.ticketTypes}
                    errorMessage={t.booking.ticketTypeError}
                  />
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
          <div>
            <label htmlFor="full-name" className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
              {t.booking.name}
            </label>
            <input
              id="full-name"
              type="text"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value)
                clearContactErrors()
              }}
              placeholder={t.booking.namePlaceholder}
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2",
                showNameError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#d4a853] focus:ring-[#d4a853]/30"
              )}
            />
            {showNameError && (
              <p className="mt-1 text-xs text-red-500">{t.booking.nameError}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
              {t.booking.email}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                clearContactErrors()
              }}
              placeholder={t.booking.emailPlaceholder}
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2",
                showEmailError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#d4a853] focus:ring-[#d4a853]/30"
              )}
            />
            {showEmailError && (
              <p className="mt-1 text-xs text-red-500">{t.booking.emailError}</p>
            )}
          </div>

          <div>
            <label htmlFor="email-confirm" className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
              {t.booking.emailConfirmation}
            </label>
            <input
              id="email-confirm"
              type="email"
              value={emailConfirmation}
              onChange={(event) => {
                setEmailConfirmation(event.target.value)
                clearContactErrors()
              }}
              placeholder={t.booking.emailConfirmationPlaceholder}
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2",
                showEmailConfirmationError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#d4a853] focus:ring-[#d4a853]/30"
              )}
            />
            {showEmailConfirmationError && (
              <p className="mt-1 text-xs text-red-500">{t.booking.emailConfirmationError}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone-number" className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
              {t.booking.phone}
            </label>
            <input
              id="phone-number"
              type="tel"
              inputMode="tel"
              value={phoneNumber}
              onChange={(event) => {
                const sanitizedPhone = event.target.value.replace(/[^\d+\-()\s]/g, "")
                setPhoneNumber(sanitizedPhone)
                clearContactErrors()
              }}
              placeholder={t.booking.phonePlaceholder}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/30"
            />
          </div>

          <button
            type="button"
            onClick={handleOrderSubmit}
            className="mt-2 w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
            disabled={!hasCompleteSelection || !hasCompleteTicketBreakdown || isSubmitting}
          >
            {isSubmitting ? t.booking.submitting : t.booking.completePurchase}
          </button>
          {submitMessage && (
            <p className="text-sm font-medium text-green-600">{submitMessage}</p>
          )}
          {submitError && (
            <p className="text-sm font-medium text-red-600">{submitError}</p>
          )}
        </div>
      </div>

      {/* Selected Date Display */}
      {(selectedDate || selectedTicket) && (
        <div className="border-t border-gray-100 bg-[#1a365d]/5 px-5 py-4">
          {selectedTicket && (
            <div className="mb-2">
              <p className="text-xs text-gray-500">{t.booking.selectedTicket}</p>
              <p className="text-sm font-semibold text-[#1a365d]">{selectedTicket.title}</p>
            </div>
          )}
          {!isComboSelection && selectedDate && (
            <>
              <p className="text-xs text-gray-500">{t.booking.selectedDate}</p>
              <p className="text-base font-bold text-[#1a365d]">
                {selectedDate.toLocaleDateString(locale, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </>
          )}
          {!isComboSelection && selectedDate && selectedTime && (
            <p className="mt-1 text-sm font-medium text-[#1a365d]">{t.booking.time}: {selectedTime}</p>
          )}
          {isComboSelection && selectedComponents.length > 0 && (
            <div className="mt-2 space-y-1">
              {selectedComponents.map((component) => {
                const schedule = comboSchedule[component.id]

                if (!schedule?.visitDate || (needsTimeSlot(component.category) && !schedule.visitTime)) return null

                return (
                  <p key={component.id} className="text-sm font-medium text-[#1a365d]">
                    {component.title}: {schedule.visitDate}
                    {needsTimeSlot(component.category) ? ` ${t.booking.at} ${schedule.visitTime}` : ` (${t.booking.dayPass})`}
                  </p>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
