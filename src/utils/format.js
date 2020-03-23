import { isNumber, isObject } from './typeChecks'

/**
 * 格式化值
 * @param data
 * @param key
 * @param defaultValue
 * @returns {string|*}
 */
export function formatValue (data, key, defaultValue = '--') {
  if (data && isObject(data)) {
    const value = data[key]
    if (value || value === 0 || value === false) {
      return value
    }
  }
  return defaultValue
}

/**
 * 格式化时间
 * @param timestamp
 * @param format
 * @returns {string}
 */
export function formatDate (timestamp, format) {
  if (timestamp && isNumber(timestamp)) {
    const date = new Date(timestamp)
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
 * 格式化精度
 */
export function formatPrecision (value, precision = 2) {
  const v = +value
  if ((v || v === 0) && isNumber(v)) {
    return value.toFixed(precision)
  }
  return `${v}`
}

/**
 * 格式化大数据
 * @param value
 */
export function formatBigNumber (value) {
  if (isNumber(+value)) {
    if (value > 50000) {
      return `${+((value / 1000).toFixed(1))}K`
    }
    if (value > 5000000) {
      return `${+((value / 1000000).toFixed(3))}M`
    }
    return `${value}`
  }
  return '--'
}
