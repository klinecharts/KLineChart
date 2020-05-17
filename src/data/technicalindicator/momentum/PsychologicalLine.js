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
import { PSY } from '../createTechnicalIndicator'

export default class PsychologicalLine extends TechnicalIndicator {
  constructor () {
    super(
      PSY, [12, 6],
      [
        { key: 'psy', type: 'line' },
        { key: 'psyMa', type: 'line' }
      ], 4, true
    )
  }

  /**
   * 计算psy
   * 公式：PSY=N日内的上涨天数/N×100%。
   *
   * @param dataList
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList) {
    let upCount = 0
    let psySum = 0
    const upList = []
    this._calc(dataList, i => {
      const psy = {}
      const upFlag = dataList[i].close - dataList[i - 1].open > 0 ? 1 : 0
      upList.push(upFlag)
      upCount += upFlag
      if (i >= this.calcParams[0] - 1) {
        psy.psy = upCount / this.calcParams[0] * 100
        psySum += psy.psy
        if (i >= this.calcParams[0] + this.calcParams[1] - 2) {
          psy.psyMa = psySum / this.calcParams[1]
          psySum -= psy.psy
        }
        upCount -= upList[i - (this.calcParams[0] - 1)]
      }
      dataList[i].psy = psy
    })
  }
}
