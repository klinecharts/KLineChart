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
import { WR } from '../technicalIndicatorType'
import calcHnLn from '../calcHnLn'

export default class WilliamsR extends TechnicalIndicator {
  constructor () {
    super(
      WR, [6, 10, 14],
      [
        { key: 'wr1', type: 'line' },
        { key: 'wr2', type: 'line' },
        { key: 'wr3', type: 'line' }
      ]
    )
  }

  _regeneratePlots () {
    this.plots = []
    this.calcParams.forEach((_, i) => {
      this.plots.push({ key: `wr${i}`, type: 'line' })
    })
  }

  /**
   * 计算wr指标
   * 公式 WR(N) = 100 * [ HIGH(N)-C ] / [ HIGH(N)-LOW(N) ]
   *
   * @param dataList
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList) {
    const result = []
    this._calc(dataList, i => {
      const wr = {}
      const close = dataList[i].close
      this.calcParams.forEach((param, index) => {
        const p = param - 1
        if (i >= p) {
          const hln = calcHnLn(dataList.slice(i - p, i + 1))
          const hn = hln.hn
          const ln = hln.ln
          const hnSubLn = hn - ln
          wr[this.plots[index].key] = hnSubLn === 0 ? 0 : (hn - close) / hnSubLn * 100
        }
      })
      result.push(wr)
    })
    return result
  }
}
