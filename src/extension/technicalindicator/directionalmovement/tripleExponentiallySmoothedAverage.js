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
export default {
  name: 'TRIX',
  calcParams: [12, 9],
  plots: [
    { key: 'trix', title: 'TRIX: ', type: 'line' },
    { key: 'maTrix', title: 'MATRIX: ', type: 'line' }
  ],
  calcTechnicalIndicator: (dataList, calcParams) => {
    let closeSum = 0
    let ema1
    let ema2
    let oldTr
    let ema1Sum = 0
    let ema2Sum = 0
    let trixSum = 0
    const result = []
    dataList.forEach((kLineData, i) => {
      const trix = {}
      const close = kLineData.close
      closeSum += close
      if (i >= calcParams[0] - 1) {
        if (i > calcParams[0] - 1) {
          ema1 = (2 * close + (calcParams[0] - 1) * ema1) / (calcParams[0] + 1)
        } else {
          ema1 = closeSum / calcParams[0]
        }
        ema1Sum += ema1
        if (i >= calcParams[0] * 2 - 2) {
          if (i > calcParams[0] * 2 - 2) {
            ema2 = (2 * ema1 + (calcParams[0] - 1) * ema2) / (calcParams[0] + 1)
          } else {
            ema2 = ema1Sum / calcParams[0]
          }
          ema2Sum += ema2
          if (i >= calcParams[0] * 3 - 3) {
            let tr
            let trixValue = 0
            if (i > calcParams[0] * 3 - 3) {
              tr = (2 * ema2 + (calcParams[0] - 1) * oldTr) / (calcParams[0] + 1)
              trixValue = (tr - oldTr) / oldTr * 100
            } else {
              tr = ema2Sum / calcParams[0]
            }
            oldTr = tr
            trix.trix = trixValue
            trixSum += trixValue
            if (i >= calcParams[0] * 3 + calcParams[1] - 4) {
              trix.maTrix = trixSum / calcParams[1]
              trixSum -= result[i - (calcParams[1] - 1)].trix
            }
          }
        }
      }
      result.push(trix)
    })
    return result
  }
}
