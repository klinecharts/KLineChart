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

import { CustomApi, FormatDateType } from '../Options'

import XAxis from '../component/XAxis'
import YAxis from '../component/YAxis'
import Overlay, { OverlayFigure } from '../component/Overlay'

import OverlayStore, { EventOverlayInfo, ProgressOverlayInfo } from '../store/OverlayStore'

import OverlayYAxisView from './OverlayYAxisView'

export default class OverlayXAxisView extends OverlayYAxisView<XAxis> {
  override coordinateToPointTimestampDataIndexFlag (): boolean {
    return true
  }

  override coordinateToPointValueFlag (): boolean {
    return false
  }

  override getCompleteOverlays (overlayStore: OverlayStore): Overlay[] {
    return overlayStore.getInstances()
  }

  override getProgressOverlay (info: ProgressOverlayInfo): Overlay {
    return info.instance
  }

  override getDefaultFigures (
    overlay: Overlay,
    coordinates: Coordinate[],
    bounding: Bounding,
    _precision: Precision,
    dateTimeFormat: Intl.DateTimeFormat,
    customApi: CustomApi,
    _thousandsSeparator: string,
    _xAxis: Nullable<XAxis>,
    _yAxis: Nullable<YAxis>,
    clickInstanceInfo: EventOverlayInfo
  ): OverlayFigure[] {
    const figures: OverlayFigure[] = []
    if (overlay.needDefaultXAxisFigure && overlay.id === clickInstanceInfo.instance?.id) {
      let leftX = Number.MAX_SAFE_INTEGER
      let rightX = Number.MIN_SAFE_INTEGER
      coordinates.forEach((coordinate, index) => {
        leftX = Math.min(leftX, coordinate.x)
        rightX = Math.max(rightX, coordinate.x)
        const point = overlay.points[index]
        if (point.timestamp !== undefined) {
          const text = customApi.formatDate(dateTimeFormat, point.timestamp, 'YYYY-MM-DD HH:mm', FormatDateType.Crosshair)
          figures.push({ type: 'text', attrs: { x: coordinate.x, y: 0, text, align: 'center' }, ignoreEvent: true })
        }
      })
      if (coordinates.length > 1) {
        figures.unshift({ type: 'rect', attrs: { x: leftX, y: 0, width: rightX - leftX, height: bounding.height }, ignoreEvent: true })
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
    return overlay.createXAxisFigures?.({ overlay, coordinates, bounding, barSpace, precision, thousandsSeparator, dateTimeFormat, defaultStyles, xAxis, yAxis }) ?? []
  }
}
