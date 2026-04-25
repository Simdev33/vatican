"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

interface DateSelectorProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date | undefined) => void
  selectedTicket: { title: string; price: number } | null
  selectedTime: string
  onTimeSelect: (time: string) => void
}

export function DateSelector({
  selectedDate,
  onDateSelect,
  selectedTicket,
  selectedTime,
  onTimeSelect,
}: DateSelectorProps) {
  const [currentMonth, setCurrentMonth] = React.useState(() => new Date())
  const timeSlots = ["08:30", "09:00", "09:30", "10:30", "11:30", "13:00", "14:30", "16:00"]
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [emailConfirmation, setEmailConfirmation] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [submitAttempted, setSubmitAttempted] = React.useState(false)

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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const hasFullName = /\S+\s+\S+/.test(fullName.trim())
  const isEmailValid = emailRegex.test(email.trim())
  const doEmailsMatch =
    email.trim() !== "" &&
    emailConfirmation.trim() !== "" &&
    email.trim().toLowerCase() === emailConfirmation.trim().toLowerCase()
  const showNameError = (submitAttempted || fullName.trim().length > 0) && !hasFullName
  const showEmailError = (submitAttempted || email.trim().length > 0) && !isEmailValid
  const showEmailConfirmationError =
    submitAttempted || emailConfirmation.trim().length > 0
      ? emailConfirmation.trim() === "" || !doEmailsMatch
      : false
  const canCompletePurchase =
    !!selectedTicket &&
    !!selectedDate &&
    !!selectedTime &&
    hasFullName &&
    isEmailValid &&
    doEmailsMatch

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

            const past = isPast(day)
            const todayClass = isToday(day)
            const selected = isSelected(day)
            const isWeekend = (index % 7) >= 5

            return (
              <button
                key={`current-${day}`}
                onClick={() => handleDateClick(day)}
                disabled={past}
                className={cn(
                  "flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-all",
                  past
                    ? "cursor-not-allowed text-gray-300"
                    : "cursor-pointer hover:bg-[#d4a853] hover:text-white",
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

        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            Select Time
          </p>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => {
              const isSelectedSlot = selectedTime === slot

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => selectedDate && onTimeSelect(slot)}
                  disabled={!selectedDate}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-lg border text-sm font-medium transition-all",
                    !selectedDate && "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400",
                    selectedDate && !isSelectedSlot && "border-gray-200 bg-white text-gray-700 hover:border-[#d4a853] hover:bg-[#d4a853]/10",
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

        <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
          <div>
            <label htmlFor="full-name" className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Name
            </label>
            <input
              id="full-name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your full name"
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2",
                showNameError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#d4a853] focus:ring-[#d4a853]/30"
              )}
            />
            {showNameError && (
              <p className="mt-1 text-xs text-red-500">Teljes nev kell (keresztnev + vezeteknev).</p>
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
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2",
                showEmailError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#d4a853] focus:ring-[#d4a853]/30"
              )}
            />
            {showEmailError && (
              <p className="mt-1 text-xs text-red-500">Adj meg egy ervenyes email cimet.</p>
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
              onChange={(event) => setEmailConfirmation(event.target.value)}
              placeholder="Repeat your email"
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2",
                showEmailConfirmationError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#d4a853] focus:ring-[#d4a853]/30"
              )}
            />
            {showEmailConfirmationError && (
              <p className="mt-1 text-xs text-red-500">A ket email cimnek egyeznie kell.</p>
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
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="+36 30 123 4567"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/30"
            />
          </div>

          <button
            type="button"
            onClick={() => setSubmitAttempted(true)}
            className="mt-2 w-full rounded-full bg-[#d4a853] px-5 py-3 text-sm font-semibold text-[#1a365d] transition-all hover:bg-[#e5b964] hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
            disabled={!canCompletePurchase}
          >
            Complete Purchase
          </button>
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
          {selectedDate && (
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
          {selectedDate && selectedTime && (
            <p className="mt-1 text-sm font-medium text-[#1a365d]">Time: {selectedTime}</p>
          )}
        </div>
      )}
    </div>
  )
}
