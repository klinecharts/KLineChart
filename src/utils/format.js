/**
 * Copyright (c) 2019 lihu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
 * @param timestamp
 * @param format
 * @param timezone
 * @returns {string}
 */
const locales = 'en-us'
export function formatDate (timestamp, format, timezone) {
  if (timestamp && isNumber(timestamp)) {
    const date = new Date(timestamp)
    let dateTimeString
    try {
      dateTimeString = new Intl.DateTimeFormat(
        locales, { hour12: false, timeZone: timezone, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }
      ).format(date)
    } catch (e) {
      dateTimeString = new Intl.DateTimeFormat(
        locales, { hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }
      ).format(date)
    }
    const dateString = dateTimeString.match(/^[\d]{1,2}\/[\d]{1,2}\/[\d]{4}/)[0]
    const dateStringArray = dateString.split('/')
    const month = `${dateStringArray[0].length === 1 ? `0${dateStringArray[0]}` : dateStringArray[0]}`
    const day = `${dateStringArray[1].length === 1 ? `0${dateStringArray[1]}` : dateStringArray[1]}`
    let timeString = dateTimeString.match(/[\d]{2}:[\d]{2}$/)[0]
    // 这里将小时24转换成00
    if (timeString.match(/^[\d]{2}/)[0] === '24') {
      timeString = timeString.replace(/^[\d]{2}/, '00')
    }
    switch (format) {
      case 'YYYY': {
        return dateStringArray[2]
      }
      case 'YYYY-MM': {
        return `${dateStringArray[2]}-${month}`
      }
      case 'YYYY-MM-DD': {
        return `${dateStringArray[2]}-${month}-${day}`
      }
      case 'YYYY-MM-DD hh:mm': {
        return `${dateStringArray[2]}-${month}-${day} ${timeString}`
      }
      case 'MM-DD': {
        return `${month}-${day}`
      }
      case 'hh:mm': {
        return timeString
      }
      default: {
        return `${month}-${day} ${timeString}`
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
