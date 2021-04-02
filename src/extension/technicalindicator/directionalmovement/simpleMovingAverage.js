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
 * sma
 */
export default {
  name: 'SMA',
  calcParams: [12, 2],
  series: 'price',
  precision: 2,
  plots: [
    { key: 'sma', title: 'SMA: ', type: 'line' }
  ],
  shouldCheckParamCount: true,
  shouldOhlc: true,
  calcTechnicalIndicator: (kLineDataList, calcParams) => {
    let closeSum = 0
    let smaValue = 0
    return kLineDataList.map((kLineData, i) => {
      const sma = {}
      const close = kLineData.close
      closeSum += close
      if (i >= calcParams[0] - 1) {
        if (i > calcParams[0] - 1) {
          smaValue = (close * calcParams[1] + smaValue * (calcParams[0] - calcParams[1] + 1)) / (calcParams[0] + 1)
        } else {
          smaValue = closeSum / calcParams[0]
        }
        sma.sma = smaValue
      }
      return sma
    })
  }
}
