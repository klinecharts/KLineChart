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

export function clone (target) {
  if (!target || !isObject(target)) {
    return target
  }

  let copy
  if (isArray(target)) {
    copy = []
  } else {
    copy = {}
  }
  let p
  let v
  for (p in target) {
    if (target.hasOwnProperty(p)) {
      v = target[p]
      if (v && isObject(v)) {
        copy[p] = clone(v)
      } else {
        copy[p] = v
      }
    }
  }

  return copy
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

/**
 * 判断是否是boolean
 * @param value
 * @returns {boolean}
 */
export function isBoolean (value) {
  return typeof value === 'boolean'
}
