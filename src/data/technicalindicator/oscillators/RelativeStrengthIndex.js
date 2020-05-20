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

import TechnicalIndicator from '../TechnicalIndicator'
import { RSI } from '../technicalIndicatorType'

export default class RelativeStrengthIndex extends TechnicalIndicator {
  constructor () {
    super({
      name: RSI,
      calcParams: [6, 12, 24],
      plots: [
        { key: 'rsi6', type: 'line' },
        { key: 'rsi12', type: 'line' },
        { key: 'rsi24', type: 'line' }
      ]
    })
  }

  regeneratePlots (params) {
    const plots = []
    params.forEach(p => {
      plots.push({ key: `rsi${p}`, type: 'line' })
    })
    return plots
  }

  /**
   * 计算RSI
   * N日RSI = N日内收盘涨幅的平均值/(N日内收盘涨幅均值+N日内收盘跌幅均值) ×100%
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList, calcParams) {
    const sumCloseAs = []
    const sumCloseBs = []
    const paramCount = calcParams.length
    const result = []
    this._calc(dataList, i => {
      const rsi = {}
      const open = dataList[i].open
      for (let j = 0; j < paramCount; j++) {
        const tmp = (dataList[i].close - open) / open
        sumCloseAs[j] = sumCloseAs[j] || 0
        sumCloseBs[j] = sumCloseBs[j] || 0
        if (tmp > 0) {
          sumCloseAs[j] = sumCloseAs[j] + tmp
        } else {
          sumCloseBs[j] = sumCloseBs[j] + Math.abs(tmp)
        }

        if (i >= calcParams[j] - 1) {
          const a = sumCloseAs[j] / calcParams[j]
          const b = (sumCloseAs[j] + sumCloseBs[j]) / calcParams[j]
          rsi[this.plots[j].key] = (b === 0 ? 0 : a / b * 100)

          const agoData = dataList[i - (calcParams[j] - 1)]
          const agoOpen = agoData.open
          const agoTmp = (agoData.close - agoOpen) / agoOpen
          if (agoTmp > 0) {
            sumCloseAs[j] -= agoTmp
          } else {
            sumCloseBs[j] -= Math.abs(agoTmp)
          }
        }
      }
      result.push(rsi)
    })
    return result
  }
}
