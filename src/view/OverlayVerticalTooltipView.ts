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

import PickPartial from '../common/PickPartial'
import Point from '../common/Point'
import Coordinate from '../common/Coordinate'
import Bounding from '../common/Bounding'
import BarSpace from '../common/BarSpace'
import Precision from '../common/Precision'
import { OverlayStyle } from '../common/Styles'

import Axis from '../component/Axis'
import YAxis from '../component/YAxis'
import Overlay, { OverlayFigure } from '../component/Overlay'

import { EventOverlayInfo } from '../store/OverlayStore'

import View from './View'

export default class OverlayVerticalTooltipView<C extends Axis = YAxis> extends View<C> {
  protected drawImp (ctx: CanvasRenderingContext2D): void {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chart = pane.getChart()
    const axis = pane.getAxisComponent()
    const bounding = widget.getBounding()
    const chartStore = chart.getChartStore()
    const timeScaleStore = chartStore.getTimeScaleStore()
    const dateTimeFormat = timeScaleStore.getDateTimeFormat()
    const barSpace = timeScaleStore.getBarSpace()
    const precision = chartStore.getPrecision()
    const defaultStyles = chartStore.getStyleOptions().overlay
    const overlayStore = chartStore.getOverlayStore()
    const clickInstanceInfo = overlayStore.getClickInstanceInfo()

    const { instance: overlay } = clickInstanceInfo
    if (overlay !== null && this.getFiguresDrawFlag(clickInstanceInfo)) {
      const { points } = overlay
      const coordinates = points.map(point => {
        if (point.timestamp !== undefined) {
          point.dataIndex = timeScaleStore.timestampToDataIndex(point.timestamp)
        }
        return this.getCoordinate(point, axis)
      })
      const figures = new Array<OverlayFigure>().concat(this.getFigures(overlay, coordinates, bounding, barSpace, precision, dateTimeFormat, defaultStyles, axis))
      figures.forEach(({ type, styles, attrs }) => {
        const attrsArray = [].concat(attrs)
        attrsArray.forEach(ats => {
          const ss = { ...defaultStyles[type], ...overlay.styles?.[type], ...styles }
          this.createFigure(
            type, ats, ss
          )?.draw(ctx)
        })
      })
    }
  }

  getFiguresDrawFlag (clickInstanceInfo: EventOverlayInfo): boolean {
    return clickInstanceInfo.paneId === this.getWidget().getPane().getId()
  }

  getCoordinate (point: PickPartial<Point, 'timestamp'>, axis: Axis): Coordinate {
    return {
      x: 0,
      y: axis.convertToPixel(point.value)
    }
  }

  getFigures (
    overlay: Overlay,
    coordinates: Coordinate[],
    bounding: Bounding,
    barSpace: BarSpace,
    precision: Precision,
    dateTimeFormat: Intl.DateTimeFormat,
    defaultStyles: OverlayStyle,
    axis: Axis
  ): OverlayFigure | OverlayFigure[] {
    return overlay.createYAxisFigures({ overlay, coordinates, bounding, barSpace, precision, dateTimeFormat, defaultStyles, xAxis: null, yAxis: axis as YAxis }) ?? []
  }
}
