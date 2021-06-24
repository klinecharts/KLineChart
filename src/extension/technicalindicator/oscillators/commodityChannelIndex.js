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
 * CCI
 * CCI（N日）=（TP－MA）÷MD÷0.015
 * 其中，TP=（最高价+最低价+收盘价）÷3
 * MA=近N日TP价的累计之和÷N
 * MD=近N日TP - 当前MA绝对值的累计之和÷N
 *
 */
export default {
  name: 'CCI',
  calcParams: [20],
  plots: [
    { key: 'cci', title: 'CCI: ', type: 'line' }
  ],
  calcTechnicalIndicator: (dataList, { params }) => {
    const p = params[0] - 1
    let tpSum = 0
    const tpList = []
    return dataList.map((kLineData, i) => {
      const cci = {}
      const tp = (kLineData.high + kLineData.low + kLineData.close) / 3
      tpSum += tp
      tpList.push(tp)
      if (i >= p) {
        const maTp = tpSum / params[0]
        const sliceTpList = tpList.slice(i - p, i + 1)
        let sum = 0
        sliceTpList.forEach(tp => {
          sum += Math.abs(tp - maTp)
        })
        const md = sum / params[0]
        cci.cci = md !== 0 ? (tp - maTp) / md / 0.015 : 0
        const agoTp = (dataList[i - p].high + dataList[i - p].low + dataList[i - p].close) / 3
        tpSum -= agoTp
      }
      return cci
    })
  }
}
