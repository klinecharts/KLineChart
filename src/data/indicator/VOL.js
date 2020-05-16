import TechnicalIndicator from './TechnicalIndicator'
import { VOL as name } from './createTechnicalIndicator'

export default class VOL extends TechnicalIndicator {
  constructor () {
    super(
      name, [5, 10, 20],
      [
        { key: 'ma5', type: 'line' },
        { key: 'ma10', type: 'line' },
        { key: 'ma30', type: 'line' },
        { key: 'num', type: 'bar' }
      ]
    )
  }

  _regeneratePlots () {
    this._plots = []
    this._calcParams.forEach(p => {
      this._plots.push({ key: `ma${p}`, type: 'line' })
    })
    this._plots.push({ key: 'num', type: 'bar' })
  }

  calcTechnicalIndicator (dataList) {
    const paramCount = this._calcParams.length
    const volSums = []
    const result = []
    this._calc(dataList, (i) => {
      const volume = dataList[i].volume
      const vol = { num: volume }
      for (let j = 0; j < paramCount; j++) {
        volSums[j] = (volSums[j] || 0) + volume
        const p = this._calcParams[j]
        if (i >= p - 1) {
          vol[this._plots[j].key] = volSums[j] / p
          volSums[j] -= volume
        }
      }
      result.push(vol)
    })
    return result
  }
}
