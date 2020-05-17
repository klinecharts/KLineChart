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
import { TRIX } from '../technicalIndicatorType'

export default class TripleExponentiallySmoothedAverage extends TechnicalIndicator {
  constructor () {
    super(
      TRIX, [12, 20],
      [
        { key: 'trix', type: 'line' },
        { key: 'trixMa', type: 'line' }
      ], 4, true
    )
  }

  /**
   * 计算trix
   * TR=收盘价的N日指数移动平均的N日指数移动平均的N日指数移动平均；
   * TRIX=(TR-昨日TR)/昨日TR*100；
   * MATRIX=TRIX的M日简单移动平均；
   * 默认参数N设为12，默认参数M设为20；
   * 默认参数12、20
   * 公式：MTR:=EMA(EMA(EMA(CLOSE,N),N),N)
   * TRIX:(MTR-REF(MTR,1))/REF(MTR,1)*100;
   * TRMA:MA(TRIX,M)
   *
   * @param dataList
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList) {
    let emaClose1
    let emaClose2
    let emaClose3
    let oldEmaClose1
    let oldEmaClose2
    let oldEmaClose3
    let trixSum = 0
    this._calc(dataList, i => {
      const trix = {}
      const close = dataList[i].close
      if (i === 0) {
        emaClose1 = close
        emaClose2 = close
        emaClose3 = close
      } else {
        emaClose1 = (2 * close + (this.calcParams[0] - 1) * oldEmaClose1) / (this.calcParams[0] + 1)
        emaClose2 = (2 * emaClose1 + (this.calcParams[0] - 1) * oldEmaClose2) / (this.calcParams[0] + 1)
        emaClose3 = (2 * emaClose2 + (this.calcParams[0] - 1) * oldEmaClose3) / (this.calcParams[0] + 1)
        trix.trix = oldEmaClose3 === 0.0 ? 0.0 : (emaClose3 - oldEmaClose3) / oldEmaClose3 * 100
        trixSum += trix.trix
        if (i >= this.calcParams[1] - 1) {
          trix.trixMa = trixSum / this.calcParams[1]
          trixSum -= (dataList[i - (this.calcParams[1] - 1)].trix.trix || 0)
        }
      }
      oldEmaClose1 = emaClose1
      oldEmaClose2 = emaClose2
      oldEmaClose3 = emaClose3
      dataList[i].trix = trix
    })
  }
}
