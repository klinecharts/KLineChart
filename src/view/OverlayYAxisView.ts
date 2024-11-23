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

import type Nullable from '../common/Nullable'
import type Coordinate from '../common/Coordinate'
import type Bounding from '../common/Bounding'
import type { Options } from '../Options'
import { formatPrecision } from '../common/utils/format'
import { isNumber } from '../common/utils/typeChecks'
import type Precision from '../common/Precision'

import type { Axis } from '../component/Axis'
import type { XAxis } from '../component/XAxis'
import type { YAxis } from '../component/YAxis'
import type { OverlayFigure, Overlay } from '../component/Overlay'
import type OverlayImp from '../component/Overlay'

import type { EventOverlayInfo } from '../Store'

import OverlayView from './OverlayView'

import type { Chart } from '../Chart'

export default class OverlayYAxisView<C extends Axis = YAxis> extends OverlayView<C> {
  override coordinateToPointTimestampDataIndexFlag (): boolean {
    return false
  }

  override drawDefaultFigures (
    ctx: CanvasRenderingContext2D,
    overlay: OverlayImp,
    coordinates: Coordinate[],
    bounding: Bounding,
    precision: Precision,
    options: Options,
    xAxis: Nullable<XAxis>,
    yAxis: Nullable<YAxis>,
    _hoverOverlayInfo: EventOverlayInfo,
    clickOverlayInfo: EventOverlayInfo
  ): void {
    this.drawFigures(
      ctx,
      overlay,
      this.getDefaultFigures(overlay, coordinates, bounding, precision, options, xAxis, yAxis, clickOverlayInfo),
      options.styles.overlay
    )
  }

  protected getDefaultFigures (
    overlay: Overlay,
    coordinates: Coordinate[],
    bounding: Bounding,
    precision: Precision,
    options: Options,
    _xAxis: Nullable<XAxis>,
    yAxis: Nullable<YAxis>,
    clickOverlayInfo: EventOverlayInfo
  ): OverlayFigure[] {
    const figures: OverlayFigure[] = []
    if (
      overlay.needDefaultYAxisFigure &&
      overlay.id === clickOverlayInfo.overlay?.id &&
      clickOverlayInfo.paneId === this.getWidget().getPane().getId()
    ) {
      let topY = Number.MAX_SAFE_INTEGER
      let bottomY = Number.MIN_SAFE_INTEGER
      const isFromZero = yAxis?.isFromZero() ?? false
      let textAlign: CanvasTextAlign = 'left'
      let x = 0
      if (isFromZero) {
        textAlign = 'left'
        x = 0
      } else {
        textAlign = 'right'
        x = bounding.width
      }
      const { decimalFold, thousandsSeparator } = options
      coordinates.forEach((coordinate, index) => {
        const point = overlay.points[index]
        if (isNumber(point.value)) {
          topY = Math.min(topY, coordinate.y)
          bottomY = Math.max(bottomY, coordinate.y)
          const text = decimalFold.format(thousandsSeparator.format(formatPrecision(point.value, precision.price)))
          figures.push({ type: 'text', attrs: { x, y: coordinate.y, text, align: textAlign, baseline: 'middle' }, ignoreEvent: true })
        }
      })
      if (coordinates.length > 1) {
        figures.unshift({ type: 'rect', attrs: { x: 0, y: topY, width: bounding.width, height: bottomY - topY }, ignoreEvent: true })
      }
    }
    return figures
  }

  override getFigures (
    chart: Chart,
    overlay: Overlay,
    coordinates: Coordinate[],
    bounding: Bounding,
    xAxis: Nullable<XAxis>,
    yAxis: Nullable<YAxis>
  ): OverlayFigure | OverlayFigure[] {
    return overlay.createYAxisFigures?.({ chart, overlay, coordinates, bounding, xAxis, yAxis }) ?? []
  }
}
