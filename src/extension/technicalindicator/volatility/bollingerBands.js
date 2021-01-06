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
 * 计算布林指标中的标准差
 * @param dataList
 * @param ma
 * @return {number}
 */
function getBollMd (dataList, ma) {
  const dataSize = dataList.length
  let sum = 0
  dataList.forEach(data => {
    const closeMa = data.close - ma
    sum += closeMa * closeMa
  })
  const b = sum > 0
  sum = Math.abs(sum)
  const md = Math.sqrt(sum / dataSize)
  return b ? md : -1 * md
}

/**
 * BOLL
 */
export default {
  name: 'BOLL',
  series: 'price',
  calcParams: [20],
  precision: 2,
  shouldOhlc: true,
  plots: [
    { key: 'up', title: 'UP', type: 'line' },
    { key: 'mid', title: 'MID', type: 'line' },
    { key: 'dn', title: 'DN', type: 'line' }
  ],
  calcTechnicalIndicator: (dataList, calcParams) => {
    const p = calcParams[0] - 1
    let closeSum = 0
    return dataList.map((kLineData, i) => {
      const close = kLineData.close
      const boll = {}
      closeSum += close
      if (i >= p) {
        boll.mid = closeSum / calcParams[0]
        const md = getBollMd(dataList.slice(i - p, i + 1), boll.mid)
        boll.up = boll.mid + 2 * md
        boll.dn = boll.mid - 2 * md
        closeSum -= dataList[i - p].close
      }
      return boll
    })
  }
}
