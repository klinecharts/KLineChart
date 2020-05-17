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

import { EMA } from '../createTechnicalIndicator'

export default class ExponentialMovingAverage extends TechnicalIndicator {
  constructor () {
    super(
      EMA, [6, 12, 20],
      [
        { key: 'ema6', type: 'line' },
        { key: 'ema12', type: 'line' },
        { key: 'ema20', type: 'line' }
      ]
    )
  }

  _regeneratePlots () {
    this.plots = []
    this.calcParams.forEach(p => {
      this.plots.push({ key: `ema${p}`, type: 'line' })
    })
  }

  /**
   * 计算指数移动平均
   *
   * @param dataList
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList) {
    const paramCount = this.calcParams.length
    const oldEmas = []
    const result = []
    this._calc(dataList, i => {
      const ema = {}
      const close = dataList[i].close
      for (let j = 0; j < paramCount; j++) {
        let emaValue
        if (i === 0) {
          emaValue = close
        } else {
          emaValue = (2 * close + (this.calcParams[j] - 1) * oldEmas[j]) / (this.calcParams[j] + 1)
        }
        ema[this.plots[j].key] = emaValue
        oldEmas[j] = emaValue
      }
      result.push(ema)
    })
    return result
  }
}
