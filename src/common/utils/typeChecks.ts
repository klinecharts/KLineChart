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
export function merge (target: any, source: any): void {
  if ((!isObject(target) && !isObject(source))) {
    return
  }
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key) as boolean) {
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
export function clone (target: any): any {
  if (!isObject(target) || !isArray(target)) {
    return target
  }

  let copy
  if (isArray(target)) {
    copy = []
  } else {
    copy = {}
  }
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key) as boolean) {
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
export function isArray (value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Array]'
}

/**
 * 是否是方法
 * @param {*} value
 * @return {boolean}
 */
export function isFunction (value: any): boolean {
  return typeof value === 'function'
}

/**
 * 是否是对象
 * @param {*} value
 * @return {boolean}
 */
export function isObject (value: any): boolean {
  return (typeof value === 'object')
}

/**
 * 判断是否是数字
 * @param value
 * @returns {boolean}
 */
export function isNumber (value: any): boolean {
  return typeof value === 'number' && !isNaN(value)
}

/**
 * 判断是否有效
 * @param value
 * @returns {boolean}
 */
export function isValid (value: any | null): boolean {
  return value !== null && value !== undefined
}

/**
 * 判断是否是boolean
 * @param value
 * @returns {boolean}
 */
export function isBoolean (value: any): boolean {
  return typeof value === 'boolean'
}

/**
 * 是否是字符串
 * @param value
 * @return {boolean}
 */
export function isString (value: any): boolean {
  return typeof value === 'string'
}
