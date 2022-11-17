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

import TypeOrNull from '../common/TypeOrNull'
import Coordinate from '../common/Coordinate'
import { UpdateLevel } from '../common/Updater'

import { EventOptions, MouseTouchEvent } from '../common/MouseTouchEventHandler'

import Pane from '../pane/Pane'

import DrawWidget from './DrawWidget'

import { AxisExtremum } from '../component/Axis'
import YAxis from '../component/YAxis'

import YAxisView from '../view/YAxisView'
import CandleLastPriceLabelView from '../view/CandleLastPriceLabelView'
import IndicatorLastValueView from '../view/IndicatorLastValueView'
import OverlayYAxisView from '../view/OverlayYAxisView'
import CrosshairHorizontalLabelView from '../view/CrosshairHorizontalLabelView'

export default class YAxisWidget extends DrawWidget<YAxis> {
  private readonly _yAxisView = new YAxisView(this)
  private readonly _candleLastPriceLabelView = new CandleLastPriceLabelView(this)
  private readonly _indicatorLastValueView = new IndicatorLastValueView(this)
  private readonly _overlayYAxisView = new OverlayYAxisView(this)
  private readonly _crosshairHorizontalLabelView = new CrosshairHorizontalLabelView(this)

  private _prevExtremum: TypeOrNull<AxisExtremum> = null
  private _startScaleDistance = 0

  constructor (rootContainer: HTMLElement, pane: Pane<YAxis>) {
    super(rootContainer, pane)
    this.getEventContainer().style.cursor = 'ns-resize'
  }

  protected getEventOptions (): EventOptions {
    return {
      treatVertTouchDragAsPageScroll: () => false,
      treatHorzTouchDragAsPageScroll: () => true
    }
  }

  mouseUpEvent (event: MouseTouchEvent): void {
    if (this.dispatchEvent('mouseUpEvent', event)) {
      const pane = this.getPane()
      pane.getChart().updatePane(UpdateLevel.OVERLAY, pane.getId())
    }
    this._prevExtremum = null
    this._startScaleDistance = 0
  }

  mouseRightClickEvent (event: MouseTouchEvent): void {
    if (this.dispatchEvent('mouseRightClickEvent', event)) {
      const pane = this.getPane()
      pane.getChart().updatePane(UpdateLevel.OVERLAY, pane.getId())
    }
  }

  mouseDownEvent (event: MouseTouchEvent): void {
    if (this.dispatchEvent('mouseDownEvent', event)) {
      const pane = this.getPane()
      pane.getChart().updatePane(UpdateLevel.OVERLAY, pane.getId())
    }
    this._prevExtremum = { ...this.getPane().getAxisComponent().getExtremum() }
    this._startScaleDistance = event.y
  }

  mouseMoveEvent (event: MouseTouchEvent): void {
    if (this.dispatchEvent('mouseMoveEvent', event)) {
      const pane = this.getPane()
      pane.getChart().updatePane(UpdateLevel.OVERLAY, pane.getId())
    }
  }

  pressedMouseMoveEvent (event: MouseTouchEvent): void {
    const pane = this.getPane()
    const chart = pane.getChart()
    if (!this.dispatchEvent('pressedMouseMoveEvent', event)) {
      const bounding = this.getBounding()
      if (this._prevExtremum !== null && event.x > 0 && event.x < bounding.width && event.y > 0 && event.y < bounding.height) {
        const { min, max, range } = this._prevExtremum
        const scale = event.y / this._startScaleDistance
        const newRange = range * scale
        const difRange = (newRange - range) / 2
        const newMin = min - difRange
        const newMax = max + difRange
        const yAxis = pane.getAxisComponent()
        const newRealMin = yAxis.convertToRealValue(newMin)
        const newRealMax = yAxis.convertToRealValue(newMax)
        yAxis.setExtremum({
          min: newMin,
          max: newMax,
          range: newRange,
          realMin: newRealMin,
          realMax: newRealMax,
          realRange: newRealMax - newRealMin
        })
        chart.adjustPaneViewport(false, true, true, true)
      }
    } else {
      chart.updatePane(UpdateLevel.OVERLAY, pane.getId())
    }
  }

  mouseDoubleClickEvent (event: MouseTouchEvent): void {
    const pane = this.getPane()
    const yAxis = pane.getAxisComponent()
    if (!yAxis.getAutoCalcTickFlag()) {
      yAxis.setAutoCalcTickFlag(true)
      pane.getChart().adjustPaneViewport(false, true, true, true)
    }
  }

  dispatchEvent (type: string, coordinate: Coordinate): boolean {
    return this._overlayYAxisView.dispatchEvent(type, coordinate)
  }

  protected updateMain (ctx: CanvasRenderingContext2D): void {
    this._yAxisView.draw(ctx)
    if (this.getPane().getAxisComponent().isInCandle()) {
      this._candleLastPriceLabelView.draw(ctx)
    }
    this._indicatorLastValueView.draw(ctx)
  }

  protected updateOverlay (ctx: CanvasRenderingContext2D): void {
    this._overlayYAxisView.draw(ctx)
    this._crosshairHorizontalLabelView.draw(ctx)
  }
}
