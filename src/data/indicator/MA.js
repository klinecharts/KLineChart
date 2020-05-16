import TechnicalIndicator from './TechnicalIndicator'
import { MA as name } from './createTechnicalIndicator'

export default class MA extends TechnicalIndicator {
  constructor () {
    super(
      name, [5, 10, 30, 60],
      [
        { key: 'ma5', type: 'line' },
        { key: 'ma10', type: 'line' },
        { key: 'ma30', type: 'line' },
        { key: 'ma60', type: 'line' }
      ]
    )
  }

  _regeneratePlots () {
    this._plots = []
    this._calcParams.forEach(p => {
      this._plots.push({ key: `ma${p}`, type: 'line' })
    })
  }

  calcTechnicalIndicator (dataList) {
    const paramCount = this._calcParams.length
    const closeSums = []
    const result = []
    this._calc(dataList, (i) => {
      const ma = {}
      const close = dataList[i].close
      for (let j = 0; j < paramCount; j++) {
        closeSums[j] = (closeSums[j] || 0) + close
        const p = this._calcParams[j]
        if (i >= p - 1) {
          ma[this._plots[j].key] = closeSums[j] / p
          closeSums[j] -= close
        }
      }
      result.push(ma)
    })
    return result
  }
}
