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
import { MA } from '../createTechnicalIndicator'

export default class MovingAverage extends TechnicalIndicator {
  constructor () {
    super(
      MA, [5, 10, 30, 60],
      [
        { key: 'ma5', type: 'line' },
        { key: 'ma10', type: 'line' },
        { key: 'ma30', type: 'line' },
        { key: 'ma60', type: 'line' }
      ]
    )
  }

  _regeneratePlots () {
    this.plots = []
    this.calcParams.forEach(p => {
      this.plots.push({ key: `ma${p}`, type: 'line' })
    })
  }

  calcTechnicalIndicator (dataList) {
    const paramCount = this.calcParams.length
    const closeSums = []
    const result = []
    this._calc(dataList, i => {
      const ma = {}
      const close = dataList[i].close
      for (let j = 0; j < paramCount; j++) {
        closeSums[j] = (closeSums[j] || 0) + close
        const p = this.calcParams[j]
        if (i >= p - 1) {
          ma[this.plots[j].key] = closeSums[j] / p
          closeSums[j] -= dataList[i - (p - 1)].close
        }
      }
      result.push(ma)
    })
    return result
  }
}
