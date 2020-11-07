/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isValidDate(date: any): boolean {
  return (
    date &&
    Object.prototype.toString.call(date) === '[object Date]' &&
    !isNaN(date)
  )
}

export function isLater(date1: Date, date2: Date): boolean {
  if (isValidDate(date1)) {
    return date1 > date2
  }

  return false
}

export function DateToYYYYMMDD(d: Date): string {
  const month = d.getMonth() + 1
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n)

  return d.getFullYear() + pad(month) + pad(d.getDate())
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

export function DateToDDMMMYYYY(d: Date): string {
  return d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear()
}

export function getStartOfLastWeek() {
  const d = new Date()
  const day = d.getDay() === 0 ? 7 : d.getDay()
  d.setDate(d.getDate() - day - 7 + 1)
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d
}
