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
 * BIAS
 * 乖离率=[(当日收盘价-N日平均价)/N日平均价]*100%
 */
export default {
  name: 'BIAS',
  calcParams: [6, 12, 24],
  shouldCheckParamCount: false,
  plots: [
    { key: 'bias6', title: 'BIAS6: ', type: 'line' },
    { key: 'bias12', title: 'BIAS12: ', type: 'line' },
    { key: 'bias24', title: 'BIAS24: ', type: 'line' }
  ],
  regeneratePlots: (params) => {
    return params.map(p => {
      return { key: `bias${p}`, title: `BIAS${p}: `, type: 'line' }
    })
  },
  calcTechnicalIndicator: (dataList, calcParams, plots) => {
    const closeSums = []
    return dataList.map((kLineData, i) => {
      const bias = {}
      const close = kLineData.close
      calcParams.forEach((param, j) => {
        closeSums[j] = (closeSums[j] || 0) + close
        if (i >= param - 1) {
          const mean = closeSums[j] / calcParams[j]
          bias[plots[j].key] = (close - mean) / mean * 100

          closeSums[j] -= dataList[i - (param - 1)].close
        }
      })
      return bias
    })
  }
}
