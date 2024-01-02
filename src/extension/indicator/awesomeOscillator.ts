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

import type KLineData from '../../common/KLineData'
import { type IndicatorStyle, PolygonType } from '../../common/Styles'
import { formatValue } from '../../common/utils/format'

import { type Indicator, type IndicatorTemplate, type IndicatorFigureStylesCallbackData } from '../../component/Indicator'

interface Ao {
  ao?: number
}

const awesomeOscillator: IndicatorTemplate<Ao> = {
  name: 'AO',
  shortName: 'AO',
  calcParams: [5, 34],
  figures: [{
    key: 'ao',
    title: 'AO: ',
    type: 'bar',
    baseValue: 0,
    styles: (data: IndicatorFigureStylesCallbackData<Ao>, indicator: Indicator<Ao>, defaultStyles: IndicatorStyle) => {
      const { prev, current } = data
      const prevAo = prev.indicatorData?.ao ?? Number.MIN_SAFE_INTEGER
      const currentAo = current.indicatorData?.ao ?? Number.MIN_SAFE_INTEGER
      let color: string
      if (currentAo > prevAo) {
        color = formatValue(indicator.styles, 'bars[0].upColor', (defaultStyles.bars)[0].upColor) as string
      } else {
        color = formatValue(indicator.styles, 'bars[0].downColor', (defaultStyles.bars)[0].downColor) as string
      }
      const style = currentAo > prevAo ? PolygonType.Stroke : PolygonType.Fill
      return { color, style, borderColor: color }
    }
  }],
  calc: (dataList: KLineData[], indicator: Indicator<Ao>) => {
    const params = indicator.calcParams
    const maxPeriod = Math.max(params[0] as number, params[1] as number)
    let shortSum = 0
    let longSum = 0
    let short = 0
    let long = 0
    return dataList.map((kLineData: KLineData, i: number) => {
      const ao: Ao = {}
      const middle = (kLineData.low + kLineData.high) / 2
      shortSum += middle
      longSum += middle
      if (i >= params[0] - 1) {
        short = shortSum / params[0]
        const agoKLineData = dataList[i - (params[0] - 1)]
        shortSum -= ((agoKLineData.low + agoKLineData.high) / 2)
      }
      if (i >= params[1] - 1) {
        long = longSum / params[1]
        const agoKLineData = dataList[i - (params[1] - 1)]
        longSum -= ((agoKLineData.low + agoKLineData.high) / 2)
      }
      if (i >= maxPeriod - 1) {
        ao.ao = short - long
      }
      return ao
    })
  }
}

export default awesomeOscillator
