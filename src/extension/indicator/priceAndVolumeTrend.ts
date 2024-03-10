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
import { type IndicatorTemplate } from '../../component/Indicator'

interface Pvt {
  pvt?: number
}

/**
 * 价量趋势指标
 * 公式:
 * X = (CLOSE - REF(CLOSE, 1)) / REF(CLOSE, 1) * VOLUME
 * PVT = SUM(X)
 *
 */
const priceAndVolumeTrend: IndicatorTemplate<Pvt> = {
  name: 'PVT',
  shortName: 'PVT',
  figures: [
    { key: 'pvt', title: 'PVT: ', type: 'line' }
  ],
  calc: (dataList: KLineData[]) => {
    let sum = 0
    return dataList.map((kLineData, i) => {
      const pvt: Pvt = {}
      const close = kLineData.close
      const volume = kLineData.volume ?? 1
      const prevClose = (dataList[i - 1] ?? kLineData).close
      let x = 0
      const total = prevClose * volume
      if (total !== 0) {
        x = (close - prevClose) / total
      }
      sum += x
      pvt.pvt = sum
      return pvt
    })
  }
}

export default priceAndVolumeTrend
