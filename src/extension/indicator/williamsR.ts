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

import type KLineData from '../../common/KLineData'
import { type Indicator, type IndicatorTemplate } from '../../component/Indicator'

import { getMaxMin } from '../../common/utils/number'

interface Wr {
  wr1?: number
  wr2?: number
  wr3?: number
}

/**
 * WR
 * 公式 WR(N) = 100 * [ C - HIGH(N) ] / [ HIGH(N)-LOW(N) ]
 */
const williamsR: IndicatorTemplate<Wr> = {
  name: 'WR',
  shortName: 'WR',
  calcParams: [6, 10, 14],
  figures: [
    { key: 'wr1', title: 'WR1: ', type: 'line' },
    { key: 'wr2', title: 'WR2: ', type: 'line' },
    { key: 'wr3', title: 'WR3: ', type: 'line' }
  ],
  regenerateFigures: (params: any[]) => {
    return params.map((_, i: number) => {
      return { key: `wr${i + 1}`, title: `WR${i + 1}: `, type: 'line' }
    })
  },
  calc: (dataList: KLineData[], indicator: Indicator<Wr>) => {
    const { calcParams: params, figures } = indicator
    return dataList.map((kLineData, i) => {
      const wr: Wr = {}
      const close = kLineData.close
      params.forEach((param, index) => {
        const p = param - 1
        if (i >= p) {
          const hln = getMaxMin<KLineData>(dataList.slice(i - p, i + 1), 'high', 'low')
          const hn = hln[0]
          const ln = hln[1]
          const hnSubLn = hn - ln
          wr[figures[index].key] = hnSubLn === 0 ? 0 : (close - hn) / hnSubLn * 100
        }
      })
      return wr
    })
  }
}

export default williamsR
