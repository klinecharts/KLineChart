/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http:*www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type KLineData from '../../common/KLineData'
import { type Indicator, type IndicatorTemplate } from '../../component/Indicator'

interface Trix {
  trix?: number
  maTrix?: number
}

/**
 * trix
 *
 * TR=收盘价的N日指数移动平均的N日指数移动平均的N日指数移动平均；
 * TRIX=(TR-昨日TR)/昨日TR*100；
 * MATRIX=TRIX的M日简单移动平均；
 * 默认参数N设为12，默认参数M设为9；
 * 默认参数12、9
 * 公式：MTR:=EMA(EMA(EMA(CLOSE,N),N),N)
 * TRIX:(MTR-REF(MTR,1))/REF(MTR,1)*100;
 * TRMA:MA(TRIX,M)
 *
 */
const tripleExponentiallySmoothedAverage: IndicatorTemplate<Trix> = {
  name: 'TRIX',
  shortName: 'TRIX',
  calcParams: [12, 9],
  figures: [
    { key: 'trix', title: 'TRIX: ', type: 'line' },
    { key: 'maTrix', title: 'MATRIX: ', type: 'line' }
  ],
  calc: (dataList: KLineData[], indicator: Indicator<Trix>) => {
    const params = indicator.calcParams as number[]
    let closeSum = 0
    let ema1: number
    let ema2: number
    let oldTr: number
    let ema1Sum = 0
    let ema2Sum = 0
    let trixSum = 0
    const result: Trix[] = []
    dataList.forEach((kLineData: KLineData, i: number) => {
      const trix: Trix = {}
      const close = kLineData.close
      closeSum += close
      if (i >= params[0] - 1) {
        if (i > params[0] - 1) {
          ema1 = (2 * close + (params[0] - 1) * ema1) / (params[0] + 1)
        } else {
          ema1 = closeSum / params[0]
        }
        ema1Sum += ema1
        if (i >= params[0] * 2 - 2) {
          if (i > params[0] * 2 - 2) {
            ema2 = (2 * ema1 + (params[0] - 1) * ema2) / (params[0] + 1)
          } else {
            ema2 = ema1Sum / params[0]
          }
          ema2Sum += ema2
          if (i >= params[0] * 3 - 3) {
            let tr: number
            let trixValue = 0
            if (i > params[0] * 3 - 3) {
              tr = (2 * ema2 + (params[0] - 1) * oldTr) / (params[0] + 1)
              trixValue = (tr - oldTr) / oldTr * 100
            } else {
              tr = ema2Sum / params[0]
            }
            oldTr = tr
            trix.trix = trixValue
            trixSum += trixValue
            if (i >= params[0] * 3 + params[1] - 4) {
              trix.maTrix = trixSum / params[1]
              trixSum -= (result[i - (params[1] - 1)].trix ?? 0)
            }
          }
        }
      }
      result.push(trix)
    })
    return result
  }
}

export default tripleExponentiallySmoothedAverage
