import TechnicalIndicator from './TechnicalIndicator'
import { TRIX as name } from './createTechnicalIndicator'

export default class TRIX extends TechnicalIndicator {
  constructor () {
    super(
      name, [12, 20],
      [
        { key: 'trix', type: 'line' },
        { key: 'maTrix', type: 'line' }
      ], 4, true
    )
  }

  calcTechnicalIndicator (dataList) {
    let emaClose1
    let emaClose2
    let emaClose3
    let oldEmaClose1
    let oldEmaClose2
    let oldEmaClose3
    let trixSum = 0
    const result = []
    this._calc(dataList, (i) => {
      const trix = {}
      const close = dataList[i].close
      if (i === 0) {
        emaClose1 = close
        emaClose2 = close
        emaClose3 = close
      } else {
        emaClose1 = (2 * close + (this._calcParams[0] - 1) * oldEmaClose1) / (this._calcParams[0] + 1)
        emaClose2 = (2 * emaClose1 + (this._calcParams[0] - 1) * oldEmaClose2) / (this._calcParams[0] + 1)
        emaClose3 = (2 * emaClose2 + (this._calcParams[0] - 1) * oldEmaClose3) / (this._calcParams[0] + 1)
        trix.trix = oldEmaClose3 === 0.0 ? 0.0 : (emaClose3 - oldEmaClose3) / oldEmaClose3 * 100
        trixSum += trix.trix
        if (i >= this._calcParams[1] - 1) {
          trix.maTrix = trixSum / this._calcParams[1]
          trixSum -= trix.trix
        }
      }
      oldEmaClose1 = emaClose1
      oldEmaClose2 = emaClose2
      oldEmaClose3 = emaClose3
      result.push(trix)
    })
    return result
  }
}
