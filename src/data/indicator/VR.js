import TechnicalIndicator from './TechnicalIndicator'
import { VR as name } from './createTechnicalIndicator'

export default class VR extends TechnicalIndicator {
  constructor () {
    super(
      name, [24, 30],
      [
        { key: 'vr', type: 'line' },
        { key: 'maVr', type: 'line' }
      ], 4, true
    )
  }

  calcTechnicalIndicator (dataList) {
    let uvs = 0
    let dvs = 0
    let pvs = 0
    let vrSum = 0
    const result = []
    this._calc(dataList, i => {
      const vr = {}
      const close = dataList[i].close
      const open = dataList[i].open
      const volume = dataList[i].volume
      if (close > open) {
        uvs += volume
      } else if (close < open) {
        dvs += volume
      } else {
        pvs += volume
      }
      if (i >= this._calcParams[0] - 1) {
        const halfPvs = pvs / 2
        vr.vr = (uvs + halfPvs) / (dvs + halfPvs)
        vrSum += vr.vr
        if (i >= this._calcParams[0] + this._calcParams[1] - 2) {
          vr.maVr = vrSum / this._calcParams[1]
          vrSum -= vr.vr
        }
        if (close > open) {
          uvs -= volume
        } else if (close < open) {
          dvs -= volume
        } else {
          pvs -= volume
        }
      }
      result.push(vr)
    })
    return result
  }
}
