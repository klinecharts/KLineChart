/**
 * 格式化时间
 * @param timestamp
 * @returns {string}
 */
export function formatDate (timestamp) {
  if (timestamp && isNumber(timestamp)) {
    const date = new Date(timestamp)
    const month = (date.getMonth() + 1).toString()
    const day = date.getDate().toString()
    const hours = date.getHours().toString()
    const minutes = date.getMinutes().toString()
    return (month.length === 1 ? '0' + month : month) +
      '-' + (day.length === 1 ? '0' + day : day) +
      ' ' + (hours.length === 1 ? '0' + hours : hours) +
      ':' + (minutes.length === 1 ? '0' + minutes : minutes)
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

/**
 * 格式化小数
 * @param value
 * @param decimal
 * @returns {*|string|*}
 */
export function formatDecimal (value, decimal = 2) {
  if ((value || value === 0) && isNumber(value)) {
    return value.toFixed(decimal)
  }
  return value
}

export function merge (target, source) {
  if (!isObject(target) || !isObject(source)) {
    return
  }
  for (const key in source) {
    if (target[key] || target[key] === 0 || target[key] === false) {
      const targetProp = target[key]
      const sourceProp = source[key]
      if (isObject(sourceProp) &&
        isObject(targetProp) &&
        !isArray(sourceProp) &&
        !isArray(targetProp)
      ) {
        merge(targetProp, sourceProp)
      } else {
        if (target[key] || target[key] === 0 || target[key] === false) {
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
