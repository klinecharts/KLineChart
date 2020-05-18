/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import TechnicalIndicator from '../TechnicalIndicator'

import { EMV } from '../technicalIndicatorType'

export default class EaseOfMovementValue extends TechnicalIndicator {
  constructor () {
    super(
      EMV, [14, 9],
      [
        { key: 'emv', type: 'line' },
        { key: 'emvMa', type: 'line' }
      ], 4, true
    )
  }

  /**
   * 简易波动指标
   * 公式：
   * A=（今日最高+今日最低）/2
   * B=（前日最高+前日最低）/2
   * C=今日最高-今日最低
   * EM=（A-B）*C/今日成交额
   * EMV=N日内EM的累和
   * MAEMV=EMV的M日的简单移动平均
   *
   * @param dataList
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList) {
    let emSum = 0
    let emvSum = 0
    const emList = []
    const result = []
    this._calc(dataList, i => {
      const emv = {}
      if (i > 0) {
        const high = dataList[i].high
        const low = dataList[i].low
        const halfHl = (high + low) / 2
        const preHalfHl = (dataList[i - 1].high + dataList[i - 1].low) / 2
        const hl = high - low
        const em = (halfHl - preHalfHl) * hl - dataList[i].turnover
        emList.push(em)
        emSum += em
        if (i >= this.calcParams[0]) {
          emv.emv = emSum / this.calcParams[0]
          emvSum += emv.emv
          if (i >= this.calcParams[0] + this.calcParams[1] - 1) {
            emv.emvMa = emvSum / this.calcParams[1]
            emvSum -= result[i - (this.calcParams[1] - 1)].emv
          }
          emSum -= emList[i - this.calcParams[0]]
        }
      }
      result.push(emv)
    })
    return result
  }
}
