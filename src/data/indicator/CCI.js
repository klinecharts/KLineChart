import TechnicalIndicator from './TechnicalIndicator'
import { CCI as name } from './createTechnicalIndicator'

export default class CCI extends TechnicalIndicator {
  constructor () {
    super(
      name, [13],
      [
        { key: 'cci', type: 'line' }
      ],
      4, true
    )
  }

  calcTechnicalIndicator (dataList) {
    let closeSum = 0
    const maList = []
    let md
    let maSubCloseSum = 0
    const result = []
    this._calc(dataList, (i) => {
      const cci = {}
      const close = dataList[i].close
      closeSum += close

      const tp = (dataList[i].high + dataList[i].low + close) / 3
      if (i >= this._calcParams[0] - 1) {
        const ma = closeSum / this._calcParams[0]
        maList.push(ma)
        maSubCloseSum += (ma - close)
        md = maSubCloseSum / this._calcParams[0]
        cci.cci = md !== 0 ? (tp - ma) / md / 0.015 : 0.0

        closeSum -= close
        maSubCloseSum -= (ma - close)
      }
      result.push(cci)
    })
    return result
  }
}
