import TechnicalIndicator from './TechnicalIndicator'
import { BOLL as name } from './createTechnicalIndicator'

export default class BOLL extends TechnicalIndicator {
  constructor () {
    super(
      name, [20],
      [
        { key: 'up', type: 'line' },
        { key: 'mid', type: 'line' },
        { key: 'dn', type: 'line' }
      ], 4, true
    )
  }

  calcTechnicalIndicator (dataList) {
    let closeSum = 0
    const result = []
    this._calc(dataList, (i) => {
      const close = dataList[i].close
      let boll = {}
      closeSum += close
      if (i >= this._calcParams[0] - 1) {
        const ma = closeSum / this._calcParams[0]
        const md = this._getBollMd(dataList.slice(i - (this._calcParams[0] - 1), i + 1), ma)
        const up = ma + 2 * md
        const dn = ma - 2 * md
        boll = { up, mid: ma, dn }
        closeSum -= close
      }
      result.push(boll)
    })
    return result
  }

  /**
   * 计算布林指标中的标准差
   * @param dataList
   * @param ma
   * @returns {number}
   * @private
   */
  _getBollMd (dataList, ma) {
    const dataSize = dataList.length
    let sum = 0
    dataList.forEach(data => {
      const closeMa = data.close - ma
      sum += closeMa * closeMa
    })
    const b = sum > 0
    sum = Math.abs(sum)
    const md = Math.sqrt(sum / dataSize)
    return b ? md : -1 * md
  }
}
