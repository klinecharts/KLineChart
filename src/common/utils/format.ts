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

import { isNumber, isValid } from './typeChecks'

const reEscapeChar = /\\(\\)?/g
const rePropName = RegExp(
  '[^.[\\]]+' + '|' +
  '\\[(?:' +
    '([^"\'][^[]*)' + '|' +
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
  ')\\]' + '|' +
  '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
  , 'g')

/**
 * 格式化值
 * @param data
 * @param key
 * @param defaultValue
 * @returns {string|*}
 */
export function formatValue (data: unknown, key: string, defaultValue?: unknown): unknown {
  if (isValid(data)) {
    const path: string[] = []
    key.replace(rePropName, (subString: string, ...args: any[]) => {
      let k = subString
      if (isValid(args[1])) {
        k = args[2].replace(reEscapeChar, '$1')
      } else if (isValid(args[0])) {
        k = args[0].trim()
      }
      path.push(k)
      return ''
    })
    let value = data
    let index = 0
    const length = path.length
    while (isValid(value) && index < length) {
      value = value?.[path[index++]]
    }
    return isValid(value) ? value : (defaultValue ?? '--')
  }
  return defaultValue ?? '--'
}

/**
 * 格式化时间
 * @param dateTimeFormat
 * @param timestamp
 * @param format
 * @returns {string}
 */
export function formatDate (dateTimeFormat: Intl.DateTimeFormat, timestamp: number, format?: string): string {
  if (isNumber(timestamp)) {
    const dateTimeString = dateTimeFormat.format(new Date(timestamp))
    const dateTimeStringArray = dateTimeString.split(', ')
    const dateStringArray = dateTimeStringArray[0].split('/')
    const hourMinute = dateTimeStringArray[1]
    const date = {
      YYYY: dateStringArray[2],
      MM: dateStringArray[0],
      DD: dateStringArray[1],
      'hh:mm': (hourMinute.match(/^[\d]{2}/) ?? [])[0] === '24'
        ? hourMinute.replace(/^[\d]{2}/, '00')
        : hourMinute
    }
    return (format ?? 'MM-DD hh:mm').replace(/YYYY|MM|DD|(hh:mm)/g, key => date[key])
  }
  return '--'
}

/**
 * 格式化精度
 */
export function formatPrecision (value: string | number, precision?: number): string {
  const v = +value
  if (isNumber(v)) {
    return v.toFixed(precision ?? 2)
  }
  return `${v}`
}

/**
 * 格式化大数据
 * @param value
 */
export function formatBigNumber (value: string | number): string {
  const v = +value
  if (isNumber(v)) {
    if (value > 1000000000) {
      return `${+((v / 1000000000).toFixed(3))}B`
    }
    if (value > 1000000) {
      return `${+((v / 1000000).toFixed(3))}M`
    }
    if (value > 1000) {
      return `${+((v / 1000).toFixed(3))}K`
    }
    return `${value}`
  }
  return '--'
}
