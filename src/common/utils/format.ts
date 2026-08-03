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

export interface DateTime {
  YYYY: string
  MM: string
  DD: string
  HH: string
  mm: string
  ss: string
}

const reEscapeChar = /\\(\\)?/g
const rePropName = new RegExp('[^.[\\]]+' + '|' + '\\[(?:' + '([^"\'][^[]*)' + '|' + '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' + ')\\]' + '|' + '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))', 'g')

export function formatValue(data: unknown, key: string, defaultValue?: unknown): unknown {
  // Fast path: simple single-segment key without path separators.
  // `rePropName` below splits on '.', '[', and ']', so a key containing any of those
  // is compound and must take the general path. A separator-free key parses to a
  // single-element `path` and resolves to `data[key]`, which an inline read matches exactly.
  // This avoids a regex match + closure + array allocation per call, which matters in hot paths
  // (e.g. `eachFigures` runs 4 `formatValue` calls per visible bar per indicator).
  if (key.length > 0 && !key.includes('.') && !key.includes('[') && !key.includes(']')) {
    if (isValid(data)) {
      const value = (data as Record<string, unknown>)[key]
      return isValid(value) ? value : (defaultValue ?? '--')
    }
    return defaultValue ?? '--'
  }
  if (isValid(data)) {
    const path: string[] = []
    key.replace(rePropName, (subString: string, ...args: unknown[]) => {
      let k = subString
      if (isValid(args[1])) {
        k = (args[2] as string).replace(reEscapeChar, '$1')
      } else if (isValid(args[0])) {
        k = (args[0] as string).trim()
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

export function formatTimestampToDateTime(dateTimeFormat: Intl.DateTimeFormat, timestamp: number): DateTime {
  const date: Record<string, string> = {}
  dateTimeFormat.formatToParts(new Date(timestamp)).forEach(({ type, value }) => {
    switch (type) {
      case 'year': {
        date.YYYY = value
        break
      }
      case 'month': {
        date.MM = value
        break
      }
      case 'day': {
        date.DD = value
        break
      }
      case 'hour': {
        date.HH = value === '24' ? '00' : value
        break
      }
      case 'minute': {
        date.mm = value
        break
      }
      case 'second': {
        date.ss = value
        break
      }
      default: {
        break
      }
    }
  })
  return date as unknown as DateTime
}

export function formatTimestampByTemplate(dateTimeFormat: Intl.DateTimeFormat, timestamp: number, template: string): string {
  const date = formatTimestampToDateTime(dateTimeFormat, timestamp)
  return template.replace(/YYYY|MM|DD|HH|mm|ss/g, (key) => date[key])
}

export function formatPrecision(value: string | number, precision?: number): string {
  const v = +value
  if (isNumber(v)) {
    return v.toFixed(precision ?? 2)
  }
  return `${value}`
}

export function formatBigNumber(value: string | number): string {
  const v = +value
  if (isNumber(v)) {
    const sign = v < 0 ? '-' : ''
    const a = Math.abs(v)
    if (a >= 1000000000) {
      return `${sign}${+(a / 1000000000).toFixed(3)}B`
    }
    if (a >= 1000000) {
      return `${sign}${+(a / 1000000).toFixed(3)}M`
    }
    if (a >= 1000) {
      return `${sign}${+(a / 1000).toFixed(3)}K`
    }
  }
  return `${value}`
}

export function formatThousands(value: string | number, sign: string): string {
  const vl = `${value}`
  if (sign.length === 0) {
    return vl
  }
  if (vl.includes('.')) {
    const arr = vl.split('.')
    return `${arr[0].replace(/(\d)(?=(\d{3})+$)/g, ($1) => `${$1}${sign}`)}.${arr[1]}`
  }
  return vl.replace(/(\d)(?=(\d{3})+$)/g, ($1) => `${$1}${sign}`)
}

export function formatFoldDecimal(value: string | number, threshold: number): string {
  const vl = `${value}`
  const reg = new RegExp('\\.0{' + threshold + ',}[1-9][0-9]*$')
  if (reg.test(vl)) {
    const result = vl.split('.')
    const lastIndex = result.length - 1
    const v = result[lastIndex]
    const match = /0*/.exec(v)
    if (isValid(match)) {
      const count = match[0].length
      result[lastIndex] = v.replace(/0*/, `0{${count}}`)
      return result.join('.')
    }
  }
  return vl
}

export function formatTemplateString(template: string, params: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = params[key as string]
    if (isValid(value)) {
      return value as string
    }
    return `{${key}}`
  })
}
