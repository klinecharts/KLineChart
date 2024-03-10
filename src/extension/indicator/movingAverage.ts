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
import { type Indicator, type IndicatorTemplate, IndicatorSeries } from '../../component/Indicator'

interface Ma {
  ma1?: number
  ma2?: number
  ma3?: number
  ma4?: number
}

/**
 * MA 移动平均
 */
const movingAverage: IndicatorTemplate<Ma> = {
  name: 'MA',
  shortName: 'MA',
  series: IndicatorSeries.Price,
  calcParams: [5, 10, 30, 60],
  precision: 2,
  shouldOhlc: true,
  figures: [
    { key: 'ma5', title: 'MA5: ', type: 'line' },
    { key: 'ma10', title: 'MA10: ', type: 'line' },
    { key: 'ma30', title: 'MA30: ', type: 'line' },
    { key: 'ma60', title: 'MA60: ', type: 'line' }
  ],
  regenerateFigures: (params: any[]) => {
    return params.map((p: number, i: number) => {
      return { key: `ma${i + 1}`, title: `MA${p}: `, type: 'line' }
    })
  },
  calc: (dataList: KLineData[], indicator: Indicator<Ma>) => {
    const { calcParams: params, figures } = indicator
    const closeSums: number[] = []
    return dataList.map((kLineData: KLineData, i: number) => {
      const ma = {}
      const close = kLineData.close
      params.forEach((p: number, index: number) => {
        closeSums[index] = (closeSums[index] ?? 0) + close
        if (i >= p - 1) {
          ma[figures[index].key] = closeSums[index] / p
          closeSums[index] -= dataList[i - (p - 1)].close
        }
      })
      return ma
    })
  }
}

export default movingAverage
