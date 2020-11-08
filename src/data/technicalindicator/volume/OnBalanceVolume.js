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
import { OBV } from '../defaultTechnicalIndicatorType'

export default class OnBalanceVolume extends TechnicalIndicator {
  constructor () {
    super({
      name: OBV,
      calcParams: [30],
      plots: [
        { key: 'obv', type: 'line' },
        { key: 'maObv', type: 'line' }
      ]
    })
  }

  /**
   * 计算obv指标
   * VA = V × [（C - L）- （H - C）]/（H - C）
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList, calcParams) {
    let obvSum = 0
    const result = []
    dataList.forEach((kLineData, i) => {
      const obv = {}
      const close = kLineData.close
      const high = kLineData.high
      const hc = high - close
      if (hc === 0) {
        obv.obv = 0
      } else {
        obv.obv = (close - kLineData.low - hc) / hc * kLineData.volume
      }
      obvSum += obv.obv
      if (i >= calcParams[0] - 1) {
        obv.maObv = obvSum / calcParams[0]
        obvSum -= result[i - (calcParams[0] - 1)].obv
      }
      result.push(obv)
    })
    return result
  }
}
