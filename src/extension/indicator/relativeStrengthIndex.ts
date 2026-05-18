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

import type { IndicatorTemplate } from '../../component/Indicator'

interface Rsi {
  rsi1?: number
  rsi2?: number
  rsi3?: number
}

/**
 * RSI
 * RSI = 100 - 100 / (1 + RMA(MAX(CHANGE(CLOSE), 0), N) / RMA(MAX(-CHANGE(CLOSE), 0), N))
 */
const relativeStrengthIndex: IndicatorTemplate<Rsi, number> = {
  name: 'RSI',
  shortName: 'RSI',
  calcParams: [6, 12, 24],
  figures: [
    { key: 'rsi1', title: 'RSI1: ', type: 'line' },
    { key: 'rsi2', title: 'RSI2: ', type: 'line' },
    { key: 'rsi3', title: 'RSI3: ', type: 'line' }
  ],
  regenerateFigures: (params) => params.map((_, index) => {
    const num = index + 1
    return { key: `rsi${num}`, title: `RSI${num}: `, type: 'line' }
  }),
  calc: (dataList, indicator) => {
    const { calcParams: params, figures } = indicator
    const gainSums: number[] = []
    const lossSums: number[] = []
    const avgGains: Array<number | undefined> = []
    const avgLosses: Array<number | undefined> = []
    return dataList.map((kLineData, i) => {
      const rsi: Record<string, number> = {}
      const change = i === 0 ? 0 : kLineData.close - dataList[i - 1].close
      const gain = Math.max(change, 0)
      const loss = Math.max(-change, 0)
      params.forEach((p, index) => {
        gainSums[index] = (gainSums[index] ?? 0) + gain
        lossSums[index] = (lossSums[index] ?? 0) + loss

        if (i < p) {
          return
        }

        if (avgGains[index] === undefined || avgLosses[index] === undefined) {
          avgGains[index] = gainSums[index] / p
          avgLosses[index] = lossSums[index] / p
        } else {
          avgGains[index] = (avgGains[index] * (p - 1) + gain) / p
          avgLosses[index] = (avgLosses[index] * (p - 1) + loss) / p
        }

        if (avgGains[index] === 0 && avgLosses[index] === 0) {
          return
        }

        if (avgLosses[index] === 0) {
          rsi[figures[index].key] = 100
        } else {
          rsi[figures[index].key] = 100 - (100 / (1 + avgGains[index] / avgLosses[index]))
        }
      })
      return rsi
    })
  }
}

export default relativeStrengthIndex
