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
 * Binary search for the nearest result
 * @param dataList
 * @param valueKey
 * @param targetValue
 * @return {number}
 */
export function binarySearchNearest<T>(dataList: T[], valueKey: keyof T, targetValue: T[keyof T]): number {
  let left = 0
  let right = dataList.length - 1
  let leftValue = dataList[left][valueKey]
  let rightValue = dataList[right][valueKey]
  while (left !== right) {
    const span = right - left
    const midIndex = left + Math.floor(span / 2)
    if (targetValue === leftValue) {
      return left
    }
    if (targetValue === rightValue) {
      return right
    }
    const midValue = dataList[midIndex][valueKey]
    if (targetValue === midValue) {
      return midIndex
    }

    if (targetValue > midValue) {
      left = midIndex
      leftValue = midValue
    } else {
      right = midIndex
      rightValue = midValue
    }

    if (span <= 2) {
      break
    }
  }
  let nearestIndex = left
  const numericTarget = Number(targetValue)
  let nearestDistance = Math.abs(Number(leftValue) - numericTarget)
  for (let i = left + 1; i <= right; i++) {
    const distance = Math.abs(Number(i === right ? rightValue : dataList[i][valueKey]) - numericTarget)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestIndex = i
    }
  }
  return nearestIndex
}

/**
 * 优化数字
 * @param value
 * @return {number|number}
 */
export function nice(value: number): number {
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
  return +value.toFixed(Math.abs(exponent))
}

/**
 * Round
 * @param value
 * @param precision
 * @return {number}
 */
export function round(value: number, precision?: number): number {
  precision = Math.max(0, precision ?? 0)
  const pow = Math.pow(10, precision)
  return Math.round(value * pow) / pow
}

/**
 * Get precision
 * @param value
 * @return {number|number}
 */
export function getPrecision(value: number): number {
  const str = value.toString()
  const eIndex = str.indexOf('e')
  if (eIndex > 0) {
    const precision = +str.slice(eIndex + 1)
    return precision < 0 ? -precision : 0
  }
  const dotIndex = str.indexOf('.')
  return dotIndex < 0 ? 0 : str.length - 1 - dotIndex
}

export function getMaxMin<D>(dataList: D[], maxKey: keyof D, minKey: keyof D): number[] {
  const maxMin = [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
  const dataLength = dataList.length
  let index = 0
  while (index < dataLength) {
    const data = dataList[index]
    maxMin[0] = Math.max((data[maxKey] ?? Number.MIN_SAFE_INTEGER) as number, maxMin[0])
    maxMin[1] = Math.min((data[minKey] ?? Number.MAX_SAFE_INTEGER) as number, maxMin[1])
    ++index
  }
  return maxMin
}

/**
 * Sliding window that tracks the max of `maxKey` and the min of `minKey` over
 * the last `window` items, advancing one item at a time. Two monotonic lists
 * keep the candidates, so each `getMaxMin` call is amortised O(1) instead of
 * rescanning (and slicing) the whole window on every item.
 *
 * The selection is exact: it returns the same items `getMaxMin` picks, including
 * its `null` / `undefined` fallbacks and the `NaN` behaviour of Math.max/Math.min.
 */
export class RollingMaxMin<D> {
  private readonly _dataList: D[]
  private readonly _maxKey: keyof D
  private readonly _minKey: keyof D
  private readonly _maxIndexList: number[] = []
  private readonly _minIndexList: number[] = []
  private _maxHead = 0
  private _minHead = 0
  private _maxNanCount = 0
  private _minNanCount = 0

  constructor(dataList: D[], maxKey: keyof D, minKey: keyof D) {
    this._dataList = dataList
    this._maxKey = maxKey
    this._minKey = minKey
  }

  /**
   * Append the item at `index` to the window and return the `[max, min]` of the
   * `window` items ending at `index`.
   */
  getMaxMin(index: number, window: number): number[] {
    const dataList = this._dataList
    const maxKey = this._maxKey
    const minKey = this._minKey
    const maxIndexList = this._maxIndexList
    const minIndexList = this._minIndexList
    const maxValue = (dataList[index][maxKey] ?? Number.MIN_SAFE_INTEGER) as number
    const minValue = (dataList[index][minKey] ?? Number.MAX_SAFE_INTEGER) as number
    // A NaN anywhere in the window makes Math.max/Math.min return NaN, so such
    // items stay out of the monotonic lists and are tracked by count instead.
    if (Number.isNaN(maxValue)) {
      this._maxNanCount += 1
    } else {
      while (maxIndexList.length > this._maxHead && ((dataList[maxIndexList[maxIndexList.length - 1]][maxKey] ?? Number.MIN_SAFE_INTEGER) as number) <= maxValue) {
        maxIndexList.pop()
      }
      maxIndexList.push(index)
    }
    if (Number.isNaN(minValue)) {
      this._minNanCount += 1
    } else {
      while (minIndexList.length > this._minHead && ((dataList[minIndexList[minIndexList.length - 1]][minKey] ?? Number.MAX_SAFE_INTEGER) as number) >= minValue) {
        minIndexList.pop()
      }
      minIndexList.push(index)
    }
    const expired = index - window
    if (expired >= 0) {
      if (Number.isNaN((dataList[expired][maxKey] ?? Number.MIN_SAFE_INTEGER) as number)) {
        this._maxNanCount -= 1
      }
      if (Number.isNaN((dataList[expired][minKey] ?? Number.MAX_SAFE_INTEGER) as number)) {
        this._minNanCount -= 1
      }
    }
    const first = expired + 1
    while (maxIndexList[this._maxHead] < first) {
      this._maxHead += 1
    }
    while (minIndexList[this._minHead] < first) {
      this._minHead += 1
    }
    return [this._maxNanCount > 0 ? NaN : ((dataList[maxIndexList[this._maxHead]][maxKey] ?? Number.MIN_SAFE_INTEGER) as number), this._minNanCount > 0 ? NaN : ((dataList[minIndexList[this._minHead]][minKey] ?? Number.MAX_SAFE_INTEGER) as number)]
  }
}

/**
 * log10
 * @param value
 * @return {number}
 */
export function log10(value: number): number {
  if (value === 0) {
    return 0
  }
  return Math.log10(value)
}

/**
 * index 10
 * @param value
 * @return {number}
 */
export function index10(value: number): number {
  return Math.pow(10, value)
}
