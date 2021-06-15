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
import { VR } from '../defaultTechnicalIndicatorType'

export default class VolumeRatio extends TechnicalIndicator {
  constructor () {
    super({
      name: VR,
      calcParams: [24, 30],
      plots: [
        { key: 'vr', type: 'line' },
        { key: 'maVr', type: 'line' }
      ]
    })
  }

  /**
   * 计算vr指标
   * VR=（UVS+1/2PVS）/（DVS+1/2PVS）
   * 24天以来凡是股价上涨那一天的成交量都称为AV，将24天内的AV总和相加后称为UVS
   * 24天以来凡是股价下跌那一天的成交量都称为BV，将24天内的BV总和相加后称为DVS
   * 24天以来凡是股价不涨不跌，则那一天的成交量都称为CV，将24天内的CV总和相加后称为PVS
   *
   * @param dataList
   * @param calcParams
   * @returns {[]}
   */
  calcTechnicalIndicator (dataList, calcParams) {
    let uvs = 0
    let dvs = 0
    let pvs = 0
    let vrSum = 0
    const result = []
    dataList.forEach((kLineData, i) => {
      const vr = {}
      const close = kLineData.close
      const open = kLineData.open
      const volume = kLineData.volume
      if (close > open) {
        uvs += volume
      } else if (close < open) {
        dvs += volume
      } else {
        pvs += volume
      }
      if (i >= calcParams[0] - 1) {
        const halfPvs = pvs / 2
        if (dvs + halfPvs === 0) {
          vr.vr = 0
        } else {
          vr.vr = (uvs + halfPvs) / (dvs + halfPvs)
        }
        vrSum += vr.vr
        if (i >= calcParams[0] + calcParams[1] - 2) {
          vr.maVr = vrSum / calcParams[1]
          vrSum -= result[i - (calcParams[1] - 1)].vr
        }

        const agoData = dataList[i - (calcParams[0] - 1)]
        const agoOpen = agoData.open
        const agoClose = agoData.close
        const agoVolume = agoData.volume
        if (agoClose > agoOpen) {
          uvs -= agoVolume
        } else if (agoClose < agoOpen) {
          dvs -= agoVolume
        } else {
          pvs -= agoVolume
        }
      }
      result.push(vr)
    })
    return result
  }
}
