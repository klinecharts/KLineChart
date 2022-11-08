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

import PickRequired from '../../common/PickRequired'
import KLineData from '../../common/KLineData'
import { Indicator, IndicatorCalcOptions } from '../../componentl/Indicator'

interface Obv {
  obv?: number
  maObv?: number
}

/**
 * OBV
 * OBV = REF(OBV) + sign * V
 */
const onBalanceVolume: PickRequired<Partial<Indicator<Obv>>, 'name' | 'calc'> = {
  name: 'OBV',
  shortName: 'OBV',
  calcParams: [30],
  plots: [
    { key: 'obv', title: 'OBV: ', type: 'line' },
    { key: 'maObv', title: 'MAOBV: ', type: 'line' }
  ],
  calc: (dataList: KLineData[], options: IndicatorCalcOptions<Obv>) => {
    const params = (options.calcParams ?? []) as number[]
    let obvSum = 0
    let oldObv = 0
    const result: Obv[] = []
    dataList.forEach((kLineData: KLineData, i: number) => {
      const preKLineData = dataList[i - 1] ?? kLineData
      if (kLineData.close < preKLineData.close) {
        oldObv -= (kLineData.volume ?? 0)
      } else if (kLineData.close > preKLineData.close) {
        oldObv += (kLineData.volume ?? 0)
      }
      const obv: Obv = { obv: oldObv }
      obvSum += oldObv
      if (i >= params[0] - 1) {
        obv.maObv = obvSum / params[0]
        obvSum -= (result[i - (params[0] - 1)].obv ?? 0)
      }
      result.push(obv)
    })
    return result
  }
}

export default onBalanceVolume
