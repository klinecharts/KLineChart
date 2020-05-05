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
import { calcTextWidth, getFont, getPixelRatio } from '../utils/canvas'
import { formatDate } from '../utils/format'

export default class XAxis extends Axis {
  constructor (chartData) {
    super(chartData)
    this._initMeasureCanvas()
  }

  _initMeasureCanvas () {
    const measureCanvas = document.createElement('canvas')
    this._measureCtx = measureCanvas.getContext('2d')
    const pixelRatio = getPixelRatio(this._measureCtx)
    this._measureCtx.scale(pixelRatio, pixelRatio)
  }

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
      const timezone = this._chartData.timezone()
      const tickText = this._chartData.styleOptions().xAxis.tickText
      this._measureCtx.font = getFont(tickText.size, tickText.family)
      const defaultLabelWidth = calcTextWidth(this._measureCtx, '00-00 00:00')
      const pos = parseInt(ticks[0].v, 10)
      const x = this.convertToIndex(pos)
      let tickCountDif = 1
      if (tickLength > 1) {
        const nextPos = parseInt(ticks[1].v, 10)
        const nextX = this.convertToIndex(nextPos)
        const xDif = Math.abs(nextX - x)
        if (xDif < defaultLabelWidth) {
          tickCountDif = Math.ceil(defaultLabelWidth / xDif)
        }
      }
      for (let i = 0; i < tickLength; i += tickCountDif) {
        const pos = parseInt(ticks[i].v, 10)
        const kLineData = dataList[pos]
        const timestamp = kLineData.timestamp
        let label = formatDate(timestamp, 'hh:mm', timezone)
        if (i !== 0) {
          const prePos = parseInt(ticks[i - tickCountDif].v, 10)
          const preKLineData = dataList[prePos]
          const preTimestamp = preKLineData.timestamp
          label = this._optimalTickLabel(timestamp, preTimestamp, timezone) || label
        }
        const x = this.convertToIndex(pos)
        optimalTicks.push({ v: label, x, oV: timestamp })
      }
      const optimalTickLength = optimalTicks.length
      if (optimalTickLength === 1) {
        optimalTicks[0].v = formatDate(optimalTicks[0].oV, 'YYYY-MM-DD hh:mm', timezone)
      } else {
        const firstTimestamp = optimalTicks[0].oV
        const secondTimestamp = optimalTicks[1].oV
        optimalTicks[0].v = this._optimalTickLabel(firstTimestamp, secondTimestamp, timezone) || optimalTicks[0].v
      }
    }
    return optimalTicks
  }

  _optimalTickLabel (timestamp, comparedTimestamp, timezone) {
    const year = formatDate(timestamp, 'YYYY', timezone)
    const month = formatDate(timestamp, 'YYYY-MM', timezone)
    const day = formatDate(timestamp, 'MM-DD', timezone)
    if (year !== formatDate(comparedTimestamp, 'YYYY', timezone)) {
      return year
    } else if (month !== formatDate(comparedTimestamp, 'YYYY-MM', timezone)) {
      return month
    } else if (day !== formatDate(comparedTimestamp, 'MM-DD', timezone)) {
      return day
    }
    return null
  }

  convertFromIndex (pixel) {
    let index =  Math.round(this._chartData.coordinateToFloatIndex(pixel)) - 1
    const dataList = this._chartData.dataList()
    if (index > dataList.length - 1)  {
      index = dataList.length - 1
    } else if (index < 0) {
      index = 0
    }
    return index
  }

  convertToIndex (index) {
    const dataList = this._chartData.dataList()
    const dataSize = dataList.length
    const dataSpace = this._chartData.dataSpace()
    const deltaFromRight = dataSize + this._chartData.offsetRightBarCount() - index
    return this._width - (deltaFromRight - 0.5) * dataSpace + this._chartData.barSpace() / 2
  }

  convertFromPixel (pixel) {
    let index = Math.round(this._chartData.coordinateToFloatIndex(pixel)) - 1
    const dataList = this._chartData.dataList()
    if (index > dataList.length - 1)  {
      index = dataList.length - 1
    } else if (index < 0) {
      index = 0
    }
    return dataList[index].timestamp
  }

  convertToPixel (timestamp) {
    const dataList = this._chartData.dataList()
    let index = dataList.findIndex(item => item.timestamp === timestamp)
    if (index === -1) {
      const timediff = dataList[1].timestamp - dataList[0].timestamp
      index = dataList.findIndex(item => {
        if (item.timestamp <= timestamp && item.timestamp + timediff > timestamp) {
          return true
        }
      })
    }
    const dataSize = dataList.length
    const dataSpace = this._chartData.dataSpace()
    const deltaFromRight = dataSize + this._chartData.offsetRightBarCount() - index
    return this._width - (deltaFromRight - 0.5) * dataSpace + this._chartData.barSpace() / 2
  }
}
