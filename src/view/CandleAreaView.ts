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

export default class CandleAreaView extends ChildrenView {
  override drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chart = pane.getChart()
    const bounding = widget.getBounding()
    const yAxis = pane.getAxisComponent()
    const candleAreaStyles = chart.getStyles().candle.area
    const lineCoordinates: Coordinate[] = []
    const areaCoordinates: Coordinate[] = []
    let minY = Number.MAX_SAFE_INTEGER
    this.eachChildren((data: VisibleData, barSpace: BarSpace, i: number) => {
      const { data: kLineData, x } = data
      const { halfGapBar } = barSpace
      const value = kLineData?.[candleAreaStyles.value]
      if (isNumber(value)) {
        const y = yAxis.convertToPixel(value)
        if (i === 0) {
          const startX = x - halfGapBar
          areaCoordinates.push({ x: startX, y: bounding.height })
          areaCoordinates.push({ x: startX, y })
          lineCoordinates.push({ x: startX, y })
        }
        lineCoordinates.push({ x, y })
        areaCoordinates.push({ x, y })
        minY = Math.min(minY, y)
      }
    })
    const areaCoordinateCount = areaCoordinates.length
    if (areaCoordinateCount > 0) {
      const lastCoordinate: Coordinate = areaCoordinates[areaCoordinateCount - 1]
      const endX = lastCoordinate.x
      lineCoordinates.push({ x: endX, y: lastCoordinate.y })
      areaCoordinates.push({ x: endX, y: lastCoordinate.y })
      areaCoordinates.push({ x: endX, y: bounding.height })
    }

    if (lineCoordinates.length > 0) {
      this.createFigure({
        name: 'line',
        attrs: { coordinates: lineCoordinates },
        styles: {
          color: candleAreaStyles.lineColor,
          size: candleAreaStyles.lineSize
        }
      }
      )?.draw(ctx)
    }

    if (areaCoordinates.length > 0) {
      // Draw real-time background
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
      this.createFigure({
        name: 'polygon',
        attrs: { coordinates: areaCoordinates },
        styles: { color }
      })?.draw(ctx)
    }
  }
}
