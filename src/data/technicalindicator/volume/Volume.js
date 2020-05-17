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
import { VOL } from '../technicalIndicatorType'

export default class Volume extends TechnicalIndicator {
  constructor () {
    super(
      VOL, [5, 10, 20],
      [
        { key: 'ma5', type: 'line' },
        { key: 'ma10', type: 'line' },
        { key: 'ma30', type: 'line' },
        { key: 'num', type: 'bar' }
      ]
    )
  }

  _regeneratePlots () {
    this.plots = []
    this.calcParams.forEach(p => {
      this.plots.push({ key: `ma${p}`, type: 'line' })
    })
    this.plots.push({ key: 'num', type: 'bar' })
  }

  calcTechnicalIndicator (dataList) {
    const paramCount = this.calcParams.length
    const volSums = []
    this._calc(dataList, i => {
      const volume = dataList[i].volume
      const vol = { num: volume }
      for (let j = 0; j < paramCount; j++) {
        volSums[j] = (volSums[j] || 0) + volume
        const p = this.calcParams[j]
        if (i >= p - 1) {
          vol[this.plots[j].key] = volSums[j] / p
          volSums[j] -= dataList[i - (p - 1)].volume
        }
      }
      dataList[i].vol = vol
    })
  }
}
