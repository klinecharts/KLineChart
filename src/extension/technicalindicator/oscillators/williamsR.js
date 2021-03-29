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

import calcHnLn from '../calcHnLn'

/**
 * WR
 * 公式 WR(N) = 100 * [ HIGH(N)-C ] / [ HIGH(N)-LOW(N) ]
 */
export default {
  name: 'WR',
  calcParams: [6, 10, 14],
  shouldCheckParamCount: false,
  plots: [
    { key: 'wr1', title: 'WR1: ', type: 'line' },
    { key: 'wr2', title: 'WR2: ', type: 'line' },
    { key: 'wr3', title: 'WR3: ', type: 'line' }
  ],
  regeneratePlots: (params) => {
    return params.map((_, i) => {
      return { key: `wr${i + 1}`, title: `WR${i + 1}: `, type: 'line' }
    })
  },
  calcTechnicalIndicator: (dataList, calcParams, plots) => {
    return dataList.map((kLineData, i) => {
      const wr = {}
      const close = kLineData.close
      calcParams.forEach((param, index) => {
        const p = param - 1
        if (i >= p) {
          const hln = calcHnLn(dataList.slice(i - p, i + 1))
          const hn = hln.hn
          const ln = hln.ln
          const hnSubLn = hn - ln
          wr[plots[index].key] = hnSubLn === 0 ? 0 : (hn - close) / hnSubLn * 100
        }
      })
      return wr
    })
  }
}
