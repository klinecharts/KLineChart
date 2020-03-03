import { isNumber } from './dataUtils'

/**
 * 格式化时间
 * @param timestamp
 * @param format
 * @returns {string}
 */
export function formatDate (timestamp, format) {
  const date = getDate(timestamp)
  if (date) {
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString()
    const day = date.getDate().toString()
    const hours = date.getHours().toString()
    const minutes = date.getMinutes().toString()
    const monthText = month.length === 1 ? `0${month}` : month
    const dayText = day.length === 1 ? `0${day}` : day
    const hourText = hours.length === 1 ? '0' + hours : hours
    const minuteText = minutes.length === 1 ? '0' + minutes : minutes
    switch (format) {
      case 'YYYY': {
        return year
      }
      case 'YYYY-MM': {
        return `${year}-${monthText}`
      }
      case 'YYYY-MM-DD': {
        return `${year}-${monthText}-${dayText}`
      }
      case 'YYYY-MM-DD hh:mm': {
        return `${year}-${monthText}-${dayText} ${hourText}:${minuteText}`
      }
      case 'MM-DD': {
        return `${monthText}-${dayText}`
      }
      case 'MM': {
        return monthText
      }
      case 'hh:mm': {
        return `${hourText}:${minuteText}`
      }
      default: {
        return `${monthText}-${dayText} ${hourText}:${minuteText}`
      }
    }
  }
  return '--'
}

/**
 * 获取周几
 * @param timestamp
 * @returns {number}
 */
export function getWeekDay (timestamp) {
  const date = getDate(timestamp)
  if (date) {
    return date.getDay()
  }
  return -1
}

function getDate (timestamp) {
  if (timestamp && isNumber(timestamp)) {
    return new Date(timestamp)
  }
  return null
}
