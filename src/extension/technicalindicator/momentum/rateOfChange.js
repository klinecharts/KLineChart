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
 * 变动率指标
 * 公式：ROC = (CLOSE - REF(CLOSE, N)) / REF(CLOSE, N)
 */
export default {
  name: 'ROC',
  calcParams: [12, 6],
  shouldCheckParamCount: true,
  plots: [
    { key: 'roc', title: 'ROC: ', type: 'line' },
    { key: 'maRoc', title: 'MAROC: ', type: 'line' }
  ],
  calcTechnicalIndicator: (kLineDataList, calcParams) => {
    const result = []
    let rocSum = 0
    kLineDataList.forEach((kLineData, i) => {
      const roc = {}
      if (i >= calcParams[0] - 1) {
        const close = kLineData.close
        const agoClose = (kLineDataList[i - calcParams[0]] || kLineDataList[i - (calcParams[0] - 1)]).close
        if (agoClose !== 0) {
          roc.roc = (close - agoClose) / agoClose * 100
        } else {
          roc.roc = 0
        }
        rocSum += roc.roc
        if (i >= calcParams[0] - 1 + calcParams[1] - 1) {
          roc.maRoc = rocSum / calcParams[1]
          rocSum -= result[i - (calcParams[1] - 1)].roc
        }
      }
      result.push(roc)
    })
    return result
  }
}
