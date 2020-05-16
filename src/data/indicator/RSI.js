import TechnicalIndicator from './TechnicalIndicator'
import { RSI as name } from './createTechnicalIndicator'

export default class RSI extends TechnicalIndicator {
  constructor () {
    super(
      name, [6, 12, 24],
      [
        { key: 'rsi6', type: 'line' },
        { key: 'rsi12', type: 'line' },
        { key: 'rsi24', type: 'line' }
      ]
    )
  }

  _regeneratePlots () {
    this._plots = []
    this._calcParams.forEach(p => {
      this._plots.push({ key: `rsi${p}`, type: 'line' })
    })
  }

  calcTechnicalIndicator (dataList) {
    // N日RSI =
    // N日内收盘涨幅的平均值/(N日内收盘涨幅均值+N日内收盘跌幅均值) ×100%
    const sumCloseAs = []
    const sumCloseBs = []
    const result = []
    const paramCount = this._calcParams.length
    this._calc(dataList, (i) => {
      const rsi = {}
      if (i > 0) {
        for (let j = 0; j < paramCount; j++) {
          const tmp = dataList[i].close - dataList[i - 1].close
          if (tmp > 0) {
            sumCloseAs[j] = (sumCloseAs[j] || 0) + tmp
          } else {
            sumCloseBs[j] = (sumCloseBs[j] || 0) + Math.abs(tmp)
          }

          if (i >= this._calcParams[j]) {
            const a = sumCloseAs[j] / this._calcParams[j]
            const b = (sumCloseAs[j] + sumCloseBs[j]) / this._calcParams[j]
            rsi[this._plots[j].key] = b !== 0.0 ? a / b * 100 : 0.0

            if (tmp > 0) {
              sumCloseAs[j] -= tmp
            } else {
              sumCloseBs[j] -= Math.abs(tmp)
            }
          }
        }
      }
      result.push(rsi)
    })
    return result
  }
}
