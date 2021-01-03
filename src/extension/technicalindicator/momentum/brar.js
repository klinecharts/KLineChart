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
 * BRAR
 * 默认参数是26。
 * 公式N日BR=N日内（H－CY）之和除以N日内（CY－L）之和*100，
 * 其中，H为当日最高价，L为当日最低价，CY为前一交易日的收盘价，N为设定的时间参数。
 * N日AR=(N日内（H－O）之和除以N日内（O－L）之和)*100，
 * 其中，H为当日最高价，L为当日最低价，O为当日开盘价，N为设定的时间参数
 *
 */
export default {
  name: 'BRAR',
  calcParams: [26],
  plots: [
    { key: 'br', title: 'BR', type: 'line' },
    { key: 'ar', title: 'AR', type: 'line' }
  ],
  calcTechnicalIndicator (dataList, calcParams) {
    let hcy = 0
    let cyl = 0
    let ho = 0
    let ol = 0
    return dataList.map((kLineData, i) => {
      const brar = {}
      if (i > 0) {
        const high = kLineData.high
        const low = kLineData.low
        const open = kLineData.open
        const preClose = dataList[i - 1].close
        ho += (high - open)
        ol += (open - low)
        hcy += (high - preClose)
        cyl += (preClose - low)
        if (i >= calcParams[0]) {
          if (ol !== 0) {
            brar.ar = ho / ol * 100
          } else {
            brar.ar = 0
          }
          if (cyl !== 0) {
            brar.br = hcy / cyl * 100
          } else {
            brar.br = 0
          }

          const agoHigh = dataList[i - (calcParams[0] - 1)].high
          const agoLow = dataList[i - (calcParams[0] - 1)].low
          const agoOpen = dataList[i - (calcParams[0] - 1)].open
          const agoPreClose = dataList[i - calcParams[0]].close
          hcy -= (agoHigh - agoPreClose)
          cyl -= (agoPreClose - agoLow)
          ho -= (agoHigh - agoOpen)
          ol -= (agoOpen - agoLow)
        }
      }
      return brar
    })
  }
}
