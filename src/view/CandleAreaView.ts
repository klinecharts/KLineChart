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

import type Coordinate from '../common/Coordinate'
import type VisibleData from '../common/VisibleData'
import type BarSpace from '../common/BarSpace'
import { type GradientColor } from '../common/Styles'

import ChildrenView from './ChildrenView'

import { isNumber, isArray } from '../common/utils/typeChecks'

import { lineTo } from '../extension/figure/line'

export default class CandleAreaView extends ChildrenView {
  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chart = pane.getChart()
    const bounding = widget.getBounding()
    const yAxis = pane.getAxisComponent()
    const candleAreaStyles = chart.getStyles().candle.area
    const coordinates: Coordinate[] = []
    let minY = Number.MAX_SAFE_INTEGER
    let areaStartX: number = 0
    this.eachChildren((data: VisibleData, _: BarSpace, i: number) => {
      const { data: kLineData, x } = data
      // const { halfGapBar } = barSpace
      const value = kLineData?.[candleAreaStyles.value]
      if (isNumber(value)) {
        const y = yAxis.convertToPixel(value)
        if (i === 0) {
          areaStartX = x
        }
        coordinates.push({ x, y })
        minY = Math.min(minY, y)
      }
    })

    if (coordinates.length > 0) {
      this.createFigure({
        name: 'line',
        attrs: { coordinates },
        styles: {
          color: candleAreaStyles.lineColor,
          size: candleAreaStyles.lineSize,
          smooth: candleAreaStyles.smooth
        }
      }
      )?.draw(ctx)

      // render area
      const backgroundColor = candleAreaStyles.backgroundColor
      let color: string | CanvasGradient
      if (isArray<GradientColor>(backgroundColor)) {
        const gradient = ctx.createLinearGradient(0, bounding.height, 0, minY)
        try {
          backgroundColor.forEach(({ offset, color }) => {
            gradient.addColorStop(offset, color)
          })
        } catch (e) {
        }
        color = gradient
      } else {
        color = backgroundColor
      }
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(areaStartX, bounding.height)
      ctx.lineTo(coordinates[0].x, coordinates[0].y)
      lineTo(ctx, coordinates, candleAreaStyles.smooth)
      ctx.lineTo(coordinates[coordinates.length - 1].x, bounding.height)
      ctx.closePath()
      ctx.fill()
    }
  }
}
