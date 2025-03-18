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

import { isNumber } from '../common/utils/typeChecks'

import type { XAxis } from '../component/XAxis'
import type { YAxis } from '../component/YAxis'
import type { OverlayFigure, Overlay } from '../component/Overlay'
import type OverlayImp from '../component/Overlay'

import OverlayYAxisView from './OverlayYAxisView'

export default class OverlayXAxisView extends OverlayYAxisView<XAxis> {
  override coordinateToPointTimestampDataIndexFlag (): boolean {
    return true
  }

  override coordinateToPointValueFlag (): boolean {
    return false
  }

  override getCompleteOverlays (): OverlayImp[] {
    return this.getWidget().getPane().getChart().getChartStore().getOverlaysByPaneId()
  }

  override getProgressOverlay (): Nullable<OverlayImp> {
    return this.getWidget().getPane().getChart().getChartStore().getProgressOverlayInfo()?.overlay ?? null
  }

  override getDefaultFigures (
    overlay: Overlay,
    coordinates: Coordinate[]
  ): OverlayFigure[] {
    const figures: OverlayFigure[] = []
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chartStore = pane.getChart().getChartStore()
    const clickOverlayInfo = chartStore.getClickOverlayInfo()
    if (overlay.needDefaultXAxisFigure && overlay.id === clickOverlayInfo.overlay?.id) {
      let leftX = Number.MAX_SAFE_INTEGER
      let rightX = Number.MIN_SAFE_INTEGER
      coordinates.forEach((coordinate, index) => {
        leftX = Math.min(leftX, coordinate.x)
        rightX = Math.max(rightX, coordinate.x)
        const point = overlay.points[index]
        if (isNumber(point.timestamp)) {
          const text = chartStore.getInnerFormatter().formatDate(point.timestamp, 'YYYY-MM-DD HH:mm', 'crosshair')
          figures.push({ type: 'text', attrs: { x: coordinate.x, y: 0, text, align: 'center' }, ignoreEvent: true })
        }
      })
      if (coordinates.length > 1) {
        figures.unshift({ type: 'rect', attrs: { x: leftX, y: 0, width: rightX - leftX, height: widget.getBounding().height }, ignoreEvent: true })
      }
    }
    return figures
  }

  override getFigures (
    o: Overlay,
    coordinates: Coordinate[]
  ): OverlayFigure | OverlayFigure[] {
    const widget = this.getWidget()
    const pane = widget.getPane()
    const chart = pane.getChart()
    const yAxis = pane.getAxisComponent() as unknown as Nullable<YAxis>
    const xAxis = chart.getXAxisPane().getAxisComponent()
    const bounding = widget.getBounding()
    return o.createXAxisFigures?.({ chart, overlay: o, coordinates, bounding, xAxis, yAxis }) ?? []
  }
}
