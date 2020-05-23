/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http:*www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import TechnicalIndicator from '../TechnicalIndicator'
import { CR } from '../technicalIndicatorType'

export default class CurrentRatio extends TechnicalIndicator {
  constructor () {
    super({
      name: CR,
      calcParams: [26, 10, 20, 40, 60],
      plots: [
        { key: 'cr', type: 'line' },
        { key: 'ma1', type: 'line' },
        { key: 'ma2', type: 'line' },
        { key: 'ma3', type: 'line' },
        { key: 'ma4', type: 'line' }
      ]
    })
  }

  /**
   * MID:=REF(HIGH+LOW,1)/2;
   * CR:SUM(MAX(0,HIGH-MID),N)/SUM(MAX(0,MID-LOW),N)*100;
   * MA1:REF(MA(CR,M1),M1/2.5+1);
   * MA2:REF(MA(CR,M2),M2/2.5+1);
   * MA3:REF(MA(CR,M3),M3/2.5+1);
   * MA4:REF(MA(CR,M4),M4/2.5+1);
   * MID赋值:(昨日最高价+昨日最低价)/2
   * 输出带状能量线:0和最高价-MID的较大值的N日累和/0和MID-最低价的较大值的N日累和*100
   * 输出MA1:M1(5)/2.5+1日前的CR的M1(5)日简单移动平均
   * 输出MA2:M2(10)/2.5+1日前的CR的M2(10)日简单移动平均
   * 输出MA3:M3(20)/2.5+1日前的CR的M3(20)日简单移动平均
   * 输出MA4:M4/2.5+1日前的CR的M4日简单移动平均
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList, calcParams) {
    const ma1ForwardPeriod = Math.ceil(calcParams[1] / 2.5 + 1)
    const ma2ForwardPeriod = Math.ceil(calcParams[2] / 2.5 + 1)
    const ma3ForwardPeriod = Math.ceil(calcParams[3] / 2.5 + 1)
    const ma4ForwardPeriod = Math.ceil(calcParams[4] / 2.5 + 1)
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
    this._calc(dataList, i => {
      const cr = {}
      if (i > 0) {
        const preData = dataList[i - 1]
        const preMid = (preData.high + preData.close + preData.low + preData.open) / 4

        const highSubPreMid = Math.max(0, dataList[i].high - preMid)
        highSubPreMidSum += highSubPreMid

        const preMidSubLow = Math.max(0, preMid - dataList[i].low)
        preMidSubLowSum += preMidSubLow

        if (i >= calcParams[0]) {
          if (preMidSubLow !== 0) {
            cr.cr = highSubPreMid / preMidSubLow * 100
          } else {
            cr.cr = 0
          }
          const agoPreData = dataList[i - calcParams[0]]
          const agoPreMid = (agoPreData.high + agoPreData.close + agoPreData.low + agoPreData.open) / 4
          const agoData = dataList[i - (calcParams[0] - 1)]
          const agoHighSubPreMid = Math.max(0, agoData.high - agoPreMid)
          highSubPreMidSum -= agoHighSubPreMid
          const agoPreMidSubLow = Math.max(0, agoPreMid - agoData.low)
          preMidSubLowSum -= agoPreMidSubLow
          ma1Sum += cr.cr
          ma2Sum += cr.cr
          ma3Sum += cr.cr
          ma4Sum += cr.cr
          if (i >= calcParams[0] + calcParams[1] - 1) {
            ma1List.push(ma1Sum / calcParams[1])
            if (i >= calcParams[0] + calcParams[1] + ma1ForwardPeriod - 2) {
              cr.ma1 = ma1List[ma1List.length - 1 - ma1ForwardPeriod]
            }
            ma1Sum -= result[i - (calcParams[1] - 1)].cr
          }
          if (i >= calcParams[0] + calcParams[2] - 1) {
            ma2List.push(ma2Sum / calcParams[2])
            if (i >= calcParams[0] + calcParams[2] + ma2ForwardPeriod - 2) {
              cr.ma2 = ma2List[ma2List.length - 1 - ma2ForwardPeriod]
            }
            ma2Sum -= result[i - (calcParams[2] - 1)].cr
          }
          if (i >= calcParams[0] + calcParams[3] - 1) {
            ma3List.push(ma3Sum / calcParams[3])
            if (i >= calcParams[0] + calcParams[3] + ma3ForwardPeriod - 2) {
              cr.ma3 = ma3List[ma3List.length - 1 - ma3ForwardPeriod]
            }
            ma3Sum -= result[i - (calcParams[3] - 1)].cr
          }
          if (i >= calcParams[0] + calcParams[4] - 1) {
            ma4List.push(ma4Sum / calcParams[4])
            if (i >= calcParams[0] + calcParams[4] + ma4ForwardPeriod - 2) {
              cr.ma4 = ma4List[ma4List.length - 1 - ma4ForwardPeriod]
            }
            ma4Sum -= result[i - (calcParams[4] - 1)].cr
          }
        }
      }
      result.push(cr)
    })
    return result
  }
}
