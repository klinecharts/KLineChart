import Axis from './Axis'
import { TechnicalIndicatorType } from '../data/options/technicalIndicatorParamOptions'
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

  _compareMinMax (kLineData, technicalIndicatorType, minMaxArray) {
    const technicalIndicatorData = formatValue(kLineData, technicalIndicatorType.toLowerCase(), {})
    Object.keys(technicalIndicatorData).forEach(key => {
      const value = technicalIndicatorData[key]
      if (value || value === 0) {
        minMaxArray[0] = Math.min(minMaxArray[0], value)
        minMaxArray[1] = Math.max(minMaxArray[1], value)
      }
    })
    if (technicalIndicatorType === TechnicalIndicatorType.BOLL || technicalIndicatorType === TechnicalIndicatorType.SAR) {
      minMaxArray[0] = Math.min(minMaxArray[0], kLineData.low)
      minMaxArray[1] = Math.max(minMaxArray[1], kLineData.high)
    }
    return minMaxArray
  }

  _computeMinMaxValue () {
    let min = this._minValue
    let max = this._maxValue
    if (min === Infinity || max === -Infinity || (max === 0 && min === 0)) {
      return { min: 0, max: 0, range: 0 }
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
      const textHeight = this._chartData.styleOptions().xAxis.tick.text.fontSize
      const y = this.convertToPixel(ticks[0].v)
      let tickCountDif = 1
      if (tickLength > 1) {
        const nextY = this.convertToPixel(ticks[1].v)
        const yDif = Math.abs(nextY - y)
        if (yDif < textHeight * 2) {
          tickCountDif = Math.ceil(textHeight * 2 / yDif)
        }
      }
      for (let i = 0; i < tickLength; i += tickCountDif) {
        const v = ticks[i].v
        const y = this.convertToPixel(v)
        if (y > textHeight &&
          y < this._height - textHeight) {
          optimalTicks.push({ v, y })
        }
      }
    }
    return optimalTicks
  }

  /**
   * 计算最大最小值
   * @param technicalIndicatorType
   * @param isRealTimeChart
   */
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

    if (minMaxArray[0] !== Infinity && minMaxArray[1] !== -Infinity) {
      this._minValue = minMaxArray[0]
      this._maxValue = minMaxArray[1]
    }
  }

  convertFromPixel (pixel) {
    return (1.0 - pixel / this._height) * this._range + this._minValue
  }

  convertToPixel (value) {
    return (1.0 - (value - this._minValue) / this._range) * this._height
  }
}
