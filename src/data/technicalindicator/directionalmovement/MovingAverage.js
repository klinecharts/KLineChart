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
import { MA } from '../defaultTechnicalIndicatorType'

export default class MovingAverage extends TechnicalIndicator {
  constructor () {
    super({
      name: MA,
      series: TechnicalIndicatorSeries.PRICE,
      precision: 2,
      shouldCheckParamCount: false,
      shouldOhlc: true
    })
    this.setCalcParams([5, 10, 30, 60])
  }

  regeneratePlots (params) {
    return params.map(p => {
      return { key: `ma${p}`, type: 'line' }
    })
  }

  calcTechnicalIndicator (dataList, calcParams, plots) {
    const closeSums = []
    const result = []
    dataList.forEach((kLineData, i) => {
      const ma = {}
      const close = kLineData.close
      calcParams.forEach((param, j) => {
        closeSums[j] = (closeSums[j] || 0) + close
        if (i >= param - 1) {
          ma[plots[j].key] = closeSums[j] / param
          closeSums[j] -= dataList[i - (param - 1)].close
        }
      })
      result.push(ma)
    })
    return result
  }
}
