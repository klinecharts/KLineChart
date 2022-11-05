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

import Coordinate from '../common/Coordinate'
import VisibleData from '../common/VisibleData'
import BarSpace from '../common/BarSpace'
import { GradientColor } from '../common/Styles'

import ChildrenView from './ChildrenView'

import { isNumber, isArray } from '../common/utils/typeChecks'

export default class CandleAreaView extends ChildrenView {
  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chartStore = pane.getChart().getChartStore()
    const bounding = widget.getBounding()
    const yAxis = pane.getAxisComponent()
    const barSpace = chartStore.getTimeScaleStore().getBarSpace()
    const candleAreaStyles = chartStore.getStyleOptions().candle.area
    const lineCoordinates: Coordinate[] = []
    const areaCoordinates: Coordinate[] = []
    let minY = Number.MAX_SAFE_INTEGER
    this.eachChildren((data: VisibleData, barSpace: BarSpace, i: number) => {
      const { data: kLineData, x } = data
      const { halfGapBar } = barSpace
      const value = kLineData[candleAreaStyles.value]
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
      const endX = lastCoordinate.x + barSpace.halfGapBar
      lineCoordinates.push({ x: endX, y: lastCoordinate.y })
      areaCoordinates.push({ x: endX, y: lastCoordinate.y })
      areaCoordinates.push({ x: endX, y: bounding.height })
    }

    if (lineCoordinates.length > 0) {
      this.createFigure('line', {
        coordinates: lineCoordinates,
        styles: {
          style: 'solid',
          color: candleAreaStyles.lineColor,
          size: candleAreaStyles.lineSize,
          dashedValue: []
        }
      })?.draw(ctx)
    }

    if (areaCoordinates.length > 0) {
      // 绘制分时线填充区域
      const backgroundColor = candleAreaStyles.backgroundColor
      let color: string | CanvasGradient
      if (isArray(backgroundColor)) {
        const gradient = ctx.createLinearGradient(0, bounding.height, 0, minY)
        try {
          (backgroundColor as GradientColor[]).forEach(({ offset, color }) => {
            gradient.addColorStop(offset, color)
          })
        } catch (e) {
        }
        color = gradient
      } else {
        color = backgroundColor as string
      }
      this.createFigure('polygon', {
        coordinates: areaCoordinates,
        styles: {
          style: 'fill',
          fillColor: color,
          stokeColor: '',
          strokeSize: 1
        }
      })?.draw(ctx)
    }
  }
}
