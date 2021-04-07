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

/**
 * RSI
 * RSI = SUM(MAX(CLOSE - REF(CLOSE,1),0),N) / SUM(ABS(CLOSE - REF(CLOSE,1)),N) × 100
 */
export default {
  name: 'RSI',
  calcParams: [6, 12, 24],
  shouldCheckParamCount: false,
  plots: [
    { key: 'rsi1', title: 'RSI1: ', type: 'line' },
    { key: 'rsi2', title: 'RSI2: ', type: 'line' },
    { key: 'rsi3', title: 'RSI3: ', type: 'line' }
  ],
  regeneratePlots: (params) => {
    return params.map((_, index) => {
      const num = index + 1
      return { key: `rsi${num}`, title: `RSI${num}: `, type: 'line' }
    })
  },
  calcTechnicalIndicator: (dataList, calcParams, plots) => {
    const sumCloseAs = []
    const sumCloseBs = []
    return dataList.map((kLineData, i) => {
      const rsi = {}
      const preClose = (dataList[i - 1] || kLineData).close
      const tmp = kLineData.close - preClose
      calcParams.forEach((param, j) => {
        if (tmp > 0) {
          sumCloseAs[j] = (sumCloseAs[j] || 0) + tmp
        } else {
          sumCloseBs[j] = (sumCloseBs[j] || 0) + Math.abs(tmp)
        }
        if (i >= param - 1) {
          if (sumCloseBs[j] !== 0) {
            rsi[plots[j].key] = 100 - (100.0 / (1 + sumCloseAs[j] / sumCloseBs[j]))
          } else {
            rsi[plots[j].key] = 0
          }
          const agoData = dataList[i - (param - 1)]
          const agoPreData = dataList[i - param] || agoData
          const agoTmp = agoData.close - agoPreData.close
          if (agoTmp > 0) {
            sumCloseAs[j] -= agoTmp
          } else {
            sumCloseBs[j] -= Math.abs(agoTmp)
          }
        }
      })
      return rsi
    })
  }
}
