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

import type { KLineData } from './Data'
import type Nullable from './Nullable'
import type { TextStyle } from './Styles'
import { calcTextWidth } from './utils/canvas'
import { formatTimestampToDateTime, type DateTime } from './utils/format'
import { isNumber, isValid } from './utils/typeChecks'

export default interface TimeWeightTick {
  weight: number
  dataIndex: number
  timestamp: number
}

export const TimeWeightConstants = {
  Year: 365 * 24 * 3600,
  Month: 30 * 24 * 3600,
  Day: 24 * 3600,
  Hour: 3600,
  Minute: 60,
  Second: 1
}

export function classifyTimeWeightTicks (
  map: Map<number, TimeWeightTick[]>,
  dataList: Array<Pick<KLineData, 'timestamp'>>,
  dateTimeFormat: Intl.DateTimeFormat,
  baseDataIndex = 0,
  minTimeSpan?: { compare: number },
  startTimestamp?: Nullable<number>
): void {
  let prevDateTime: Nullable<DateTime> = null
  let prevTimestamp: Nullable<number> = startTimestamp ?? null
  for (let i = 0; i < dataList.length; i++) {
    const timestamp = dataList[i].timestamp
    let weight = TimeWeightConstants.Minute
    const dateTime = formatTimestampToDateTime(dateTimeFormat, timestamp)
    if (isValid(prevDateTime)) {
      if (dateTime.YYYY !== prevDateTime.YYYY) {
        weight = TimeWeightConstants.Year
      } else if (dateTime.MM !== prevDateTime.MM) {
        weight = TimeWeightConstants.Month
      } else if (dateTime.DD !== prevDateTime.DD) {
        weight = TimeWeightConstants.Day
      } else if (dateTime.HH !== prevDateTime.HH) {
        weight = TimeWeightConstants.Hour
      } else if (dateTime.mm !== prevDateTime.mm) {
        weight = TimeWeightConstants.Minute
      } else {
        weight = TimeWeightConstants.Second
      }
    }
    if (isNumber(prevTimestamp) && isNumber(minTimeSpan?.compare)) {
      minTimeSpan.compare = Math.min(minTimeSpan.compare, timestamp - prevTimestamp)
    }
    const currentTimeWeightList = map.get(weight) ?? []
    currentTimeWeightList.push({ dataIndex: i + baseDataIndex, weight, timestamp })
    map.set(weight, currentTimeWeightList)
    prevDateTime = dateTime
    prevTimestamp = timestamp
  }
}

export function calcBetweenTimeWeightTickBarCount (
  barSpace: number,
  textStyles: Partial<Pick<TextStyle, 'size' | 'weight' | 'family'>>
): number {
  const space = Math.max(calcTextWidth('0000-00-00 00:00:00', textStyles.size, textStyles.weight, textStyles.family), 146)
  return Math.ceil(space / barSpace)
}

export function createTimeWeightTickList (
  map: Map<number, TimeWeightTick[]>,
  barSpace: number,
  textStyles: Partial<Pick<TextStyle, 'size' | 'weight' | 'family'>>
): TimeWeightTick[] {
  const barCount = calcBetweenTimeWeightTickBarCount(barSpace, textStyles)
  let optTimeWeightTickList: TimeWeightTick[] = []
  Array.from(map.keys()).sort((w1, w2) => w2 - w1).forEach(weight => {
    const currentTimeWeightTickList = map.get(weight)!
    const prevOptTimeWeightTickList = optTimeWeightTickList
    optTimeWeightTickList = []

    const prevOptTimeWeightTickListLength = prevOptTimeWeightTickList.length
    let prevOptTimeWeightTickListPointer = 0
    const currentTimeWeightTickListLength = currentTimeWeightTickList.length

    let rightIndex = Infinity
    let leftIndex = -Infinity
    for (let i = 0; i < currentTimeWeightTickListLength; i++) {
      const timeWeightTick = currentTimeWeightTickList[i]
      const currentIndex = timeWeightTick.dataIndex

      while (prevOptTimeWeightTickListPointer < prevOptTimeWeightTickListLength) {
        const lastTimeWeightTick = prevOptTimeWeightTickList[prevOptTimeWeightTickListPointer]
        const lastIndex = lastTimeWeightTick.dataIndex
        if (lastIndex < currentIndex) {
          prevOptTimeWeightTickListPointer++
          optTimeWeightTickList.push(lastTimeWeightTick)
          leftIndex = lastIndex
          rightIndex = Infinity
        } else {
          rightIndex = lastIndex
          break
        }
      }

      if (rightIndex - currentIndex >= barCount && currentIndex - leftIndex >= barCount) {
        optTimeWeightTickList.push(timeWeightTick)
        leftIndex = currentIndex
      }
    }

    for (; prevOptTimeWeightTickListPointer < prevOptTimeWeightTickListLength; prevOptTimeWeightTickListPointer++) {
      optTimeWeightTickList.push(prevOptTimeWeightTickList[prevOptTimeWeightTickListPointer])
    }
  })

  return optTimeWeightTickList
}
