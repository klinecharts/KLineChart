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
import { Indicator, IndicatorSeries, IndicatorCalcOptions } from '../../componentl/Indicator'

interface Boll {
  up?: number
  mid?: number
  dn?: number
}

/**
 * 计算布林指标中的标准差
 * @param dataList
 * @param ma
 * @return {number}
 */
function getBollMd (dataList: KLineData[], ma: number): number {
  const dataSize = dataList.length
  let sum = 0
  dataList.forEach(data => {
    const closeMa = data.close - ma
    sum += closeMa * closeMa
  })
  sum = Math.abs(sum)
  return Math.sqrt(sum / dataSize)
}

/**
 * BOLL
 */
const bollingerBands: PickRequired<Partial<Indicator<Boll>>, 'name' | 'calc'> = {
  name: 'BOLL',
  shortName: 'BOLL',
  series: IndicatorSeries.PRICE,
  calcParams: [20, { value: 2, allowDecimal: true }],
  precision: 2,
  shouldOhlc: true,
  plots: [
    { key: 'up', title: 'UP: ', type: 'line' },
    { key: 'mid', title: 'MID: ', type: 'line' },
    { key: 'dn', title: 'DN: ', type: 'line' }
  ],
  calc: (dataList: KLineData[], options: IndicatorCalcOptions<Boll>) => {
    const params = options.calcParams ?? []
    const p = params[0] - 1
    let closeSum = 0
    return dataList.map((kLineData: KLineData, i: number) => {
      const close = kLineData.close
      const boll: Boll = {}
      closeSum += close
      if (i >= p) {
        boll.mid = closeSum / params[0]
        const md = getBollMd(dataList.slice(i - p, i + 1), boll.mid)
        boll.up = boll.mid + params[1] * md
        boll.dn = boll.mid - params[1] * md
        closeSum -= dataList[i - p].close
      }
      return boll
    })
  }
}

export default bollingerBands
