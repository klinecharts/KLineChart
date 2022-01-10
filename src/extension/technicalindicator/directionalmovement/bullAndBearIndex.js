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
 * 多空指标
 * 公式: BBI = (MA(CLOSE, M) + MA(CLOSE, N) + MA(CLOSE, O) + MA(CLOSE, P)) / 4
 *
 */
export default {
  name: 'BBI',
  shortName: 'BBI',
  series: 'price',
  precision: 2,
  calcParams: [3, 6, 12, 24],
  shouldCheckParamCount: true,
  shouldOhlc: true,
  plots: [
    { key: 'bbi', title: 'BBI: ', type: 'line' }
  ],
  calcTechnicalIndicator: (dataList, { params }) => {
    const maxPeriod = Math.max.apply(null, params)
    const closeSums = []
    const mas = []
    return dataList.map((kLineData, i) => {
      const bbi = {}
      const close = kLineData.close
      params.forEach((p, index) => {
        closeSums[index] = (closeSums[index] || 0) + close
        if (i >= p - 1) {
          mas[index] = closeSums[index] / p
          closeSums[index] -= dataList[i - (p - 1)].close
        }
      })
      if (i >= maxPeriod - 1) {
        let maSum = 0
        mas.forEach(ma => {
          maSum += ma
        })
        bbi.bbi = maSum / 4
      }
      return bbi
    })
  }
}
