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

import Nullable from '../common/Nullable'
import Coordinate from '../common/Coordinate'
import Bounding from '../common/Bounding'
import BarSpace from '../common/BarSpace'
import Precision from '../common/Precision'
import { OverlayStyle } from '../common/Styles'
import { CustomApi } from '../Options'

import { formatPrecision, formatThousands } from '../common/utils/format'

import Axis from '../component/Axis'
import XAxis from '../component/XAxis'
import YAxis from '../component/YAxis'
import Overlay, { OverlayFigure } from '../component/Overlay'

import { EventOverlayInfo } from '../store/OverlayStore'

import OverlayView from './OverlayView'

export default class OverlayYAxisView<C extends Axis = YAxis> extends OverlayView<C> {
  override coordinateToPointTimestampDataIndexFlag (): boolean {
    return false
  }

  override drawDefaultFigures (
    ctx: CanvasRenderingContext2D,
    overlay: Overlay,
    coordinates: Coordinate[],
    bounding: Bounding,
    precision: Precision,
    dateTimeFormat: Intl.DateTimeFormat,
    customApi: CustomApi,
    thousandsSeparator: string,
    defaultStyles: OverlayStyle,
    xAxis: Nullable<XAxis>,
    yAxis: Nullable<YAxis>,
    _hoverInstanceInfo: EventOverlayInfo,
    clickInstanceInfo: EventOverlayInfo
  ): void {
    this.drawFigures(
      ctx,
      overlay,
      this.getDefaultFigures(overlay, coordinates, bounding, precision, dateTimeFormat, customApi, thousandsSeparator, xAxis, yAxis, clickInstanceInfo),
      defaultStyles
    )
  }

  protected getDefaultFigures (
    overlay: Overlay,
    coordinates: Coordinate[],
    bounding: Bounding,
    precision: Precision,
    _dateTimeFormat: Intl.DateTimeFormat,
    _customApi: CustomApi,
    thousandsSeparator: string,
    _xAxis: Nullable<XAxis>,
    yAxis: Nullable<YAxis>,
    clickInstanceInfo: EventOverlayInfo
  ): OverlayFigure[] {
    const figures: OverlayFigure[] = []
    if (
      overlay.needDefaultYAxisFigure &&
      overlay.id === clickInstanceInfo.instance?.id &&
      clickInstanceInfo.paneId === this.getWidget().getPane().getId()
    ) {
      let topY = Number.MAX_SAFE_INTEGER
      let bottomY = Number.MIN_SAFE_INTEGER
      const isFromZero = yAxis?.isFromZero() ?? false
      let textAlign: CanvasTextAlign
      let x: number
      if (isFromZero) {
        textAlign = 'left'
        x = 0
      } else {
        textAlign = 'right'
        x = bounding.width
      }
      coordinates.forEach((coordinate, index) => {
        const point = overlay.points[index]
        if (point.value !== undefined) {
          topY = Math.min(topY, coordinate.y)
          bottomY = Math.max(bottomY, coordinate.y)
          const text = formatThousands(formatPrecision(point.value, precision.price), thousandsSeparator)
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
    overlay: Overlay,
    coordinates: Coordinate[],
    bounding: Bounding,
    barSpace: BarSpace,
    precision: Precision,
    thousandsSeparator: string,
    dateTimeFormat: Intl.DateTimeFormat,
    defaultStyles: OverlayStyle,
    xAxis: Nullable<XAxis>,
    yAxis: Nullable<YAxis>
  ): OverlayFigure | OverlayFigure[] {
    return overlay.createYAxisFigures?.({ overlay, coordinates, bounding, barSpace, precision, thousandsSeparator, dateTimeFormat, defaultStyles, xAxis, yAxis }) ?? []
  }
}
