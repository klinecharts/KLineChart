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

import type { AxisRange } from '../component/Axis'
import type { YAxis } from '../component/YAxis'
import type YAxisImp from '../component/YAxis'
import type { MouseTouchEvent } from '../common/EventHandler'
import type Nullable from '../common/Nullable'
import { isValid } from '../common/utils/typeChecks'
import type DrawPane from '../pane/DrawPane'
import CandleLastPriceLabelView from '../view/CandleLastPriceLabelView'
import CrosshairHorizontalLabelView from '../view/CrosshairHorizontalLabelView'
import IndicatorLastValueView from '../view/IndicatorLastValueView'
import OverlayYAxisView from '../view/OverlayYAxisView'
import YAxisView from '../view/YAxisView'
import DrawWidget from './DrawWidget'
import { WidgetNameConstants } from './types'

export default class YAxisWidget extends DrawWidget<DrawPane<YAxis>> {
  private readonly _yAxis: YAxis
  private readonly _yAxisView = new YAxisView(this)
  private readonly _candleLastPriceLabelView = new CandleLastPriceLabelView(this)
  private readonly _indicatorLastValueView = new IndicatorLastValueView(this)
  private readonly _overlayYAxisView = new OverlayYAxisView(this)
  private readonly _crosshairHorizontalLabelView = new CrosshairHorizontalLabelView(this)

  private _prevYAxisRange: Nullable<AxisRange> = null
  private _yAxisStartScaleDistance = 0

  constructor(rootContainer: HTMLElement, pane: DrawPane<YAxis>, yAxis: YAxis) {
    super(rootContainer, pane)
    this._yAxis = yAxis
    this.setCursor('ns-resize')
    this.addChild(this._overlayYAxisView)
    this.registerEvent('mouseDownEvent', this._mouseDownEvent.bind(this)).registerEvent('pressedMouseMoveEvent', this._pressedMouseMoveEvent.bind(this)).registerEvent('mouseUpEvent', this._mouseUpEvent.bind(this))
  }

  getAxisComponent(): YAxis {
    return this._yAxis
  }

  getYAxisScaleTarget(): YAxisImp {
    const pane = this.getPane()
    if (pane.isManualYAxis(this._yAxis.id)) {
      return pane.getYAxisComponentById() as unknown as YAxisImp
    }
    return this._yAxis as unknown as YAxisImp
  }

  zoomYAxis(scaleFactor: number, baseRange?: AxisRange): boolean {
    const yAxis = this._yAxis as unknown as YAxisImp
    if (!yAxis.scrollZoomEnabled) {
      return false
    }
    const targetYAxis = this.getYAxisScaleTarget()
    this._zoomYAxis(targetYAxis, scaleFactor, baseRange)
    this._syncManualYAxesValueRange(targetYAxis)
    return true
  }

  resetYAxisAndManualYAxes(): boolean {
    const yAxis = this._yAxis as unknown as YAxisImp
    const targetYAxis = this.getYAxisScaleTarget()
    if (!targetYAxis.getAutoCalcTickFlag() || !yAxis.getAutoCalcTickFlag()) {
      targetYAxis.setAutoCalcTickFlag(true)
      this.getPane()
        .getYAxisComponents()
        .forEach((axis) => {
          const item = axis as unknown as YAxisImp
          if (this.getPane().isManualYAxis(item.id)) {
            item.setAutoCalcTickFlag(true)
          }
        })
      this.getPane().getChart().layout({
        measureWidth: true,
        update: true,
        buildYAxisTick: true
      })
      return true
    }
    return false
  }

  private _mouseDownEvent(event: MouseTouchEvent): boolean {
    const targetYAxis = this.getYAxisScaleTarget()
    const range = targetYAxis.getRange()
    this._prevYAxisRange = { ...range }
    this._yAxisStartScaleDistance = event.pageY
    return false
  }

  private _pressedMouseMoveEvent(event: MouseTouchEvent): boolean {
    const yAxis = this._yAxis as unknown as YAxisImp
    const targetYAxis = this.getYAxisScaleTarget()
    const prevYAxisRange = this._prevYAxisRange
    if (isValid(prevYAxisRange) && yAxis.scrollZoomEnabled && this._yAxisStartScaleDistance !== 0) {
      event.preventDefault?.()
      const scaleFactor = event.pageY / this._yAxisStartScaleDistance
      this._zoomYAxis(targetYAxis, scaleFactor, prevYAxisRange)
      this._syncManualYAxesValueRange(targetYAxis)
    }
    return false
  }

  private _mouseUpEvent(): boolean {
    this._prevYAxisRange = null
    this._yAxisStartScaleDistance = 0
    return false
  }

  private _zoomYAxis(yAxis: YAxisImp, scaleFactor: number, baseRange?: AxisRange): void {
    const prevYAxisRange = baseRange ?? yAxis.getRange()
    const { from, to, range } = prevYAxisRange
    const newRange = range * scaleFactor
    const difRange = (newRange - range) / 2
    const newFrom = from - difRange
    const newTo = to + difRange
    const newRealFrom = yAxis.valueToRealValue(newFrom, { range: prevYAxisRange })
    const newRealTo = yAxis.valueToRealValue(newTo, { range: prevYAxisRange })
    const newDisplayFrom = yAxis.realValueToDisplayValue(newRealFrom, { range: prevYAxisRange })
    const newDisplayTo = yAxis.realValueToDisplayValue(newRealTo, { range: prevYAxisRange })
    yAxis.setRange({
      from: newFrom,
      to: newTo,
      range: newRange,
      realFrom: newRealFrom,
      realTo: newRealTo,
      realRange: newRealTo - newRealFrom,
      displayFrom: newDisplayFrom,
      displayTo: newDisplayTo,
      displayRange: newDisplayTo - newDisplayFrom
    })
    this.getPane().getChart().layout({
      measureWidth: true,
      update: true,
      buildYAxisTick: true
    })
  }

  private _syncManualYAxesValueRange(sourceYAxis: YAxisImp): void {
    const sourceRange = sourceYAxis.getRange()
    this.getPane()
      .getYAxisComponents()
      .forEach((axis) => {
        const yAxis = axis as unknown as YAxisImp
        if (yAxis !== sourceYAxis && this.getPane().isManualYAxis(yAxis.id)) {
          this._syncYAxisValueRange(yAxis, sourceRange)
        }
      })
  }

  private _syncYAxisValueRange(yAxis: YAxisImp, sourceRange: AxisRange): void {
    const baseRange = yAxis.getRange()
    const { from, to } = sourceRange
    const realFrom = yAxis.valueToRealValue(from, { range: baseRange })
    const realTo = yAxis.valueToRealValue(to, { range: baseRange })
    const displayFrom = yAxis.realValueToDisplayValue(realFrom, { range: baseRange })
    const displayTo = yAxis.realValueToDisplayValue(realTo, { range: baseRange })
    yAxis.setRange({
      from,
      to,
      range: to - from,
      realFrom,
      realTo,
      realRange: realTo - realFrom,
      displayFrom,
      displayTo,
      displayRange: displayTo - displayFrom
    })
  }

  override getName(): string {
    return WidgetNameConstants.Y_AXIS
  }

  override updateMain(ctx: CanvasRenderingContext2D): void {
    this._yAxisView.draw(ctx)
    const pane = this.getPane()
    const isCandleLastPriceLabelVisibleYAxis = pane.isDefaultYAxis(this._yAxis.id) || pane.isManualYAxis(this._yAxis.id)
    if (isCandleLastPriceLabelVisibleYAxis && this.getAxisComponent().isInCandle()) {
      this._candleLastPriceLabelView.draw(ctx)
    }
    this._indicatorLastValueView.draw(ctx)
  }

  override updateOverlay(ctx: CanvasRenderingContext2D): void {
    this._overlayYAxisView.draw(ctx)
    this._crosshairHorizontalLabelView.draw(ctx)
  }
}
