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
    super(
      RSI, [6, 12, 24],
      [
        { key: 'rsi6', type: 'line' },
        { key: 'rsi12', type: 'line' },
        { key: 'rsi24', type: 'line' }
      ]
    )
  }

  _regeneratePlots () {
    this.plots = []
    this.calcParams.forEach(p => {
      this.plots.push({ key: `rsi${p}`, type: 'line' })
    })
  }

  /**
   * 计算RSI
   * N日RSI = N日内收盘涨幅的平均值/(N日内收盘涨幅均值+N日内收盘跌幅均值) ×100%
   *
   * @param dataList
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList) {
    const sumCloseAs = []
    const sumCloseBs = []
    const paramCount = this.calcParams.length
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

        if (i >= this.calcParams[j] - 1) {
          const a = sumCloseAs[j] / this.calcParams[j]
          const b = (sumCloseAs[j] + sumCloseBs[j]) / this.calcParams[j]
          rsi[this.plots[j].key] = (b === 0 ? 0 : a / b * 100)

          const agoData = dataList[i - (this.calcParams[j] - 1)]
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
