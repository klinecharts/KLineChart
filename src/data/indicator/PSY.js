import TechnicalIndicator from './TechnicalIndicator'
import { PSY as name } from './createTechnicalIndicator'

export default class PSY extends TechnicalIndicator {
  constructor () {
    super(
      name, [12],
      [
        { key: 'psy', type: 'line' }
      ], 4, true
    )
  }

  calcTechnicalIndicator (dataList) {
    let upCount = 0
    const result = []
    this._calc(dataList, (i) => {
      const psy = {}
      if (i > 0) {
        const upFlag = dataList[i].close - dataList[i - 1].close > 0 ? 1 : 0
        upCount += upFlag
        if (i >= this._calcParams[0]) {
          psy.psy = upCount / this._calcParams[0] * 100
          upCount -= upFlag
        }
      }
      result.push(psy)
    })
    return result
  }
}
