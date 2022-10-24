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

import YAxis from '../componentl/YAxis'

import View from './View'

import { isValid } from '../utils/typeChecks'

export default class CandleLastPriceView extends View {
  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const bounding = widget.getBounding()
    const chartStore = pane.getChart().getChartStore()
    const priceMarkStyles = chartStore.getStyleOptions().candle.priceMark
    const lastPriceMarkStyles = priceMarkStyles.last
    const lastPriceMarkLineStyles = lastPriceMarkStyles.line
    if (Boolean(priceMarkStyles.show) && Boolean(lastPriceMarkStyles.show) && Boolean(lastPriceMarkLineStyles.show)) {
      const yAxis = pane.getAxisComponent() as YAxis
      const visibleDataList = chartStore.getVisibleDataList()
      const data = visibleDataList[visibleDataList.length - 1]
      if (isValid(data)) {
        const { close, open } = data.data
        const priceY = yAxis.convertToNicePixel(close)
        let color: string
        if (close > open) {
          color = lastPriceMarkStyles.upColor
        } else if (close < open) {
          color = lastPriceMarkStyles.downColor
        } else {
          color = lastPriceMarkStyles.noChangeColor
        }
        this.createFigure('line', {
          coordinates: [
            { x: 0, y: priceY },
            { x: bounding.width, y: priceY }
          ],
          styles: {
            style: lastPriceMarkLineStyles.style,
            color,
            size: lastPriceMarkLineStyles.size,
            dashedValue: lastPriceMarkLineStyles.dashedValue
          }
        })?.draw(ctx)
      }
    }
  }
}
