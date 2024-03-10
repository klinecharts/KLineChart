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

interface Rsi {
  rsi1?: number
  rsi2?: number
  rsi3?: number
}

/**
 * RSI
 * RSI = SUM(MAX(CLOSE - REF(CLOSE,1),0),N) / SUM(ABS(CLOSE - REF(CLOSE,1)),N) × 100
 */
const relativeStrengthIndex: IndicatorTemplate<Rsi> = {
  name: 'RSI',
  shortName: 'RSI',
  calcParams: [6, 12, 24],
  figures: [
    { key: 'rsi1', title: 'RSI1: ', type: 'line' },
    { key: 'rsi2', title: 'RSI2: ', type: 'line' },
    { key: 'rsi3', title: 'RSI3: ', type: 'line' }
  ],
  regenerateFigures: (params: any[]) => {
    return params.map((_: any, index: number) => {
      const num = index + 1
      return { key: `rsi${num}`, title: `RSI${num}: `, type: 'line' }
    })
  },
  calc: (dataList: KLineData[], indicator: Indicator<Rsi>) => {
    const { calcParams: params, figures } = indicator
    const sumCloseAs: number[] = []
    const sumCloseBs: number[] = []
    return dataList.map((kLineData, i) => {
      const rsi = {}
      const prevClose = (dataList[i - 1] ?? kLineData).close
      const tmp = kLineData.close - prevClose
      params.forEach((p, index) => {
        if (tmp > 0) {
          sumCloseAs[index] = (sumCloseAs[index] ?? 0) + tmp
        } else {
          sumCloseBs[index] = (sumCloseBs[index] ?? 0) + Math.abs(tmp)
        }
        if (i >= p - 1) {
          if (sumCloseBs[index] !== 0) {
            rsi[figures[index].key] = 100 - (100.0 / (1 + sumCloseAs[index] / sumCloseBs[index]))
          } else {
            rsi[figures[index].key] = 0
          }
          const agoData = dataList[i - (p - 1)]
          const agoPreData = dataList[i - p] ?? agoData
          const agoTmp = agoData.close - agoPreData.close
          if (agoTmp > 0) {
            sumCloseAs[index] -= agoTmp
          } else {
            sumCloseBs[index] -= Math.abs(agoTmp)
          }
        }
      })
      return rsi
    })
  }
}

export default relativeStrengthIndex
