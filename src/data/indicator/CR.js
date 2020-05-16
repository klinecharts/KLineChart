import TechnicalIndicator from './TechnicalIndicator'
import { CR as name } from './createTechnicalIndicator'

export default class CR extends TechnicalIndicator {
  constructor () {
    super(
      name, [26, 10, 20, 40, 60],
      [
        { key: 'cr', type: 'line' },
        { key: 'ma1', type: 'line' },
        { key: 'ma2', type: 'line' },
        { key: 'ma3', type: 'line' },
        { key: 'ma4', type: 'line' }
      ]
    )
  }

  calcTechnicalIndicator (dataList) {
    const ma1ForwardPeriod = Math.ceil(this._calcParams[1] / 2.5 + 1)
    const ma2ForwardPeriod = Math.ceil(this._calcParams[2] / 2.5 + 1)
    const ma3ForwardPeriod = Math.ceil(this._calcParams[3] / 2.5 + 1)
    const ma4ForwardPeriod = Math.ceil(this._calcParams[4] / 2.5 + 1)
    let ma1Sum = 0
    const ma1List = []
    let ma2Sum = 0
    const ma2List = []
    let ma3Sum = 0
    const ma3List = []
    let ma4Sum = 0
    const ma4List = []
    let highSubPreMidSum = 0
    let preMidSubLowSum = 0
    const result = []
    this._calc(dataList, (i) => {
      const cr = {}
      if (i > 0) {
        const preData = dataList[i - 1]
        const preHigh = preData.high
        const preLow = preData.low
        const preClose = preData.close
        const preOpen = preData.open
        const preMid = (preHigh + preClose + preLow + preOpen) / 4

        const high = dataList[i].high
        const low = dataList[i].low

        const highSubPreMid = Math.max(0, high - preMid)
        highSubPreMidSum += highSubPreMid

        const preMidSubLow = Math.max(0, preMid - low)
        preMidSubLowSum += preMidSubLow

        if (i >= this._calcParams[0]) {
          if (preMidSubLow !== 0) {
            cr.cr = highSubPreMid / preMidSubLow * 100
          } else {
            cr.cr = 0
          }
          highSubPreMidSum -= highSubPreMid
          preMidSubLowSum -= preMidSubLow
          ma1Sum += cr.cr
          ma2Sum += cr.cr
          ma3Sum += cr.cr
          ma4Sum += cr.cr
          if (i >= this._calcParams[0] + this._calcParams[1] - 1) {
            ma1List.push(ma1Sum / this._calcParams[1])
            if (i >= this._calcParams[0] + this._calcParams[1] + ma1ForwardPeriod - 2) {
              cr.ma1 = ma1List[ma1List.length - ma1ForwardPeriod]
            }
            ma1Sum -= cr.cr
          }
          if (i >= this._calcParams[0] + this._calcParams[2] - 1) {
            ma2List.push(ma2Sum / this._calcParams[2])
            if (i >= this._calcParams[0] + this._calcParams[1] + ma2ForwardPeriod - 2) {
              cr.ma2 = ma2List[ma2List.length - ma2ForwardPeriod]
            }
            ma2Sum -= cr.cr
          }
          if (i >= this._calcParams[0] + this._calcParams[3] - 1) {
            ma3List.push(ma3Sum / this._calcParams[3])
            if (i >= this._calcParams[0] + this._calcParams[1] + ma3ForwardPeriod - 2) {
              cr.ma3 = ma3List[ma3List.length - ma3ForwardPeriod]
            }
            ma3Sum -= cr.cr
          }
          if (i >= this._calcParams[0] + this._calcParams[4] - 1) {
            ma4List.push(ma4Sum / this._calcParams[4])
            if (i >= this._calcParams[0] + this._calcParams[1] + ma4ForwardPeriod - 2) {
              cr.ma4 = ma4List[ma4List.length - ma4ForwardPeriod]
            }
            ma4Sum -= cr.cr
          }
        }
      }
      result.push(cr)
    })
    return result
  }
}
