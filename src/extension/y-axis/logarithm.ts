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

import { index10, log10 } from '../../common/utils/number'
import type { AxisTemplate, AxisTick } from '../../component/Axis'

const MIN_TICK_SPACING = 24

function formatTickValue(value: number, decade: number): string {
  return decade < 0 ? value.toFixed(-decade) : `${value}`
}

function valueToLogarithm(value: number): number {
  return value < 0 ? -log10(1 - value) : log10(1 + value)
}

function logarithmToValue(value: number): number {
  return value < 0 ? 1 - index10(-value) : index10(value) - 1
}

const logarithm: AxisTemplate = {
  name: 'logarithm',
  minSpan: (precision) => 0.05 * index10(-precision),
  valueToRealValue: (value) => valueToLogarithm(value),
  realValueToDisplayValue: (value) => logarithmToValue(value),
  displayValueToRealValue: (value) => valueToLogarithm(value),
  realValueToValue: (value) => logarithmToValue(value),
  createRange: ({ defaultRange }) => {
    const { from, to, range } = defaultRange
    const realFrom = valueToLogarithm(from)
    const realTo = valueToLogarithm(to)
    return {
      from,
      to,
      range,
      realFrom,
      realTo,
      realRange: realTo - realFrom,
      displayFrom: from,
      displayTo: to,
      displayRange: range
    }
  },
  createTicks: ({ range, bounding, defaultTicks }) => {
    const { from, to, realFrom, realTo, realRange } = range
    const height = bounding.height
    const ticks: AxisTick[] = []

    if (realRange <= 0 || height <= 0) {
      return defaultTicks
    }

    // Linearly spaced display ticks bunch up where the log scale compresses
    // prices, so subdivide the range by decade instead: values m * 10^d with
    // the densest standard mantissa set (1-9, 1-2-5 or 1) that stays readable.
    const decadeHeight = height / realRange
    const minAnchorReal = realRange * (MIN_TICK_SPACING / height)
    const mantissas = decadeHeight * log10(10 / 9) > MIN_TICK_SPACING ? [9, 8, 7, 6, 5, 4, 3, 2, 1] : decadeHeight * log10(2) > MIN_TICK_SPACING ? [5, 2, 1] : [1]

    let validY = NaN
    for (const sign of [1, -1]) {
      const signRealTo = sign > 0 ? realTo : -realFrom
      if (signRealTo <= 0) {
        continue
      }
      const toDecade = Math.ceil(signRealTo)
      // Values at the range edge can sit below the sign's anchor, so derive
      // the lowest decade from the display range itself, capping how far
      // below the top decade we scan when the range crosses zero.
      const edgeValue = sign > 0 ? from : -to
      const fromDecade = edgeValue > 0 ? Math.floor(log10(edgeValue)) : toDecade - 8
      for (let d = toDecade; d >= fromDecade; d--) {
        for (const m of mantissas) {
          const value = sign * m * index10(d)
          const realValue = valueToLogarithm(value)
          // Skip values outside the range and values crowding the zero
          // anchor, where the log scale compresses them into one pixel row.
          if (realValue < realFrom || realValue > realTo || Math.abs(realValue) < minAnchorReal) {
            continue
          }
          const coord = Math.round((1 - (realValue - realFrom) / realRange) * height)
          if (!Number.isNaN(validY) && Math.abs(validY - coord) <= MIN_TICK_SPACING) {
            continue
          }
          validY = coord
          const text = (sign < 0 ? '-' : '') + formatTickValue(m * index10(d), d)
          ticks.push({ text, coord, value: text })
        }
      }
    }
    // A range sitting inside a single decade yields almost no standard
    // ticks; the linearly spaced default ticks are the better fallback then.
    return ticks.length < 2 ? defaultTicks : ticks
  }
}

export default logarithm
