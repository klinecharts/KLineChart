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
import { OBV } from '../technicalIndicatorType'

export default class OnBalanceVolume extends TechnicalIndicator {
  constructor () {
    super(
      OBV, [30],
      [
        { key: 'obv', type: 'line' },
        { key: 'obvMa', type: 'line' }
      ], 4, true
    )
  }

  /**
   * 计算obv指标
   * VA = V × [（C - L）- （H - C）]/（H - C）
   *
   * @param dataList
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList) {
    let obvSum = 0
    const result = []
    this._calc(dataList, i => {
      const close = dataList[i].close
      const high = dataList[i].high
      const hc = high - close
      const va = (close - dataList[i].low - hc) / hc * dataList[i].volume
      const obv = { obv: va }
      obvSum += va
      if (i >= this.calcParams[0] - 1) {
        obv.obvMa = obvSum / this.calcParams[0]
        obvSum -= result[i - (this.calcParams[0] - 1)].obv
      }
      result.push(obv)
    })
    return result
  }
}
