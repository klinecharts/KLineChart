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
import { PSY } from '../defaultTechnicalIndicatorType'

export default class PsychologicalLine extends TechnicalIndicator {
  constructor () {
    super({
      name: PSY,
      calcParams: [12, 6],
      plots: [
        { key: 'psy', type: 'line' },
        { key: 'maPsy', type: 'line' }
      ]
    })
  }

  /**
   * 计算psy
   * 公式：PSY=N日内的上涨天数/N×100%。
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList, calcParams) {
    let upCount = 0
    let psySum = 0
    const upList = []
    const result = []
    dataList.forEach((kLineData, i) => {
      const psy = {}
      const upFlag = kLineData.close - kLineData.open > 0 ? 1 : 0
      upList.push(upFlag)
      upCount += upFlag
      if (i >= calcParams[0] - 1) {
        psy.psy = upCount / calcParams[0] * 100
        psySum += psy.psy
        if (i >= calcParams[0] + calcParams[1] - 2) {
          psy.maPsy = psySum / calcParams[1]
          psySum -= result[i - (calcParams[1] - 1)].psy
        }
        upCount -= upList[i - (calcParams[0] - 1)]
      }
      result.push(psy)
    })
    return result
  }
}
