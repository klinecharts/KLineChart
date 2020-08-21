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

import Axis from './Axis'
import { calcTextWidth, getFont } from '../utils/canvas'
import { formatDate } from '../utils/format'
import { isValid, isNumber } from '../utils/typeChecks'

export default class XAxis extends Axis {
  _computeMinMaxValue () {
    const min = this._chartData.from()
    const max = this._chartData.to() - 1
    const range = max - min + 1
    return { min, max, range }
  }

  _computeOptimalTicks (ticks) {
    const optimalTicks = []
    const tickLength = ticks.length
    const dataList = this._chartData.dataList()
    if (tickLength > 0) {
      const dateTimeFormat = this._chartData.dateTimeFormat()
      const tickText = this._chartData.styleOptions().xAxis.tickText
      this._measureCtx.font = getFont(tickText.size, tickText.weight, tickText.family)
      const defaultLabelWidth = calcTextWidth(this._measureCtx, '00-00 00:00')
      const pos = parseInt(ticks[0].v, 10)
      const x = this.convertToPixel(pos)
      let tickCountDif = 1
      if (tickLength > 1) {
        const nextPos = parseInt(ticks[1].v, 10)
        const nextX = this.convertToPixel(nextPos)
        const xDif = Math.abs(nextX - x)
        if (xDif < defaultLabelWidth) {
          tickCountDif = Math.ceil(defaultLabelWidth / xDif)
        }
      }
      for (let i = 0; i < tickLength; i += tickCountDif) {
        const pos = parseInt(ticks[i].v, 10)
        const kLineData = dataList[pos]
        const timestamp = kLineData.timestamp
        let label = formatDate(dateTimeFormat, timestamp, 'hh:mm')
        if (i !== 0) {
          const prePos = parseInt(ticks[i - tickCountDif].v, 10)
          const preKLineData = dataList[prePos]
          const preTimestamp = preKLineData.timestamp
          label = this._optimalTickLabel(dateTimeFormat, timestamp, preTimestamp) || label
        }
        const x = this.convertToPixel(pos)
        optimalTicks.push({ v: label, x, oV: timestamp })
      }
      const optimalTickLength = optimalTicks.length
      if (optimalTickLength === 1) {
        optimalTicks[0].v = formatDate(dateTimeFormat, optimalTicks[0].oV, 'YYYY-MM-DD hh:mm')
      } else {
        const firstTimestamp = optimalTicks[0].oV
        const secondTimestamp = optimalTicks[1].oV
        if (optimalTicks[2]) {
          const thirdV = optimalTicks[2].v
          if (/^[0-9]{2}-[0-9]{2}$/.test(thirdV)) {
            optimalTicks[0].v = formatDate(dateTimeFormat, firstTimestamp, 'MM-DD')
          } else if (/^[0-9]{4}-[0-9]{2}$/.test(thirdV)) {
            optimalTicks[0].v = formatDate(dateTimeFormat, firstTimestamp, 'YYYY-MM')
          } else if (/^[0-9]{4}$/.test(thirdV)) {
            optimalTicks[0].v = formatDate(dateTimeFormat, firstTimestamp, 'YYYY')
          }
        } else {
          optimalTicks[0].v = this._optimalTickLabel(dateTimeFormat, firstTimestamp, secondTimestamp) || optimalTicks[0].v
        }
      }
    }
    return optimalTicks
  }

  _optimalTickLabel (dateTimeFormat, timestamp, comparedTimestamp) {
    const year = formatDate(dateTimeFormat, timestamp, 'YYYY')
    const month = formatDate(dateTimeFormat, timestamp, 'YYYY-MM')
    const day = formatDate(dateTimeFormat, timestamp, 'MM-DD')
    if (year !== formatDate(dateTimeFormat, comparedTimestamp, 'YYYY')) {
      return year
    } else if (month !== formatDate(dateTimeFormat, comparedTimestamp, 'YYYY-MM')) {
      return month
    } else if (day !== formatDate(dateTimeFormat, comparedTimestamp, 'MM-DD')) {
      return day
    }
    return null
  }

  /**
   * 获取自身高度
   */
  getSelfHeight () {
    const stylOptions = this._chartData.styleOptions()
    const xAxisOptions = stylOptions.xAxis
    const height = xAxisOptions.height
    if (isValid(height) && isNumber(+height)) {
      return +height
    }
    const crossHairOptions = stylOptions.floatLayer.crossHair
    let xAxisHeight = 0
    if (xAxisOptions.display) {
      if (xAxisOptions.axisLine.display) {
        xAxisHeight += xAxisOptions.axisLine.size
      }
      if (xAxisOptions.tickLine.display) {
        xAxisHeight += xAxisOptions.tickLine.length
      }
      if (xAxisOptions.tickText.display) {
        xAxisHeight += (xAxisOptions.tickText.paddingTop + xAxisOptions.tickText.paddingBottom + xAxisOptions.tickText.size)
      }
    }
    let crossHairVerticalTextHeight = 0
    if (
      crossHairOptions.display &&
      crossHairOptions.vertical.display &&
      crossHairOptions.vertical.text.display
    ) {
      crossHairVerticalTextHeight += (
        crossHairOptions.vertical.text.paddingTop +
        crossHairOptions.vertical.text.paddingBottom +
        crossHairOptions.vertical.text.borderSize * 2 +
        crossHairOptions.vertical.text.size
      )
    }
    return Math.max(xAxisHeight, crossHairVerticalTextHeight)
  }

  convertFromPixel (pixel) {
    return Math.round(this._chartData.coordinateToFloatIndex(pixel)) - 1
  }

  convertToPixel (value) {
    const dataList = this._chartData.dataList()
    const dataSize = dataList.length
    const dataSpace = this._chartData.dataSpace()
    const deltaFromRight = dataSize + this._chartData.offsetRightBarCount() - value
    return this._width - (deltaFromRight - 0.5) * dataSpace + this._chartData.barSpace() / 2
  }
}
