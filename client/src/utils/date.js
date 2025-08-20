import { format, addDays, startOfDay, isToday, isTomorrow } from 'date-fns'

export const formatDate = (date, formatStr = 'MMM dd') => {
  return format(date, formatStr)
}

export const formatTime = (timeString) => {
  const [hour, minute] = timeString.split(':')
  const hourInt = parseInt(hour)
  const ampm = hourInt >= 12 ? 'PM' : 'AM'
  const displayHour = hourInt % 12 || 12
  return `${displayHour}:${minute} ${ampm}`
}

export const getNext7Days = () => {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = addDays(startOfDay(new Date()), i)
    dates.push({
      date,
      formatted: formatDate(date),
      dayName: format(date, 'EEEE'),
      shortDay: format(date, 'EEE'),
      isToday: isToday(date),
      isTomorrow: isTomorrow(date),
    })
  }
  return dates
}

export const getDateLabel = (date) => {
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'EEE')
}

export const formatFullDate = (date) => {
  return format(date, 'EEEE, MMMM dd, yyyy')
}

export const formatDateWithTime = (date, timeString) => {
  const [hour, minute] = timeString.split(':')
  const dateWithTime = new Date(date)
  dateWithTime.setHours(parseInt(hour), parseInt(minute))
  return format(dateWithTime, 'MMM dd, yyyy hh:mm a')
}