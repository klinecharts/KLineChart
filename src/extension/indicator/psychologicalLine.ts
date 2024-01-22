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

import type KLineData from '../../common/KLineData'
import { type Indicator, type IndicatorTemplate } from '../../component/Indicator'

interface Psy {
  psy?: number
  maPsy?: number
}

/**
 * PSY
 * 公式：PSY=N日内的上涨天数/N×100%。
 */
const psychologicalLine: IndicatorTemplate<Psy> = {
  name: 'PSY',
  shortName: 'PSY',
  calcParams: [12, 6],
  figures: [
    { key: 'psy', title: 'PSY: ', type: 'line' },
    { key: 'maPsy', title: 'MAPSY: ', type: 'line' }
  ],
  calc: (dataList: KLineData[], indicator: Indicator<Psy>) => {
    const params = indicator.calcParams as number[]
    let upCount = 0
    let psySum = 0
    const upList: number[] = []
    const result: Psy[] = []
    dataList.forEach((kLineData: KLineData, i: number) => {
      const psy: Psy = {}
      const prevClose = (dataList[i - 1] ?? kLineData).close
      const upFlag = kLineData.close - prevClose > 0 ? 1 : 0
      upList.push(upFlag)
      upCount += upFlag
      if (i >= params[0] - 1) {
        psy.psy = upCount / params[0] * 100
        psySum += psy.psy
        if (i >= params[0] + params[1] - 2) {
          psy.maPsy = psySum / params[1]
          psySum -= (result[i - (params[1] - 1)].psy ?? 0)
        }
        upCount -= upList[i - (params[0] - 1)]
      }
      result.push(psy)
    })
    return result
  }
}

export default psychologicalLine
