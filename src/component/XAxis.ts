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
import { isFunction, isString } from '../common/utils/typeChecks'

import AxisImp, { type AxisTemplate, type Axis, type AxisRange, type AxisTick } from './Axis'

import type DrawPane from '../pane/DrawPane'
import { TimeWeightConstants } from '../Store'
import { FormatDateType } from '../Options'

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
    const { from, to } = visibleDataRange
    const af = from
    const at = to - 1
    const diff = to - from
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
    const chartStore = this.getParent().getChart().getChartStore()
    const formatDate = chartStore.getCustomApi().formatDate
    const timeTickList = chartStore.getVisibleRangeTimeTickList()
    const ticks = timeTickList.map(({ dataIndex, weight, timestamp }) => {
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
        default: {
          text = formatDate(timestamp, 'HH:mm:ss', FormatDateType.XAxis)
          break
        }
      }
      return {
        coord: this.convertToPixel(dataIndex),
        text,
        value: timestamp
      }
    })
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
