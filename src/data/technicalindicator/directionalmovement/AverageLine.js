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
import { AVL } from '../defaultTechnicalIndicatorType'

export default class AverageLine extends TechnicalIndicator {
  constructor () {
    super({
      name: AVL,
      series: TechnicalIndicatorSeries.PRICE,
      precision: 2,
      plots: [
        { key: 'avl', type: 'line' }
      ]
    })
  }

  calcTechnicalIndicator (dataList, calcParams) {
    const result = []
    dataList.forEach(kLineData => {
      const avl = {}
      const turnover = kLineData.turnover || 0
      const volume = kLineData.volume || 0
      avl.avl = volume === 0 ? kLineData.close : turnover / volume
      result.push(avl)
    })
    return result
  }
}
