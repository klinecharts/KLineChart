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

import TechnicalIndicator, { TechnicalIndicatorSeries } from '../TechnicalIndicator'
import { VOL } from '../defaultTechnicalIndicatorType'

export default class Volume extends TechnicalIndicator {
  constructor () {
    super({
      name: VOL,
      series: TechnicalIndicatorSeries.VOLUME,
      shouldCheckParamCount: false,
      shouldFormatBigNumber: true,
      precision: 0,
      baseValue: 0,
      minValue: 0
    })
    this.setCalcParams([5, 10, 20])
  }

  regeneratePlots (params) {
    const plots = params.map(p => {
      return { key: `ma${p}`, type: 'line' }
    })
    plots.push({
      key: 'volume',
      type: 'bar',
      referenceValue: 0,
      color: (data, options) => {
        const kLineData = data.currentData.kLineData || {}
        if (kLineData.close > kLineData.open) {
          return options.bar.upColor
        } else if (kLineData.close < kLineData.open) {
          return options.bar.downColor
        }
        return options.bar.noChangeColor
      }
    })
    return plots
  }

  calcTechnicalIndicator (dataList, calcParams, plots) {
    const volSums = []
    const result = []
    dataList.forEach((kLineData, i) => {
      const volume = kLineData.volume || 0
      const vol = { volume }
      calcParams.forEach((param, j) => {
        volSums[j] = (volSums[j] || 0) + volume
        if (i >= param - 1) {
          vol[plots[j].key] = volSums[j] / param
          volSums[j] -= dataList[i - (param - 1)].volume
        }
      })
      result.push(vol)
    })
    return result
  }
}
