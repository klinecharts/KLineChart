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
import { MTM } from '../technicalIndicatorType'

export default class Momentum extends TechnicalIndicator {
  constructor () {
    super(
      MTM, [6, 10],
      [
        { key: 'mtm', type: 'line' },
        { key: 'mtmMa', type: 'line' }
      ], 4, true
    )
  }

  /**
   * 计算mtm指标
   * 公式 MTM（N日）=C－CN
   *
   * @param dataList
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList) {
    let mtmSum = 0
    const result = []
    this._calc(dataList, i => {
      const mtm = {}
      if (i >= this.calcParams[0] - 1) {
        const close = dataList[i].close
        const agoClose = dataList[i - (this.calcParams[0] - 1)].close
        mtm.mtm = close - agoClose
        mtmSum += mtm.mtm
        if (i >= this.calcParams[0] + this.calcParams[1] - 2) {
          mtm.mtmMa = mtmSum / this.calcParams[1]
          mtmSum -= result[i - (this.calcParams[1] - 1)].mtm
        }
      }
      result.push(mtm)
    })
    return result
  }
}
