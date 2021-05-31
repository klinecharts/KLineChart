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
 * 二分查找最接近的数
 * @param dataList
 * @param valueKey
 * @param targetNumber
 * @return {number}
 */
export function binarySearchNearest (dataList, valueKey, targetNumber) {
  let left = 0
  let right = 0
  for (right = dataList.length - 1; left !== right;) {
    const midIndex = Math.floor((right + left) / 2)
    const mid = right - left
    const midValue = dataList[midIndex][valueKey]
    if (targetNumber === dataList[left][valueKey]) {
      return left
    }
    if (targetNumber === dataList[right][valueKey]) {
      return right
    }
    if (targetNumber === midValue) {
      return midIndex
    }

    if (targetNumber > midValue) {
      left = midIndex
    } else {
      right = midIndex
    }

    if (mid <= 2) {
      break
    }
  }
  return left
}

/**
 * 优化数字
 * @param value
 * @return {number|number}
 */
export function nice (value) {
  const exponent = Math.floor(log10(value))
  const exp10 = index10(exponent)
  const f = value / exp10 // 1 <= f < 10
  let nf = 0
  if (f < 1.5) {
    nf = 1
  } else if (f < 2.5) {
    nf = 2
  } else if (f < 3.5) {
    nf = 3
  } else if (f < 4.5) {
    nf = 4
  } else if (f < 5.5) {
    nf = 5
  } else if (f < 6.5) {
    nf = 6
  } else {
    nf = 8
  }
  value = nf * exp10
  return exponent >= -20 ? +value.toFixed(exponent < 0 ? -exponent : 0) : value
}

/**
 * 四和五入
 * @param value
 * @param precision
 * @return {number}
 */
export function round (value, precision) {
  if (precision == null) {
    precision = 10
  }
  precision = Math.min(Math.max(0, precision), 20)
  value = (+value).toFixed(precision)
  return +value
}

/**
 * 获取小数位数
 * @param value
 * @return {number|number}
 */
export function getPrecision (value) {
  const str = value.toString()
  const eIndex = str.indexOf('e')
  if (eIndex > 0) {
    const precision = +str.slice(eIndex + 1)
    return precision < 0 ? -precision : 0
  } else {
    const dotIndex = str.indexOf('.')
    return dotIndex < 0 ? 0 : str.length - 1 - dotIndex
  }
}

/**
 * 10为低的对数函数
 * @param value
 * @return {number}
 */
export function log10 (value) {
  return Math.log(value) / Math.log(10)
}

/**
 * 10的指数函数
 * @param value
 * @return {number}
 */
export function index10 (value) {
  return Math.pow(10, value)
}
