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

interface Kdj {
  k?: number
  d?: number
  j?: number
}

/**
 * KDJ
 *
 * 当日K值=2/3×前一日K值+1/3×当日RSV
 * 当日D值=2/3×前一日D值+1/3×当日K值
 * 若无前一日K 值与D值，则可分别用50来代替。
 * J值=3*当日K值-2*当日D值
 */
const stoch: IndicatorTemplate<Kdj> = {
  name: 'KDJ',
  shortName: 'KDJ',
  calcParams: [9, 3, 3],
  figures: [
    { key: 'k', title: 'K: ', type: 'line' },
    { key: 'd', title: 'D: ', type: 'line' },
    { key: 'j', title: 'J: ', type: 'line' }
  ],
  calc: (dataList: KLineData[], indicator: Indicator<Kdj>) => {
    const params = indicator.calcParams
    const result: Kdj[] = []
    dataList.forEach((kLineData: KLineData, i: number) => {
      const kdj: Kdj = {}
      const close = kLineData.close
      if (i >= params[0] - 1) {
        const lhn = getMaxMin<KLineData>(dataList.slice(i - (params[0] - 1), i + 1), 'high', 'low')
        const hn = lhn[0]
        const ln = lhn[1]
        const hnSubLn = hn - ln
        const rsv = (close - ln) / (hnSubLn === 0 ? 1 : hnSubLn) * 100
        kdj.k = ((params[1] - 1) * (result[i - 1]?.k ?? 50) + rsv) / params[1]
        kdj.d = ((params[2] - 1) * (result[i - 1]?.d ?? 50) + kdj.k) / params[2]
        kdj.j = 3.0 * kdj.k - 2.0 * kdj.d
      }
      result.push(kdj)
    })
    return result
  }
}

export default stoch
