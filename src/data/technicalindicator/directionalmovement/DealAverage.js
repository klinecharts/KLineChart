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
import { AVG } from '../defaultTechnicalIndicatorType'

export default class DealAverage extends TechnicalIndicator {
  constructor () {
    super({
      name: AVG,
      series: TechnicalIndicatorSeries.PRICE,
      precision: 2,
      plots: [
        { key: 'avg', type: 'line' }
      ]
    })
  }

  calcTechnicalIndicator (dataList, calcParams) {
    let turnoverSum = 0
    let volumeSum = 0
    const result = []
    dataList.forEach(kLineData => {
      const avg = {}
      const turnover = kLineData.turnover || 0
      const volume = kLineData.volume || 0
      turnoverSum += turnover
      volumeSum += volume
      if (volumeSum !== 0) {
        avg.avg = turnoverSum / volumeSum
      }
      result.push(avg)
    })
    return result
  }
}
