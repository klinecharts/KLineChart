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
import { KDJ } from '../technicalIndicatorType'
import calcHnLn from '../calcHnLn'

export default class StockIndicatorKDJ extends TechnicalIndicator {
  constructor () {
    super({
      name: KDJ,
      calcParams: [9, 3, 3],
      shouldCheckParamCount: true,
      plots: [
        { key: 'k', type: 'line' },
        { key: 'd', type: 'line' },
        { key: 'j', type: 'line' }
      ]
    })
  }

  /**
   * 计算KDJ
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList, calcParams) {
    const p1 = calcParams[0] - 1
    const result = []
    this._calc(dataList, i => {
      const kdj = {}
      const close = dataList[i].close

      if (i >= p1) {
        const lhn = calcHnLn(dataList.slice(i - p1, i + 1))
        const ln = lhn.ln
        const hn = lhn.hn
        const hnSubLn = hn - ln
        const rsv = (close - ln) / (hnSubLn === 0 ? 1 : hnSubLn) * 100
        // 当日K值=2/3×前一日K值+1/3×当日RSV
        // 当日D值=2/3×前一日D值+1/3×当日K值
        // 若无前一日K 值与D值，则可分别用50来代替。
        // J值=3*当日K值-2*当日D值
        kdj.k = ((calcParams[1] - 1) * (result[i - 1].k || 50) + rsv) / calcParams[1]
        kdj.d = ((calcParams[2] - 1) * (result[i - 1].d || 50) + kdj.k) / calcParams[2]
        kdj.j = 3.0 * kdj.k - 2.0 * kdj.d
      }
      result.push(kdj)
    })
    return result
  }
}
