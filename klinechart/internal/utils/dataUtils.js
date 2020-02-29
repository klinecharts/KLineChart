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
        return `${year}-${monthText}-${day} ${hourText}:${minuteText}`
      }
      case 'hh:mm': {
        return `${hourText}:${minuteText}`
      }
      default: {
        return `${monthText}-${day} ${hourText}:${minuteText}`
      }
    }
  }
  return '--'
}

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

export function merge (target, source) {
  if (!isObject(target) || !isObject(source)) {
    return
  }
  for (const key in source) {
    if (target.hasOwnProperty(key)) {
      const targetProp = target[key]
      const sourceProp = source[key]
      if (isObject(sourceProp) &&
        isObject(targetProp) &&
        !isArray(sourceProp) &&
        !isArray(targetProp)
      ) {
        merge(targetProp, sourceProp)
      } else {
        if (source[key] || source[key] === 0 || source[key] === false) {
          target[key] = source[key]
        }
      }
    }
  }
}

export function isArray (value) {
  return Object.prototype.toString.call(value) === '[object Array]'
}

/**
 * @param {*} value
 * @return {boolean}
 */
export function isFunction (value) {
  return typeof value === 'function'
}

/**
 * @param {*} value
 * @return {boolean}
 */
export function isObject (value) {
  const type = typeof value
  return type === 'function' || (!!value && type === 'object')
}

/**
 * 判断是否是数字
 * @param value
 * @returns {boolean}
 */
export function isNumber (value) {
  return typeof value === 'number' && !isNaN(value)
}
