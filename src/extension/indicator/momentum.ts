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

interface Mtm {
  mtm?: number
  maMtm?: number
}

/**
 * mtm
 * 公式 MTM（N日）=C－CN
 */
const momentum: IndicatorTemplate<Mtm> = {
  name: 'MTM',
  shortName: 'MTM',
  calcParams: [12, 6],
  figures: [
    { key: 'mtm', title: 'MTM: ', type: 'line' },
    { key: 'maMtm', title: 'MAMTM: ', type: 'line' }
  ],
  calc: (dataList: KLineData[], indicator: Indicator<Mtm>) => {
    const params = indicator.calcParams as number[]
    let mtmSum = 0
    const result: Mtm[] = []
    dataList.forEach((kLineData: KLineData, i: number) => {
      const mtm: Mtm = {}
      if (i >= params[0]) {
        const close = kLineData.close
        const agoClose = dataList[i - params[0]].close
        mtm.mtm = close - agoClose
        mtmSum += mtm.mtm
        if (i >= params[0] + params[1] - 1) {
          mtm.maMtm = mtmSum / params[1]
          mtmSum -= (result[i - (params[1] - 1)].mtm ?? 0)
        }
      }
      result.push(mtm)
    })
    return result
  }
}

export default momentum
