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
import { CCI } from '../defaultTechnicalIndicatorType'

export default class CommodityChannelIndex extends TechnicalIndicator {
  constructor () {
    super({
      name: CCI,
      calcParams: [13],
      plots: [
        { key: 'cci', type: 'line' }
      ]
    })
  }

  /**
   * 计算CCI指标
   * CCI（N日）=（TP－MA）÷MD÷0.015
   * 其中，TP=（最高价+最低价+收盘价）÷3
   * MA=近N日收盘价的累计之和÷N
   * MD=近N日（MA－收盘价）的累计之和÷N
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList, calcParams) {
    const p = calcParams[0] - 1
    let closeSum = 0
    let md
    let maSubCloseSum = 0
    const maList = []
    return dataList.map((kLineData, i) => {
      const cci = {}
      const close = kLineData.close
      closeSum += close
      let ma
      if (i >= p) {
        ma = closeSum / calcParams[0]
      } else {
        ma = closeSum / (i + 1)
      }
      maList.push(ma)
      maSubCloseSum += Math.abs(ma - close)
      if (i >= p) {
        const tp = (kLineData.high + kLineData.low + close) / 3
        md = maSubCloseSum / calcParams[0]
        cci.cci = md !== 0 ? (tp - ma) / md / 0.015 : 0.0

        const agoClose = dataList[i - p].close
        closeSum -= agoClose
        const agoMa = maList[i - p]
        maSubCloseSum -= Math.abs(agoMa - agoClose)
      }
      return cci
    })
  }
}
