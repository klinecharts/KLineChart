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

/**
 * OBV
 * OBV = V × [(C - L) - (H - C)] /（H - L）
 */
export default {
  name: 'OBV',
  calcParams: [30],
  plots: [
    { key: 'obv', title: 'OBV: ', type: 'line' },
    { key: 'maObv', title: 'MAOBV: ', type: 'line' }
  ],
  calcTechnicalIndicator: (dataList, calcParams) => {
    let obvSum = 0
    const result = []
    dataList.forEach((kLineData, i) => {
      const obv = {}
      const close = kLineData.close
      const high = kLineData.high
      const low = kLineData.low
      const hl = high - low
      if (hl === 0) {
        obv.obv = 0
      } else {
        obv.obv = (2 * close - low - high) / hl * kLineData.volume
      }
      obvSum += obv.obv
      if (i >= calcParams[0] - 1) {
        obv.maObv = obvSum / calcParams[0]
        obvSum -= result[i - (calcParams[0] - 1)].obv
      }
      result.push(obv)
    })
    return result
  }
}
