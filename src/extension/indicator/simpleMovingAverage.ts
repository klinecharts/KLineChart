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

import { type IndicatorTemplate, IndicatorSeries } from '../../component/Indicator'

interface Sma {
  sma?: number
}

/**
 * sma
 */
const simpleMovingAverage: IndicatorTemplate<Sma, number> = {
  name: 'SMA',
  shortName: 'SMA',
  series: IndicatorSeries.Price,
  calcParams: [12, 2],
  precision: 2,
  figures: [
    { key: 'sma', title: 'SMA: ', type: 'line' }
  ],
  shouldOhlc: true,
  calc: (dataList, indicator) => {
    const params = indicator.calcParams
    let closeSum = 0
    let smaValue = 0
    return dataList.map((kLineData, i) => {
      const sma: Sma = {}
      const close = kLineData.close
      closeSum += close
      if (i >= params[0] - 1) {
        if (i > params[0] - 1) {
          smaValue = (close * params[1] + smaValue * (params[0] - params[1] + 1)) / (params[0] + 1)
        } else {
          smaValue = closeSum / params[0]
        }
        sma.sma = smaValue
      }
      return sma
    })
  }
}

export default simpleMovingAverage
