import Axis from './Axis'
import { TechnicalIndicatorType } from '../data/constants/technicalIndicatorTypeConstants'
import { formatValue } from '../utils/format'

export const YAxisType = {
  CANDLE_STICK: 'candle_stick',
  TECHNICAL_INDICATOR: 'technical_indicator'
}

export default class YAxis extends Axis {
  constructor (chartData, yAxisType) {
    super(chartData)
    this._yAxisType = yAxisType
  }

  calcMinMaxValue (technicalIndicatorType, isRealTimeChart) {
    const dataList = this._chartData.dataList()
    const from = this._chartData.from()
    const to = this._chartData.to()
    const isShowAverageLine = this._chartData.styleOptions().candle.averageLine.display
    const minMaxArray = [Infinity, -Infinity]
    if (isRealTimeChart) {
      for (let i = from; i < to; i++) {
        const kLineData = dataList[i]
        const minCompareArray = [kLineData.close, minMaxArray[0]]
        const maxCompareArray = [kLineData.close, minMaxArray[1]]
        if (isShowAverageLine) {
          minCompareArray.push(kLineData.average)
          maxCompareArray.push(kLineData.average)
        }
        minMaxArray[0] = Math.min.apply(null, minCompareArray)
        minMaxArray[1] = Math.max.apply(null, maxCompareArray)
      }
    } else {
      for (let i = from; i < to; i++) {
        const kLineData = dataList[i]
        this._compareMinMax(kLineData, technicalIndicatorType, minMaxArray)
        if (this._yAxisType === YAxisType.CANDLE_STICK) {
          minMaxArray[0] = Math.min(kLineData.low, minMaxArray[0])
          minMaxArray[1] = Math.max(kLineData.high, minMaxArray[1])
        }
      }
      if (technicalIndicatorType === TechnicalIndicatorType.VOL) {
        minMaxArray[0] = 0
      }
    }

    if (minMaxArray[0] !== Number.MAX_SAFE_INTEGER && minMaxArray[1] !== Number.MIN_SAFE_INTEGER) {
      this._minValue = minMaxArray[0]
      this._maxValue = minMaxArray[1]
    }
  }

  _compareMinMax (kLineData, indicatorType, minMaxArray) {
    const indicatorData = formatValue(kLineData, indicatorType.toLowerCase(), {})
    Object.keys(indicatorData).forEach(key => {
      const value = indicatorData[key]
      if (value || value === 0) {
        minMaxArray[0] = Math.min(minMaxArray[0], value)
        minMaxArray[1] = Math.max(minMaxArray[1], value)
      }
    })
    if (indicatorType === TechnicalIndicatorType.BOLL || indicatorType === TechnicalIndicatorType.SAR) {
      minMaxArray[0] = Math.min(minMaxArray[0], kLineData.low)
      minMaxArray[1] = Math.max(minMaxArray[1], kLineData.high)
    }
    return minMaxArray
  }

  _computeMinMaxValue () {
    let min = this._minValue
    let max = this._maxValue
    if (min === Number.MAX_SAFE_INTEGER || max === Number.MIN_SAFE_INTEGER || (max === 0 && min === 0)) {
      return
    }

    let range = Math.abs(max - min)
    if (range === 0) {
      max += 1
      min -= 1
      range = Math.abs(max - min)
    }
    // 保证每次图形绘制上下都留间隙
    min = min - (range / 100.0) * 10.0
    max = max + (range / 100.0) * 20.0
    range = Math.abs(max - min)
    return { min, max, range }
  }

  _computeOptimalTicks (ticks) {
    const optimalTicks = []
    const tickLength = ticks.length
    if (tickLength > 0) {
      const textHeight = this._view.styleOptions().xAxis.tick.text.fontSize
      const y = this.getY(ticks[0].v)
      let tickCountDif = 1
      if (tickLength > 1) {
        const nextY = this.getY(ticks[1].v)
        const yDif = Math.abs(nextY - y)
        if (yDif < textHeight * 2) {
          tickCountDif = Math.ceil(textHeight * 2 / yDif)
        }
      }
      for (let i = 0; i < tickLength; i += tickCountDif) {
        const v = ticks[i].v
        const y = this.getY(v)
        if (y > this.handler.contentTop() + textHeight &&
          y < this.handler.contentBottom() - textHeight) {
          optimalTicks.push({ v, y })
        }
      }
    }
    return optimalTicks
  }

  convertFromPixel (pixel) {

  }

  convertToPixel (value) {

  }
}
