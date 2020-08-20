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
 * @param dateTimeFormat
 * @param timestamp
 * @param format
 * @returns {string}
 */
export function formatDate (dateTimeFormat, timestamp, format = 'MM-DD hh:mm') {
  if (timestamp && isNumber(timestamp)) {
    const dateTimeString = dateTimeFormat.format(new Date(timestamp))
    const dateTimeStringArray = dateTimeString.split(', ')
    const dateStringArray = dateTimeStringArray[0].split('/')
    const date = {
      YYYY: dateStringArray[2],
      MM: dateStringArray[0],
      DD: dateStringArray[1],
      'hh:mm': dateTimeStringArray[1].match(/^[\d]{2}/)[0] === '24'
        ? dateTimeStringArray[1].replace(/^[\d]{2}/, '00')
        : dateTimeStringArray[1]
    }
    return format.replace(/YYYY|MM|DD|(hh:mm)/g, key => date[key])
  }
  return '--'
}

/**
 * 格式化精度
 */
export function formatPrecision (value, precision = 2) {
  const v = +value
  if ((v || v === 0) && isNumber(v)) {
    return v.toFixed(precision)
  }
  return `${v}`
}

/**
 * 格式化大数据
 * @param value
 */
export function formatBigNumber (value) {
  if (isNumber(+value)) {
    if (value > 1000000000) {
      return `${+((value / 1000000000).toFixed(3))}B`
    }
    if (value > 1000000) {
      return `${+((value / 1000000).toFixed(3))}M`
    }
    if (value > 1000) {
      return `${+((value / 1000).toFixed(3))}K`
    }
    return value
  }
  return '--'
}
