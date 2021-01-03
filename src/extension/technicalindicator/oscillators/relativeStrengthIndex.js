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
 * N日RSI = N日内收盘涨幅的平均值/(N日内收盘涨幅均值+N日内收盘跌幅均值) ×100%
 */
export default {
  name: 'RSI',
  calcParams: [6, 12, 24],
  shouldCheckParamCount: false,
  plots: [
    { key: 'rsi6', title: 'RSI6', type: 'line' },
    { key: 'rsi12', title: 'RSI12', type: 'line' },
    { key: 'rsi24', title: 'RSI24', type: 'line' }
  ],
  calcTechnicalIndicator (dataList, calcParams, plots) {
    const sumCloseAs = []
    const sumCloseBs = []
    return dataList.map((kLineData, i) => {
      const rsi = {}
      const open = kLineData.open
      calcParams.forEach((param, j) => {
        const tmp = (kLineData.close - open) / open
        sumCloseAs[j] = sumCloseAs[j] || 0
        sumCloseBs[j] = sumCloseBs[j] || 0
        if (tmp > 0) {
          sumCloseAs[j] = sumCloseAs[j] + tmp
        } else {
          sumCloseBs[j] = sumCloseBs[j] + Math.abs(tmp)
        }

        if (i >= param - 1) {
          const a = sumCloseAs[j] / param
          const b = (sumCloseAs[j] + sumCloseBs[j]) / param
          rsi[plots[j].key] = (b === 0 ? 0 : a / b * 100)

          const agoData = dataList[i - (param - 1)]
          const agoOpen = agoData.open
          const agoTmp = (agoData.close - agoOpen) / agoOpen
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
