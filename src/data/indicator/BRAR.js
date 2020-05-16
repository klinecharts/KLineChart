import TechnicalIndicator from './TechnicalIndicator'
import { BRAR as name } from './createTechnicalIndicator'

export default class BRAR extends TechnicalIndicator {
  constructor () {
    super(
      name, [26],
      [
        { key: 'br', type: 'line' },
        { key: 'ar', type: 'line' }
      ],
      4, true
    )
  }

  calcTechnicalIndicator (dataList) {
    let hcy = 0
    let cyl = 0
    let ho = 0
    let ol = 0
    const result = []
    this._calc(dataList, (i) => {
      const brar = {}
      if (i > 0) {
        const high = dataList[i].high
        const low = dataList[i].low
        const open = dataList[i].open
        const preClose = dataList[i - 1].close
        ho += (high - open)
        ol += (open - low)
        hcy += (high - preClose)
        cyl += (preClose - low)
        if (i >= this._calcParams[0]) {
          if (ol !== 0) {
            brar.ar = ho / ol * 100
          } else {
            brar.ar = 0
          }
          if (cyl !== 0) {
            brar.br = hcy / cyl * 100
          } else {
            brar.br = 0
          }

          hcy -= (high - preClose)
          cyl -= (preClose - low)
          ho -= (high - open)
          ol -= (open - low)
        }
      }
      result.push(brar)
    })
    return result
  }
}
