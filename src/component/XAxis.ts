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
import { isFunction, isNumber, isString } from '../common/utils/typeChecks'

import AxisImp, { type AxisTemplate, type Axis, type AxisRange, type AxisTick } from './Axis'

import type DrawPane from '../pane/DrawPane'
import { calcTextWidth } from '../common/utils/canvas'
import { PeriodTypeXAxisFormat } from '../common/Period'

export type XAxisTemplate = Pick<AxisTemplate, 'name' | 'scrollZoomEnabled' | 'createTicks'>

export interface XAxis extends Axis, Required<XAxisTemplate> {
  convertTimestampFromPixel: (pixel: number) => Nullable<number>
  convertTimestampToPixel: (timestamp: number) => number
}

export type XAxisConstructor = new (parent: DrawPane) => XAxis

export default abstract class XAxisImp extends AxisImp implements XAxis {
  constructor (parent: DrawPane, xAxis: XAxisTemplate) {
    super(parent)
    this.override(xAxis)
  }

  override (xAxis: XAxisTemplate): void {
    const {
      name,
      scrollZoomEnabled,
      createTicks
    } = xAxis
    if (!isString(this.name)) {
      this.name = name
    }
    this.scrollZoomEnabled = scrollZoomEnabled ?? this.scrollZoomEnabled
    this.createTicks = createTicks ?? this.createTicks
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
    const { realFrom, realTo, from } = this.getRange()
    const chartStore = this.getParent().getChart().getChartStore()
    const formatDate = chartStore.getInnerFormatter().formatDate
    const period = chartStore.getPeriod()
    const ticks: AxisTick[] = []

    const barSpace = chartStore.getBarSpace().bar
    const textStyles = chartStore.getStyles().xAxis.tickText
    const tickTextWidth = Math.max(calcTextWidth('YYYY-MM-DD HH:mm:ss', textStyles.size, textStyles.weight, textStyles.family), this.getBounding().width / 8)
    let tickBetweenBarCount = Math.ceil(tickTextWidth / barSpace)
    if (tickBetweenBarCount % 2 !== 0) {
      tickBetweenBarCount += 1
    }
    const startDataIndex = Math.max(0, Math.floor(realFrom / tickBetweenBarCount) * tickBetweenBarCount)

    for (let i = startDataIndex; i < realTo; i += tickBetweenBarCount) {
      if (i >= from) {
        const timestamp = chartStore.dataIndexToTimestamp(i)
        if (isNumber(timestamp)) {
          ticks.push({
            coord: this.convertToPixel(i),
            value: timestamp,
            text: formatDate(timestamp, PeriodTypeXAxisFormat[period?.type ?? 'day'], 'xAxis')
          })
        }
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
