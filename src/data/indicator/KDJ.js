import TechnicalIndicator from './TechnicalIndicator'
import { KDJ as name } from './createTechnicalIndicator'

export default class KDJ extends TechnicalIndicator {
  constructor () {
    super(
      name, [9, 3, 3],
      [
        { key: 'k', type: 'line' },
        { key: 'd', type: 'line' },
        { key: 'j', type: 'bar' }
      ], 4, true
    )
  }

  calcTechnicalIndicator (dataList) {
    const result = []
    this._calc(dataList, (i) => {
      let kdj = {}
      const close = dataList[i].close

      if (i >= (this._calcParams[0] - 1)) {
        const lhn = this._getHighLow(dataList.slice(i - (this._calcParams[0] - 1), i + 1))
        const ln = lhn.low
        const hn = lhn.high
        const hnSubLn = hn - ln
        const rsv = (close - ln) / (hnSubLn === 0 ? 1 : hnSubLn) * 100
        // 当日K值=2/3×前一日K值+1/3×当日RSV
        // 当日D值=2/3×前一日D值+1/3×当日K值
        // 若无前一日K 值与D值，则可分别用50来代替。
        // J值=3*当日K值-2*当日D值
        const k = ((this._calcParams[1] - 1) * (result[i - 1].k || 50) + rsv) / this._calcParams[1]
        const d = ((this._calcParams[2] - 1) * (result[i - 1].d || 50) + k) / this._calcParams[2]
        const j = 3.0 * k - 2.0 * d
        kdj = { k, d, j }
      }
      result.push(kdj)
    })
    return result
  }

  /**
   * 获取数组中的最高和最低
   * @param dataList
   * @returns {{high: number, low: number}}
   * @private
   */
  _getHighLow (dataList) {
    let high = -Infinity
    let low = Infinity
    dataList.forEach(data => {
      high = Math.max(data.high, high)
      low = Math.min(data.low, low)
    })
    return { high, low }
  }
}
