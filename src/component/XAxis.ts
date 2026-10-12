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

import type Bounding from '../common/Bounding'
import type { KLineData } from '../common/Data'
import type Nullable from '../common/Nullable'
import { PeriodTypeXAxisFormat } from '../common/Period'
import type PickRequired from '../common/PickRequired'
import { calcTextWidth } from '../common/utils/canvas'
import { type DateTime, formatTimestampToDateTime } from '../common/utils/format'
import { isFunction, isNumber, isString, isValid } from '../common/utils/typeChecks'
import type DrawPane from '../pane/DrawPane'
import AxisImp, { type Axis, type AxisOverride, type AxisRange, type AxisTick, TICK_COUNT } from './Axis'

interface TimeTick {
  dataIndex: number
  timestamp: number
  weight: number
}

interface TimeTickSourceCache {
  dataList: KLineData[]
  dataCount: number
  firstTimestamp: number | undefined
  lastTimestamp: number | undefined
  dateTimeFormat: Intl.DateTimeFormat
  endDataIndex: number
  ticksByWeight: TimeTick[][]
}

interface TimeTickCache {
  source: TimeTickSourceCache
  tickBetweenBarCount: number
  ticks: TimeTick[]
}

const TimeWeight = {
  Year: 6,
  Month: 5,
  Day: 4,
  Hour: 3,
  Minute: 2,
  Second: 1,
  Unknown: 0
} as const

function getTimeWeight(dateTime: DateTime, previousDateTime: DateTime): number {
  if (dateTime.YYYY !== previousDateTime.YYYY) {
    return TimeWeight.Year
  }
  if (dateTime.MM !== previousDateTime.MM) {
    return TimeWeight.Month
  }
  if (dateTime.DD !== previousDateTime.DD) {
    return TimeWeight.Day
  }
  if (dateTime.HH !== previousDateTime.HH) {
    return TimeWeight.Hour
  }
  if (dateTime.mm !== previousDateTime.mm) {
    return TimeWeight.Minute
  }
  return TimeWeight.Second
}

function selectTimeTicks(ticksByWeight: TimeTick[][], tickBetweenBarCount: number): TimeTick[] {
  let selectedTicks: TimeTick[] = []
  for (let weight = TimeWeight.Year; weight >= TimeWeight.Unknown; weight--) {
    const previousSelectedTicks = selectedTicks
    selectedTicks = []

    let previousSelectedTickPointer = 0
    let leftDataIndex = -Infinity
    let rightDataIndex = Infinity
    const currentTicks = ticksByWeight[weight]

    for (const tick of currentTicks) {
      while (previousSelectedTickPointer < previousSelectedTicks.length) {
        const selectedTick = previousSelectedTicks[previousSelectedTickPointer]
        if (selectedTick.dataIndex < tick.dataIndex) {
          selectedTicks.push(selectedTick)
          previousSelectedTickPointer++
          leftDataIndex = selectedTick.dataIndex
          rightDataIndex = Infinity
        } else {
          rightDataIndex = selectedTick.dataIndex
          break
        }
      }

      if (tick.dataIndex - leftDataIndex >= tickBetweenBarCount && rightDataIndex - tick.dataIndex >= tickBetweenBarCount) {
        selectedTicks.push(tick)
        leftDataIndex = tick.dataIndex
      }
    }

    for (; previousSelectedTickPointer < previousSelectedTicks.length; previousSelectedTickPointer++) {
      selectedTicks.push(previousSelectedTicks[previousSelectedTickPointer])
    }
  }

  return selectedTicks
}

function findFirstVisibleTick(ticks: TimeTick[], dataIndex: number): number {
  let left = 0
  let right = ticks.length
  while (left < right) {
    const middle = Math.floor((left + right) / 2)
    if (ticks[middle].dataIndex < dataIndex) {
      left = middle + 1
    } else {
      right = middle
    }
  }
  return left
}

export type XAxisOverride = Pick<AxisOverride, 'name' | 'scrollZoomEnabled' | 'createTicks'>

export type XAxisTemplate = PickRequired<XAxisOverride, 'name'>

export interface XAxis extends Axis, Required<XAxisTemplate> {
  convertTimestampFromPixel: (pixel: number) => Nullable<number>
  convertTimestampToPixel: (timestamp: number) => number
}

export type XAxisConstructor = new (parent: DrawPane) => XAxis

export default abstract class XAxisImp extends AxisImp implements XAxis {
  private _timeTickSourceCache: Nullable<TimeTickSourceCache> = null
  private _timeTickCache: Nullable<TimeTickCache> = null

  constructor(parent: DrawPane, xAxis: XAxisTemplate) {
    super(parent)
    this.override(xAxis)
  }

  override(xAxis: AxisOverride): void {
    const { name, scrollZoomEnabled, createTicks } = xAxis
    if (!isString(this.name) && isString(name)) {
      this.name = name
    }
    this.scrollZoomEnabled = scrollZoomEnabled ?? this.scrollZoomEnabled
    this.createTicks = createTicks ?? this.createTicks
  }

  protected override createRangeImp(): AxisRange {
    const chartStore = this.getParent().getChart().getChartStore()
    const visibleDataRange = chartStore.getVisibleRange()
    const { realFrom, realTo } = visibleDataRange
    const af = realFrom
    const at = realTo
    const diff = realTo - realFrom + 1
    const range = {
      from: af,
      to: at,
      range: diff,
      realFrom: af,
      realTo: at,
      realRange: diff,
      displayFrom: af,
      displayTo: at,
      displayRange: diff
    }
    return range
  }

  protected override createTicksImp(): AxisTick[] {
    const { realTo, from } = this.getRange()
    const chartStore = this.getParent().getChart().getChartStore()
    const formatDate = chartStore.getInnerFormatter().formatDate
    const dateTimeFormat = chartStore.getDateTimeFormat()
    const period = chartStore.getPeriod()

    const barSpace = chartStore.getBarSpace().bar
    const textStyles = chartStore.getStyles().xAxis.tickText
    const tickTextWidth = Math.max(calcTextWidth('YYYY-MM-DD HH:mm:ss', textStyles.size, textStyles.weight, textStyles.family), this.getBounding().width / TICK_COUNT)
    const tickBetweenBarCount = Math.ceil(tickTextWidth / barSpace)

    const dataList = chartStore.getDataList()
    const dataCount = dataList.length
    const firstTimestamp = dataList[0]?.timestamp
    const lastTimestamp = dataList[dataCount - 1]?.timestamp
    const minCacheEndDataIndex = Math.ceil(realTo) + tickBetweenBarCount

    // Keep classification independent from the viewport so scrolling only slices stable ticks.
    const sourceCache = this._timeTickSourceCache
    const sourceCacheInvalid =
      !isValid(sourceCache) || sourceCache.dataList !== dataList || sourceCache.dataCount !== dataCount || sourceCache.firstTimestamp !== firstTimestamp || sourceCache.lastTimestamp !== lastTimestamp || sourceCache.dateTimeFormat !== dateTimeFormat || sourceCache.endDataIndex < minCacheEndDataIndex

    if (sourceCacheInvalid) {
      const visibleBarCount = Math.ceil(this.getBounding().width / barSpace)
      const endDataIndex = Math.max(dataCount + visibleBarCount, minCacheEndDataIndex + visibleBarCount)
      const ticksByWeight = Array.from({ length: TimeWeight.Year + 1 }, (): TimeTick[] => [])
      let previousDateTime: Nullable<DateTime> = null

      for (let dataIndex = 0; dataIndex < endDataIndex; dataIndex++) {
        const timestamp = chartStore.dataIndexToTimestamp(dataIndex)
        if (isNumber(timestamp)) {
          const dateTime = formatTimestampToDateTime(dateTimeFormat, timestamp)
          const weight = previousDateTime === null ? TimeWeight.Unknown : getTimeWeight(dateTime, previousDateTime)
          ticksByWeight[weight].push({ dataIndex, timestamp, weight })
          previousDateTime = dateTime
        }
      }

      this._timeTickSourceCache = {
        dataList,
        dataCount,
        firstTimestamp,
        lastTimestamp,
        dateTimeFormat,
        endDataIndex,
        ticksByWeight
      }
    }

    const currentSourceCache = this._timeTickSourceCache!
    const cache = this._timeTickCache
    if (cache === null || cache.source !== currentSourceCache || cache.tickBetweenBarCount !== tickBetweenBarCount) {
      this._timeTickCache = {
        source: currentSourceCache,
        tickBetweenBarCount,
        ticks: selectTimeTicks(currentSourceCache.ticksByWeight, tickBetweenBarCount)
      }
    }

    const timeTicks = this._timeTickCache!.ticks
    const ticks: AxisTick[] = []
    const firstVisibleTick = findFirstVisibleTick(timeTicks, from)
    for (let i = firstVisibleTick; i < timeTicks.length; i++) {
      const { dataIndex, timestamp, weight } = timeTicks[i]
      if (dataIndex >= realTo) {
        break
      }
      let template = PeriodTypeXAxisFormat[period?.type ?? 'day']
      switch (weight) {
        case TimeWeight.Year: {
          template = 'YYYY'
          break
        }
        case TimeWeight.Month: {
          template = 'YYYY-MM'
          break
        }
        case TimeWeight.Day: {
          template = 'MM-DD'
          break
        }
        case TimeWeight.Hour:
        case TimeWeight.Minute: {
          template = 'HH:mm'
          break
        }
        case TimeWeight.Second: {
          template = 'HH:mm:ss'
          break
        }
      }
      ticks.push({
        coord: this.convertToPixel(dataIndex),
        value: timestamp,
        text: formatDate(timestamp, template, 'xAxis')
      })
    }

    if (isFunction(this.createTicks)) {
      return this.createTicks({
        range: this.getRange(),
        bounding: this.getBounding(),
        defaultTicks: ticks
      })
    }
    return ticks
  }

  override getAutoSize(): number {
    const styles = this.getParent().getChart().getStyles()
    const xAxisStyles = styles.xAxis
    const height = xAxisStyles.size
    if (height !== 'auto') {
      return height
    }
    const crosshairStyles = styles.crosshair
    let xAxisHeight = 0
    if (xAxisStyles.show) {
      if (xAxisStyles.axisLine.show) {
        xAxisHeight += xAxisStyles.axisLine.size
      }
      if (xAxisStyles.tickLine.show) {
        xAxisHeight += xAxisStyles.tickLine.length
      }
      if (xAxisStyles.tickText.show) {
        xAxisHeight += xAxisStyles.tickText.marginStart + xAxisStyles.tickText.marginEnd + xAxisStyles.tickText.size
      }
    }
    let crosshairVerticalTextHeight = 0
    if (crosshairStyles.show && crosshairStyles.vertical.show && crosshairStyles.vertical.text.show) {
      crosshairVerticalTextHeight += crosshairStyles.vertical.text.paddingTop + crosshairStyles.vertical.text.paddingBottom + crosshairStyles.vertical.text.borderSize * 2 + crosshairStyles.vertical.text.size
    }
    return Math.max(xAxisHeight, crosshairVerticalTextHeight)
  }

  protected override getBounding(): Bounding {
    return this.getParent().getMainWidget().getBounding()
  }

  convertTimestampFromPixel(pixel: number): Nullable<number> {
    const chartStore = this.getParent().getChart().getChartStore()
    const dataIndex = chartStore.coordinateToDataIndex(pixel)
    return chartStore.dataIndexToTimestamp(dataIndex)
  }

  convertTimestampToPixel(timestamp: number): number {
    const chartStore = this.getParent().getChart().getChartStore()
    const dataIndex = chartStore.timestampToDataIndex(timestamp)
    return chartStore.dataIndexToCoordinate(dataIndex)
  }

  convertFromPixel(pixel: number): number {
    return this.getParent().getChart().getChartStore().coordinateToDataIndex(pixel)
  }

  convertToPixel(value: number): number {
    return this.getParent().getChart().getChartStore().dataIndexToCoordinate(value)
  }

  static extend(template: XAxisTemplate): XAxisConstructor {
    class Custom extends XAxisImp {
      constructor(parent: DrawPane) {
        super(parent, template)
      }
    }
    return Custom
  }
}
