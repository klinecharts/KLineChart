import TechnicalIndicator from './TechnicalIndicator'
import { BIAS as name } from './createTechnicalIndicator'

export default class BIAS extends TechnicalIndicator {
  constructor () {
    super(
      name, [6, 12, 24],
      [
        { key: 'bias6', type: 'line' },
        { key: 'bias12', type: 'line' },
        { key: 'bias24', type: 'line' }
      ]
    )
  }

  _regeneratePlots () {
    this._plots = []
    this._calcParams.forEach(p => {
      this._plots.push({ key: `bias${p}`, type: 'line' })
    })
  }

  calcTechnicalIndicator (dataList) {
    const closeSums = []
    const paramCount = this._calcParams.length
    const result = []
    this._calc(dataList, (i) => {
      const bias = {}
      const close = dataList[i].close
      for (let j = 0; j < paramCount; j++) {
        closeSums[j] = (closeSums[j] || 0) + close
        if (i >= this._calcParams[j] - 1) {
          const mean = closeSums[j] / this._calcParams[j]
          bias[this._plots[j].key] = (close - mean) / mean * 100

          closeSums[j] -= close
        }
      }
      result.push(bias)
    })
    return result
  }
}
