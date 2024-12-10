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

import type Nullable from '../common/Nullable'
import type Bounding from '../common/Bounding'
import { isFunction, isNumber, isString, isValid } from '../common/utils/typeChecks'
import { type DateTime, formatTimestampToDateTime } from '../common/utils/format'

import AxisImp, { type AxisTemplate, type Axis, type AxisRange, type AxisTick, type AxisMinSpanCallback } from './Axis'

import type DrawPane from '../pane/DrawPane'
import { FormatDateType } from '../Options'
import { calcTextWidth } from '../common/utils/canvas'

export type XAxisTemplate = Pick<AxisTemplate, 'name' | 'scrollZoomEnabled' | 'createTicks' | 'minSpan'>

export interface XAxis extends Axis, Required<XAxisTemplate> {
  convertTimestampFromPixel: (pixel: number) => Nullable<number>
  convertTimestampToPixel: (timestamp: number) => number
}

export type XAxisConstructor = new (parent: DrawPane) => XAxis

export interface TimeWeightTick {
  weight: number
  dataIndex: number
  dateTime: DateTime
  timestamp: number
}

export const TimeWeightConstants = {
  Year: 365 * 24 * 3600,
  Month: 30 * 24 * 3600,
  Day: 24 * 3600,
  Hour: 3600,
  Minute: 60,
  Second: 1,
  Unknown: -1
}

export default abstract class XAxisImp extends AxisImp implements XAxis {
  minSpan: AxisMinSpanCallback

  constructor (parent: DrawPane, xAxis: XAxisTemplate) {
    super(parent)
    this.override(xAxis)
  }

  override (xAxis: XAxisTemplate): void {
    const {
      name,
      scrollZoomEnabled,
      minSpan,
      createTicks
    } = xAxis
    if (!isString(this.name)) {
      this.name = name
    }
    this.scrollZoomEnabled = scrollZoomEnabled ?? this.scrollZoomEnabled
    this.createTicks = createTicks ?? this.createTicks
    this.minSpan = minSpan ?? this.minSpan
  }

  protected override createRangeImp (): AxisRange {
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

  protected override createTicksImp (): AxisTick[] {
    const { realFrom, realTo } = this.getRange()
    const chartStore = this.getParent().getChart().getChartStore()
    const dataList = chartStore.getDataList()
    const dateTimeFormat = chartStore.getDateTimeFormat()

    const styles = chartStore.getStyles().xAxis.tickText
    const textWidth = calcTextWidth('0000-00-00 00:00:00', styles.size, styles.weight, styles.family)
    const barCount = Math.ceil(textWidth / chartStore.getBarSpace().bar)
    let visibleFrom = Math.floor(realFrom / barCount) * barCount
    if (visibleFrom > dataList.length - 1) {
      visibleFrom = dataList.length -1
    }

    const timeWeightTicks = new Map<number, TimeWeightTick[]>()
    
    let timeDiff = -1
    if (isFunction(this.minSpan)) {
      timeDiff = this.minSpan()
    }
    
    let prevDateTime: Nullable<DateTime> = null
    let prevTimestamp: Nullable<number> = null
    if (isValid(dataList[visibleFrom - 1])) {
      prevDateTime = formatTimestampToDateTime(dateTimeFormat, dataList[visibleFrom - 1].timestamp)
    }

    for (let i = visibleFrom; i < realTo; i++) {
      const kLineData = dataList[i]
      let timestamp: Nullable<number> = null
      if (isValid(kLineData)) {
        timestamp = kLineData.timestamp
      } else {
        if (isNumber(prevTimestamp) && timeDiff > 0) {
          timestamp = prevTimestamp + timeDiff
        }
      }
      if (isNumber(timestamp)) {
        let weight = TimeWeightConstants.Unknown
        const dateTime = formatTimestampToDateTime(dateTimeFormat, timestamp)
        if (isValid(prevTimestamp)) {
          const pdt = prevDateTime!
          if (dateTime.YYYY !== pdt.YYYY) {
            weight = TimeWeightConstants.Year
          } else if (dateTime.MM !== pdt.MM) {
            weight = TimeWeightConstants.Month
          } else if (dateTime.DD !== pdt.DD) {
            weight = TimeWeightConstants.Day
          } else if (dateTime.HH !== pdt.HH) {
            weight = TimeWeightConstants.Hour
          } else if (dateTime.mm !== pdt.mm) {
            weight = TimeWeightConstants.Minute
          } else if (dateTime.ss !== pdt.ss) {
            weight = TimeWeightConstants.Second
          }
        }
        const currentTimeWeightTickList = timeWeightTicks.get(weight) ?? new Array<TimeWeightTick>
        currentTimeWeightTickList.push({ dataIndex: i, weight, dateTime, timestamp })
        timeWeightTicks.set(weight, currentTimeWeightTickList)
        prevDateTime = dateTime
        prevTimestamp = timestamp
      }
    }

    let timeWeightTickList: TimeWeightTick[] = []
    const sortWeights = Array.from(timeWeightTicks.keys()).sort((w1, w2) => w2 - w1)
    
    sortWeights.forEach(key => {
      const prevTickList = timeWeightTickList
      timeWeightTickList = []

      const prevTickListLength = prevTickList.length
      let prevTickListPointer = 0
      const currentTicks = timeWeightTicks.get(key)!
      const currentTicksLength = currentTicks.length

      let rightIndex = Infinity
      let leftIndex = -Infinity
      for (let i = 0; i < currentTicksLength; i++) {
        const tick = currentTicks[i]
        const currentIndex = tick.dataIndex

        while (prevTickListPointer < prevTickListLength) {
          const lastMark = prevTickList[prevTickListPointer]
          const lastIndex = lastMark.dataIndex
          if (lastIndex < currentIndex) {
            prevTickListPointer++
            timeWeightTickList.push(lastMark)
            leftIndex = lastIndex
            rightIndex = Infinity
          } else {
            rightIndex = lastIndex
            break
          }
        }

        if (rightIndex - currentIndex >= barCount && currentIndex - leftIndex >= barCount) {
          timeWeightTickList.push(tick)
          leftIndex = currentIndex
        }
      }
      for (; prevTickListPointer < prevTickListLength; prevTickListPointer++) {
        timeWeightTickList.push(prevTickList[prevTickListPointer])
      }
    })

    const formatDate = chartStore.getCustomApi().formatDate
    const ticks: AxisTick[] = []
    for (const tick of timeWeightTickList) {
      if (tick.dataIndex >= visibleFrom && tick.dataIndex < realTo) {
        const { timestamp, weight, dataIndex } = tick
        let text = ''
        switch (weight) {
          case TimeWeightConstants.Year: {
            text = formatDate(timestamp, 'YYYY', FormatDateType.XAxis)
            break
          }
          case TimeWeightConstants.Month: {
            text = formatDate(timestamp, 'YYYY-MM', FormatDateType.XAxis)
            break
          }
          case TimeWeightConstants.Day: {
            text = formatDate(timestamp, 'MM-DD', FormatDateType.XAxis)
            break
          }
          case TimeWeightConstants.Hour:
          case TimeWeightConstants.Minute: {
            text = formatDate(timestamp, 'HH:mm', FormatDateType.XAxis)
            break
          }
          case TimeWeightConstants.Second:  {
            text = formatDate(timestamp, 'mm:ss', FormatDateType.XAxis)
            break
          }
          default: {
            text = formatDate(timestamp, 'YYYY-MM-DD HH:mm', FormatDateType.XAxis)
            break
          }
        }
        ticks.push({
          coord: this.convertToPixel(dataIndex),
          text,
          value: timestamp
        })
      }
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

  override getAutoSize (): number {
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
        xAxisHeight += (xAxisStyles.tickText.marginStart + xAxisStyles.tickText.marginEnd + xAxisStyles.tickText.size)
      }
    }
    let crosshairVerticalTextHeight = 0
    if (
      crosshairStyles.show &&
      crosshairStyles.vertical.show &&
      crosshairStyles.vertical.text.show
    ) {
      crosshairVerticalTextHeight += (
        crosshairStyles.vertical.text.paddingTop +
        crosshairStyles.vertical.text.paddingBottom +
        crosshairStyles.vertical.text.borderSize * 2 +
        crosshairStyles.vertical.text.size
      )
    }
    return Math.max(xAxisHeight, crosshairVerticalTextHeight)
  }

  protected override getBounding (): Bounding {
    return this.getParent().getMainWidget().getBounding()
  }

  convertTimestampFromPixel (pixel: number): Nullable<number> {
    const chartStore = this.getParent().getChart().getChartStore()
    const dataIndex = chartStore.coordinateToDataIndex(pixel)
    return chartStore.dataIndexToTimestamp(dataIndex)
  }

  convertTimestampToPixel (timestamp: number): number {
    const chartStore = this.getParent().getChart().getChartStore()
    const dataIndex = chartStore.timestampToDataIndex(timestamp)
    return chartStore.dataIndexToCoordinate(dataIndex)
  }

  convertFromPixel (pixel: number): number {
    return this.getParent().getChart().getChartStore().coordinateToDataIndex(pixel)
  }

  convertToPixel (value: number): number {
    return this.getParent().getChart().getChartStore().dataIndexToCoordinate(value)
  }

  static extend (template: XAxisTemplate): XAxisConstructor {
    class Custom extends XAxisImp {
      constructor (parent: DrawPane) {
        super(parent, template)
      }
    }
    return Custom
  }
}
