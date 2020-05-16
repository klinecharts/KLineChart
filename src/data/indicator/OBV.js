import TechnicalIndicator from './TechnicalIndicator'
import { OBV as name } from './createTechnicalIndicator'

export default class OBV extends TechnicalIndicator {
  constructor () {
    super(
      name, [30],
      [
        { key: 'obv', type: 'line' },
        { key: 'maObv', type: 'line' }
      ], 4, true
    )
  }

  calcTechnicalIndicator (dataList) {
    let obvSum = 0
    const result = []
    this._calc(dataList, (i) => {
      const close = dataList[i].close
      const high = dataList[i].high
      const hc = high - close
      const va = (close - dataList[i].low - hc) / hc * dataList[i].volume
      const obv = { obv: va }
      obvSum += va
      if (i >= this._calcParams[0] - 1) {
        obv.maObv = obvSum / this._calcParams[0]
        obvSum -= va
      }
      result.push(obv)
    })
    return result
  }
}
