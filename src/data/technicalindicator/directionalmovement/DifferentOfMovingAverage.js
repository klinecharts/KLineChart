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
import { DMA } from '../technicalIndicatorType'

export default class DifferentOfMovingAverage extends TechnicalIndicator {
  constructor () {
    super(
      DMA, [10, 50, 10],
      [
        { key: 'dma', type: 'line' },
        { key: 'ama', type: 'line' }
      ], 4, true
    )
  }

  /**
   * 计算DMA
   * 公式：DIF:MA(CLOSE,N1)-MA(CLOSE,N2);DIFMA:MA(DIF,M)
   *
   * @param dataList
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList) {
    const maxParam = Math.max(this.calcParams[0], this.calcParams[1])
    let closeSum1 = 0
    let closeSum2 = 0
    let dmaSum = 0
    this._calc(dataList, i => {
      const dma = {}
      const close = dataList[i].close
      closeSum1 += close
      closeSum1 += close
      let ma1
      let ma2
      if (i >= this.calcParams[0] - 1) {
        ma1 = closeSum1 / this.calcParams[0]
        closeSum1 -= dataList[this.calcParams[0] - 1].close
      }
      if (i >= this.calcParams[1] - 1) {
        ma2 = closeSum2 / this.calcParams[1]
        closeSum2 -= dataList[this.calcParams[1] - 1].close
      }

      if (i >= maxParam - 1) {
        const dif = ma1 - ma2
        dma.dma = dif
        dmaSum += dif
        if (i >= maxParam + this.calcParams[2] - 2) {
          dma.ama = dmaSum / this.calcParams[2]
          dmaSum -= dataList[i - (this.calcParams[2] - 1)].dma.dma
        }
      }
      dataList[i].dma = dma
    })
  }
}
