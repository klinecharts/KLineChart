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

interface Macd {
  dif?: number
  dea?: number
  macd?: number
}

/**
 * MACD：参数快线移动平均、慢线移动平均、移动平均，
 * 默认参数值12、26、9。
 * 公式：⒈首先分别计算出收盘价12日指数平滑移动平均线与26日指数平滑移动平均线，分别记为EMA(12）与EMA(26）。
 * ⒉求这两条指数平滑移动平均线的差，即：DIFF = EMA(SHORT) － EMA(LONG)。
 * ⒊再计算DIFF的M日的平均的指数平滑移动平均线，记为DEA。
 * ⒋最后用DIFF减DEA，得MACD。MACD通常绘制成围绕零轴线波动的柱形图。MACD柱状大于0涨颜色，小于0跌颜色。
 */
const movingAverageConvergenceDivergence: IndicatorTemplate<Macd> = {
  name: 'MACD',
  shortName: 'MACD',
  calcParams: [12, 26, 9],
  figures: [
    { key: 'dif', title: 'DIF: ', type: 'line' },
    { key: 'dea', title: 'DEA: ', type: 'line' },
    {
      key: 'macd',
      title: 'MACD: ',
      type: 'bar',
      baseValue: 0,
      styles: (data: IndicatorFigureStylesCallbackData<Macd>, indicator: Indicator, defaultStyles: IndicatorStyle) => {
        const { prev, current } = data
        const prevMacd = prev.indicatorData?.macd ?? Number.MIN_SAFE_INTEGER
        const currentMacd = current.indicatorData?.macd ?? Number.MIN_SAFE_INTEGER
        let color: string
        if (currentMacd > 0) {
          color = formatValue(indicator.styles, 'bars[0].upColor', (defaultStyles.bars)[0].upColor) as string
        } else if (currentMacd < 0) {
          color = formatValue(indicator.styles, 'bars[0].downColor', (defaultStyles.bars)[0].downColor) as string
        } else {
          color = formatValue(indicator.styles, 'bars[0].noChangeColor', (defaultStyles.bars)[0].noChangeColor) as string
        }
        const style = prevMacd < currentMacd ? PolygonType.Stroke : PolygonType.Fill
        return { style, color, borderColor: color }
      }
    }
  ],
  calc: (dataList: KLineData[], indicator: Indicator<Macd>) => {
    const params = indicator.calcParams as number[]
    let closeSum = 0
    let emaShort: number
    let emaLong: number
    let dif = 0
    let difSum = 0
    let dea = 0
    const maxPeriod = Math.max(params[0], params[1])
    return dataList.map((kLineData: KLineData, i: number) => {
      const macd: Macd = {}
      const close = kLineData.close
      closeSum += close
      if (i >= params[0] - 1) {
        if (i > params[0] - 1) {
          emaShort = (2 * close + (params[0] - 1) * emaShort) / (params[0] + 1)
        } else {
          emaShort = closeSum / params[0]
        }
      }
      if (i >= params[1] - 1) {
        if (i > params[1] - 1) {
          emaLong = (2 * close + (params[1] - 1) * emaLong) / (params[1] + 1)
        } else {
          emaLong = closeSum / params[1]
        }
      }
      if (i >= maxPeriod - 1) {
        dif = emaShort - emaLong
        macd.dif = dif
        difSum += dif
        if (i >= maxPeriod + params[2] - 2) {
          if (i > maxPeriod + params[2] - 2) {
            dea = (dif * 2 + dea * (params[2] - 1)) / (params[2] + 1)
          } else {
            dea = difSum / params[2]
          }
          macd.macd = (dif - dea) * 2
          macd.dea = dea
        }
      }
      return macd
    })
  }
}

export default movingAverageConvergenceDivergence
