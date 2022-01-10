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
 * PSY
 * 公式：PSY=N日内的上涨天数/N×100%。
 */
export default {
  name: 'PSY',
  shortName: 'PSY',
  calcParams: [12, 6],
  plots: [
    { key: 'psy', title: 'PSY: ', type: 'line' },
    { key: 'maPsy', title: 'MAPSY: ', type: 'line' }
  ],
  calcTechnicalIndicator: (dataList, { params }) => {
    let upCount = 0
    let psySum = 0
    const upList = []
    const result = []
    dataList.forEach((kLineData, i) => {
      const psy = {}
      const preClose = (dataList[i - 1] || kLineData).close
      const upFlag = kLineData.close - preClose > 0 ? 1 : 0
      upList.push(upFlag)
      upCount += upFlag
      if (i >= params[0] - 1) {
        psy.psy = upCount / params[0] * 100
        psySum += psy.psy
        if (i >= params[0] + params[1] - 2) {
          psy.maPsy = psySum / params[1]
          psySum -= result[i - (params[1] - 1)].psy
        }
        upCount -= upList[i - (params[0] - 1)]
      }
      result.push(psy)
    })
    return result
  }
}
