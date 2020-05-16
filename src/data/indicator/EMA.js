import TechnicalIndicator from './TechnicalIndicator'

import { EMA as name } from './createTechnicalIndicator'

export default class EMA extends TechnicalIndicator {
  constructor () {
    super(
      name, [6, 12, 20],
      [
        { key: 'ema6', type: 'line' },
        { key: 'ema12', type: 'line' },
        { key: 'ema20', type: 'line' }
      ]
    )
  }

  _regeneratePlots () {
    this._plots = []
    this._calcParams.forEach(p => {
      this._plots.push({ key: `ema${p}`, type: 'line' })
    })
  }

  calcTechnicalIndicator (dataList) {
    const paramCount = this._calcParams.length
    const oldEmas = []
    const result = []
    this._calc(i => {
      const ema = {}
      const close = dataList[i].close
      for (let j = 0; j < paramCount; j++) {
        let emaValue
        if (i === 0) {
          emaValue = close
        } else {
          emaValue = (2 * close + (this._calcParams[j] - 1) * oldEmas[j]) / (this._calcParams[j] + 1)
        }
        ema[this._plots[j].key] = emaValue
        oldEmas[j] = emaValue
      }
      result.push(ema)
    })
    return result
  }
}
