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
import { RSI } from '../defaultTechnicalIndicatorType'

export default class RelativeStrengthIndex extends TechnicalIndicator {
  constructor () {
    super({
      name: RSI,
      shouldCheckParamCount: false
    })
    this.setCalcParams([6, 12, 24])
  }

  regeneratePlots (params) {
    return params.map(p => {
      return { key: `rsi${p}`, type: 'line' }
    })
  }

  /**
   * 计算RSI
   * N日RSI = N日内收盘涨幅的平均值/(N日内收盘涨幅均值+N日内收盘跌幅均值) ×100%
   *
   * @param dataList
   * @param calcParams
   * @param plots
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList, calcParams, plots) {
    const sumCloseAs = []
    const sumCloseBs = []
    const result = []
    dataList.forEach((kLineData, i) => {
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
      result.push(rsi)
    })
    return result
  }
}
