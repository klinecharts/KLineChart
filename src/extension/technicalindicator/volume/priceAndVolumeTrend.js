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
 * 价量趋势指标
 * 公式:
 * X = (CLOSE - REF(CLOSE, 1)) / REF(CLOSE, 1) * VOLUME
 * PVT = SUM(X)
 *
 */
export default {
  name: 'PVT',
  plots: [
    { key: 'pvt', title: 'PVT', type: 'line' }
  ],
  calcTechnicalIndicator: (kLineDataList) => {
    let sum = 0
    return kLineDataList.map((kLineData, i) => {
      const pvt = {}
      if (i > 0) {
        const close = kLineData.close
        const volume = kLineData.volume
        const preClose = kLineDataList[i - 1].close
        let x = 0
        if (preClose !== 0) {
          x = (close - preClose) / preClose * volume
        }
        sum += x
        pvt.pvt = sum
      }
      return pvt
    })
  }
}
