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

import TechnicalIndicator, { TechnicalIndicatorSeries } from '../TechnicalIndicator'

import { EMA } from '../defaultTechnicalIndicatorType'

export default class ExponentialMovingAverage extends TechnicalIndicator {
  constructor () {
    super({
      name: EMA,
      series: TechnicalIndicatorSeries.PRICE,
      calcParams: [6, 12, 20],
      precision: 2,
      shouldCheckParamCount: false,
      shouldOhlc: true,
      plots: [
        { key: 'ema6', type: 'line' },
        { key: 'ema12', type: 'line' },
        { key: 'ema20', type: 'line' }
      ]
    })
  }

  regeneratePlots (params) {
    const plots = []
    params.forEach(p => {
      plots.push({ key: `ema${p}`, type: 'line' })
    })
    return plots
  }

  /**
   * 计算指数移动平均
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList, calcParams) {
    const oldEmas = []
    const result = []
    dataList.forEach((kLineData, i) => {
      const ema = {}
      const close = kLineData.close
      calcParams.forEach((param, j) => {
        let emaValue
        if (i === 0) {
          emaValue = close
        } else {
          emaValue = (2 * close + (param - 1) * oldEmas[j]) / (param + 1)
        }
        ema[this.plots[j].key] = emaValue
        oldEmas[j] = emaValue
      })
      result.push(ema)
    })
    return result
  }
}
