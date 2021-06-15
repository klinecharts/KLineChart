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

/**
 * 合并
 * @param target
 * @param source
 */
export function merge (target, source) {
  if (!isObject(target) || !isObject(source)) {
    return
  }
  for (const key in source) {
    if (key in target) {
      const targetProp = target[key]
      const sourceProp = source[key]
      if (
        isObject(sourceProp) &&
        isObject(targetProp) &&
        !isArray(sourceProp) &&
        !isArray(targetProp)
      ) {
        merge(targetProp, sourceProp)
      } else {
        if (isValid(source[key])) {
          target[key] = source[key]
        }
      }
    }
  }
}

/**
 * 克隆
 * @param target
 * @return {{}|*}
 */
export function clone (target) {
  if (!isObject(target)) {
    return target
  }

  let copy
  if (isArray(target)) {
    copy = []
  } else {
    copy = {}
  }
  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      const v = target[key]
      if (isObject(v)) {
        copy[key] = clone(v)
      } else {
        copy[key] = v
      }
    }
  }
  return copy
}

/**
 * 是否是数组
 * @param value
 * @return {boolean}
 */
export function isArray (value) {
  return Object.prototype.toString.call(value) === '[object Array]'
}

/**
 * 是否是方法
 * @param {*} value
 * @return {boolean}
 */
export function isFunction (value) {
  return typeof value === 'function'
}

/**
 * 是否是对象
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

/**
 * 是否是字符串
 * @param value
 * @return {boolean}
 */
export function isString (value) {
  return typeof value === 'string'
}

/**
 * 是否是容器元素
 * @param dom
 * @return {boolean}
 */
export function isContainerDom (dom) {
  return dom && (dom instanceof HTMLElement) && dom.appendChild && (typeof dom.appendChild === 'function')
}
