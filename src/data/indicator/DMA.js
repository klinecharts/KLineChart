import TechnicalIndicator from './TechnicalIndicator'
import { DMA as name } from './createTechnicalIndicator'

export default class DMA extends TechnicalIndicator {
  constructor () {
    super(
      name, [10, 50, 10],
      [
        { key: 'dma', type: 'line' },
        { key: 'ama', type: 'line' }
      ], 4, true
    )
  }

  calcTechnicalIndicator (dataList) {
    const minParam = Math.min(this._calcParams[0], this._calcParams[1])
    const maxParam = Math.max(this._calcParams[0], this._calcParams[1])
    let shortCloseSum = 0
    let longCloseSum = 0
    let dmaSum = 0
    const result = []
    this._calc(dataList, (i) => {
      const dma = {}
      const close = dataList[i].close
      shortCloseSum += close
      longCloseSum += close
      if (i >= minParam - 1) {
        const shortMa = shortCloseSum / minParam
        if (i >= maxParam - 1) {
          const longMa = longCloseSum / maxParam
          const dif = shortMa - longMa
          dma.dma = dif
          dmaSum += dif
          if (i > maxParam + this._calcParams[2] - 2) {
            dma.ama = dmaSum / this._calcParams[2]
            dmaSum -= dif
          }
          longCloseSum -= close
        }
        shortCloseSum -= close
      }
      result.push(dma)
    })
    return result
  }
}
