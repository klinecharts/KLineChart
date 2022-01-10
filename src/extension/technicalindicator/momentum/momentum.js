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
 * mtm
 * 公式 MTM（N日）=C－CN
 */
export default {
  name: 'MTM',
  shortName: 'MTM',
  calcParams: [12, 6],
  plots: [
    { key: 'mtm', title: 'MTM: ', type: 'line' },
    { key: 'maMtm', title: 'MAMTM: ', type: 'line' }
  ],
  calcTechnicalIndicator: (dataList, { params }) => {
    let mtmSum = 0
    const result = []
    dataList.forEach((kLineData, i) => {
      const mtm = {}
      if (i >= params[0]) {
        const close = kLineData.close
        const agoClose = dataList[i - params[0]].close
        mtm.mtm = close - agoClose
        mtmSum += mtm.mtm
        if (i >= params[0] + params[1] - 1) {
          mtm.maMtm = mtmSum / params[1]
          mtmSum -= result[i - (params[1] - 1)].mtm
        }
      }
      result.push(mtm)
    })
    return result
  }
}
