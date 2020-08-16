/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  return (!!value && typeof value === 'object')
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
 * 判断是否有效
 * @param value
 * @returns {boolean}
 */
export function isValid (value) {
  return value !== null && value !== undefined
}

/**
 * 判断是否是boolean
 * @param value
 * @returns {boolean}
 */
export function isBoolean (value) {
  return typeof value === 'boolean'
}
