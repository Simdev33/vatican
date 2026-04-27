"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { isPastBookingSlot } from "@/lib/booking-time"
import { TIME_SLOTS } from "@/lib/time-slots"
import type { ProductAvailability } from "@/lib/availability"

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

interface DateSelectorProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date | undefined) => void
  selectedTicket: {
    id: string
    title: string
    price: number
    category: "Entry Ticket" | "River Cruise" | "Combo Ticket"
  } | null
  selectedComponents?: Array<{
    id: string
    title: string
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
  const isComboSelection = selectedComponents.length > 1
  const isSelectedCruise = selectedTicket?.category === "River Cruise"

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
  const monthName = currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" })
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
  const canCompletePurchase =
    hasCompleteSelection &&
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
          items: isComboSelection
            ? selectedComponents.map((component) => ({
                productId: component.id,
                visitDate: comboSchedule[component.id]?.visitDate,
                visitTime:
                  component.category === "River Cruise"
                    ? ""
                    : comboSchedule[component.id]?.visitTime,
              }))
            : undefined,
        }),
      })
      const result = (await response.json()) as {
        ok: boolean
        message?: string
        orderId?: string
        orderNumber?: string
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.message ?? "Could not complete the order.")
      }

      setSubmitMessage("Order received. Redirecting to your confirmation...")
      setSubmitAttempted(false)
      setFullName("")
      setEmail("")
      setEmailConfirmation("")
      setPhoneNumber("")
      window.location.href = `/thank-you?order=${encodeURIComponent(result.orderNumber ?? "")}`
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
            Select Your Visit Date
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
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold text-[#1a365d]">{monthName}</span>
          <button
            onClick={goToNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="mb-2 grid grid-cols-7 gap-0">
          {weekDays.map((day, idx) => (
            <div
              key={idx}
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
                key={`current-${day}`}
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
            Clear selection
          </button>
          <button
            onClick={() => {
              onDateSelect(today)
              onTimeSelect("")
              setCurrentMonth(new Date())
            }}
            className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-[#1a365d] transition-colors hover:bg-[#d4a853] hover:text-white"
          >
            Today
          </button>
        </div>

        {!isSelectedCruise && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            Select Time
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => {
              const isSelectedSlot = selectedTime === slot
              const isClosedSlot = closedSlotSet.has(slot)
              const isPastSlot = isUnavailablePastSlot(selectedDateKey, slot)
              const isDisabledSlot = !selectedDate || isClosedSlot || isPastSlot

              return (
                <button
                  key={slot}
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
            <p className="mt-2 text-xs text-gray-400">Select a date first to choose a time slot.</p>
          )}
        </div>
        )}
        {isSelectedCruise && selectedDate && (
          <p className="mt-4 rounded-lg bg-[#1a365d]/5 px-3 py-2 text-sm font-medium text-[#1a365d]">
            Seine Cruise is a day pass. Boarding is flexible between 10:00-22:00.
          </p>
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
              const calendarMonthLabel = calendarMonth.toLocaleString("en-US", {
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
                        {new Date(`${schedule.visitDate}T00:00:00`).toLocaleDateString("en-US", {
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
                        <span key={day} className="text-center text-[11px] font-semibold text-gray-500">
                          {day}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {getCalendarCells(calendarMonth).map((date, index) => {
                        if (!date) {
                          return <span key={`empty-${index}`} className="h-9" />
                        }

                        const dateKey = formatDateKey(date)
                        const isSelectedDate = schedule.visitDate === dateKey
                        const isClosedDate = isComboDayClosed(component.id, dateKey)
                        const isPastDate = date < today

                        return (
                          <button
                            key={dateKey}
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
                      This day is closed for {component.title}.
                    </p>
                  )}

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {needsTimeSlot(component.category) ? TIME_SLOTS.map((slot) => {
                      const slotClosed = schedule.visitDate
                        ? isComboSlotClosed(component.id, schedule.visitDate, slot)
                        : false
                      const pastSlot = isUnavailablePastSlot(schedule.visitDate, slot)
                      const selected = schedule.visitTime === slot
                      const disabledSlot = !schedule.visitDate || dayClosed || slotClosed || pastSlot

                      return (
                        <button
                          key={slot}
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
                        Day pass only - no time slot needed.
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
          <div>
            <label htmlFor="full-name" className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Name
            </label>
            <input
              id="full-name"
              type="text"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value)
                clearContactErrors()
              }}
              placeholder="Your full name"
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2",
                showNameError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#d4a853] focus:ring-[#d4a853]/30"
              )}
            />
            {showNameError && (
              <p className="mt-1 text-xs text-red-500">Please enter your full name (first and last name).</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                clearContactErrors()
              }}
              placeholder="you@example.com"
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2",
                showEmailError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#d4a853] focus:ring-[#d4a853]/30"
              )}
            />
            {showEmailError && (
              <p className="mt-1 text-xs text-red-500">Please enter a valid email address.</p>
            )}
          </div>

          <div>
            <label htmlFor="email-confirm" className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Email Confirmation
            </label>
            <input
              id="email-confirm"
              type="email"
              value={emailConfirmation}
              onChange={(event) => {
                setEmailConfirmation(event.target.value)
                clearContactErrors()
              }}
              placeholder="Repeat your email"
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2",
                showEmailConfirmationError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#d4a853] focus:ring-[#d4a853]/30"
              )}
            />
            {showEmailConfirmationError && (
              <p className="mt-1 text-xs text-red-500">Email addresses must match.</p>
            )}
          </div>

          <div>
            <label htmlFor="phone-number" className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Phone Number
            </label>
            <input
              id="phone-number"
              type="tel"
              value={phoneNumber}
              onChange={(event) => {
                setPhoneNumber(event.target.value)
                clearContactErrors()
              }}
              placeholder="+36 30 123 4567"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/30"
            />
          </div>

          <button
            type="button"
            onClick={handleOrderSubmit}
            className="mt-2 w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
            disabled={!hasCompleteSelection || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Complete Purchase"}
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
              <p className="text-xs text-gray-500">Selected ticket</p>
              <p className="text-sm font-semibold text-[#1a365d]">{selectedTicket.title}</p>
            </div>
          )}
          {!isComboSelection && selectedDate && (
            <>
              <p className="text-xs text-gray-500">Selected date</p>
              <p className="text-base font-bold text-[#1a365d]">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </>
          )}
          {!isComboSelection && selectedDate && selectedTime && (
            <p className="mt-1 text-sm font-medium text-[#1a365d]">Time: {selectedTime}</p>
          )}
          {isComboSelection && selectedComponents.length > 0 && (
            <div className="mt-2 space-y-1">
              {selectedComponents.map((component) => {
                const schedule = comboSchedule[component.id]

                if (!schedule?.visitDate || (needsTimeSlot(component.category) && !schedule.visitTime)) return null

                return (
                  <p key={component.id} className="text-sm font-medium text-[#1a365d]">
                    {component.title}: {schedule.visitDate}
                    {needsTimeSlot(component.category) ? ` at ${schedule.visitTime}` : " (day pass)"}
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
