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

import { EMV } from '../defaultTechnicalIndicatorType'

export default class EaseOfMovementValue extends TechnicalIndicator {
  constructor () {
    super({
      name: EMV,
      calcParams: [14, 9],
      plots: [
        { key: 'emv', type: 'line' },
        { key: 'maEmv', type: 'line' }
      ]
    })
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
   * @param calcParams
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList, calcParams) {
    let emSum = 0
    let emvSum = 0
    const emList = []
    const result = []
    dataList.forEach((kLineData, i) => {
      const emv = {}
      if (i > 0) {
        const high = kLineData.high
        const low = kLineData.low
        const halfHl = (high + low) / 2
        const preHalfHl = (dataList[i - 1].high + dataList[i - 1].low) / 2
        const hl = high - low
        const em = (halfHl - preHalfHl) * hl - (kLineData.turnover || 0)
        emList.push(em)
        emSum += em
        if (i >= calcParams[0]) {
          emv.emv = emSum / calcParams[0]
          emvSum += emv.emv
          if (i >= calcParams[0] + calcParams[1] - 1) {
            emv.maEmv = emvSum / calcParams[1]
            emvSum -= result[i - (calcParams[1] - 1)].emv
          }
          emSum -= emList[i - calcParams[0]]
        }
      }
      result.push(emv)
    })
    return result
  }
}
