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
import { BIAS } from '../technicalIndicatorType'

export default class Bias extends TechnicalIndicator {
  constructor () {
    super({
      name: BIAS,
      calcParams: [6, 12, 24],
      shouldCheckParamCount: false,
      plots: [
        { key: 'bias6', type: 'line' },
        { key: 'bias12', type: 'line' },
        { key: 'bias24', type: 'line' }
      ]
    })
  }

  regeneratePlots (params) {
    const plots = []
    params.forEach(p => {
      plots.push({ key: `bias${p}`, type: 'line' })
    })
    return plots
  }

  /**
   * 计算BIAS指标
   * 乖离率=[(当日收盘价-N日平均价)/N日平均价]*100%
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList, calcParams) {
    const closeSums = []
    const result = []
    dataList.forEach((kLineData, i) => {
      const bias = {}
      const close = kLineData.close
      calcParams.forEach((param, j) => {
        closeSums[j] = (closeSums[j] || 0) + close
        if (i >= param - 1) {
          const mean = closeSums[j] / calcParams[j]
          bias[this.plots[j].key] = (close - mean) / mean * 100

          closeSums[j] -= dataList[i - (param - 1)].close
        }
      })
      result.push(bias)
    })
    return result
  }
}
