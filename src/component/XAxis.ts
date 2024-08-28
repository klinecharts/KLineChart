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

import AxisImp, { type AxisTemplate, type Axis, type AxisRange, type AxisTick, type AxisCreateTicksParams } from './Axis'

import type DrawPane from '../pane/DrawPane'
import { TimeWeightConstants } from '../store/TimeScaleStore'

export type XAxis = Axis

export type XAxisConstructor = new (parent: DrawPane<AxisImp>) => XAxisImp

export default abstract class XAxisImp extends AxisImp {
  protected calcRange (): AxisRange {
    const chartStore = this.getParent().getChart().getChartStore()
    const { from, to } = chartStore.getTimeScaleStore().getVisibleRange()
    const af = from
    const at = to - 1
    const range = to - from
    return {
      from: af, to: at, range, realFrom: af, realTo: at, realRange: range
    }
  }

  protected override calcTicks (): AxisTick[] {
    const timeTickList = this.getParent().getChart().getChartStore().getTimeScaleStore().getVisibleTimeTickList()
    return timeTickList.map(({ dataIndex, dateTime, weight, timestamp }) => {
      let text = ''
      switch (weight) {
        case TimeWeightConstants.Year: {
          text = dateTime.YYYY
          break
        }
        case TimeWeightConstants.Month: {
          text = `${dateTime.YYYY}-${dateTime.MM}`
          break
        }
        case TimeWeightConstants.Day: {
          text = `${dateTime.MM}-${dateTime.DD}`
          break
        }
        case TimeWeightConstants.Hour:
        case TimeWeightConstants.Minute: {
          text = `${dateTime.HH}-${dateTime.mm}`
          break
        }
        default: {
          text = `${dateTime.HH}-${dateTime.mm}-${dateTime.ss}`
          break
        }
      }
      return {
        coord: this.convertToPixel(dataIndex),
        text,
        value: timestamp
      }
    })
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

  getSelfBounding (): Bounding {
    return this.getParent().getMainWidget().getBounding()
  }

  convertTimestampFromPixel (pixel: number): Nullable<number> {
    const timeScaleStore = this.getParent().getChart().getChartStore().getTimeScaleStore()
    const dataIndex = timeScaleStore.coordinateToDataIndex(pixel)
    return timeScaleStore.dataIndexToTimestamp(dataIndex)
  }

  convertTimestampToPixel (timestamp: number): number {
    const timeScaleStore = this.getParent().getChart().getChartStore().getTimeScaleStore()
    const dataIndex = timeScaleStore.timestampToDataIndex(timestamp)
    return timeScaleStore.dataIndexToCoordinate(dataIndex)
  }

  convertFromPixel (pixel: number): number {
    return this.getParent().getChart().getChartStore().getTimeScaleStore().coordinateToDataIndex(pixel)
  }

  convertToPixel (value: number): number {
    return this.getParent().getChart().getChartStore().getTimeScaleStore().dataIndexToCoordinate(value)
  }

  static extend (template: AxisTemplate): XAxisConstructor {
    class Custom extends XAxisImp {
      createTicks (params: AxisCreateTicksParams): AxisTick[] {
        return template.createTicks(params)
      }
    }
    return Custom
  }
}
