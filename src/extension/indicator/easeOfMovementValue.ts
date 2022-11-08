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

interface Emv {
  emv?: number
  maEmv?: number
}

/**
 *
 * EMV 简易波动指标
 * 公式：
 * A=（今日最高+今日最低）/2
 * B=（前日最高+前日最低）/2
 * C=今日最高-今日最低
 * EM=（A-B）*C/今日成交额
 * EMV=N日内EM的累和
 * MAEMV=EMV的M日的简单移动平均
 *
 */
const easeOfMovementValue: PickRequired<Partial<Indicator<Emv>>, 'name' | 'calc'> = {
  name: 'EMV',
  shortName: 'EMV',
  calcParams: [14, 9],
  plots: [
    { key: 'emv', title: 'EMV: ', type: 'line' },
    { key: 'maEmv', title: 'MAEMV: ', type: 'line' }
  ],
  calc: (dataList: KLineData[], options: IndicatorCalcOptions<Emv>) => {
    const params = (options.calcParams ?? []) as number[]
    let emSum = 0
    let emvSum = 0
    const emList: number[] = []
    const result: Emv[] = []
    dataList.forEach((kLineData: KLineData, i: number) => {
      const emv: Emv = {}
      const prevKLineData = dataList[i - 1] ?? kLineData
      const high = kLineData.high
      const low = kLineData.low
      const turnover = kLineData.turnover ?? 0
      const halfHl = (high + low) / 2
      const prevHalfHl = (prevKLineData.high + prevKLineData.low) / 2
      const hl = high - low
      let em = 0
      if (turnover !== 0) {
        em = (halfHl - prevHalfHl) * hl / turnover
      }
      emList.push(em)
      emSum += em
      if (i >= params[0] - 1) {
        emv.emv = emSum
        emSum -= emList[i - (params[0] - 1)]
        emvSum += emv.emv
        if (i >= params[0] + params[1] - 2) {
          emv.maEmv = emvSum / params[1]
          emvSum -= (result[i - (params[1] - 1)].emv ?? 0)
        }
      }
      result.push(emv)
    })
    return result
  }
}

export default easeOfMovementValue
