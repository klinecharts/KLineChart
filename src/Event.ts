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

import type Nullable from './common/Nullable'
import SyntheticEvent, { type EventHandler, type MouseTouchEvent, TOUCH_MIN_RADIUS } from './common/SyntheticEvent'
import type Coordinate from './common/Coordinate'
import { UpdateLevel } from './common/Updater'
import type Crosshair from './common/Crosshair'
import { requestAnimationFrame, cancelAnimationFrame } from './common/utils/compatible'
import { isValid } from './common/utils/typeChecks'

import type { AxisRange } from './component/Axis'
import type YAxis from './component/YAxis'
import type XAxis from './component/XAxis'

import type Chart from './Chart'
import type Pane from './pane/Pane'
import type DrawPane from './pane/DrawPane'
import { PaneIdConstants } from './pane/types'
import type Widget from './widget/Widget'
import { WidgetNameConstants, REAL_SEPARATOR_HEIGHT } from './widget/types'

interface EventTriggerWidgetInfo {
  pane: Nullable<Pane>
  widget: Nullable<Widget>
}

export default class Event implements EventHandler {
  private readonly _container: HTMLElement
  private readonly _chart: Chart
  private readonly _event: SyntheticEvent

  // 惯性滚动开始时间
  private _flingStartTime = new Date().getTime()
  // 惯性滚动定时器
  private _flingScrollRequestId: Nullable<number> = null
  // 开始滚动时坐标点
  private _startScrollCoordinate: Nullable<Coordinate> = null
  // 开始触摸时坐标
  private _touchCoordinate: Nullable<Coordinate> = null
  // 是否是取消了十字光标
  private _touchCancelCrosshair = false
  // 是否缩放过
  private _touchZoomed = false
  // 用来记录捏合缩放的尺寸
  private _pinchScale = 1

  private _mouseDownWidget: Nullable<Widget> = null

  private _prevYAxisRange: Nullable<AxisRange> = null

  private _xAxisStartScaleCoordinate: Nullable<Coordinate> = null
  private _xAxisStartScaleDistance = 0
  private _xAxisScale = 1

  private _yAxisStartScaleDistance = 0

  private _mouseMoveTriggerWidgetInfo: EventTriggerWidgetInfo = { pane: null, widget: null }

  private readonly _boundKeyBoardDownEvent: ((event: KeyboardEvent) => void) = (event: KeyboardEvent) => {
    if (event.shiftKey) {
      switch (event.code) {
        case 'Equal': {
          this._chart.getChartStore().zoom(0.5)
          break
        }
        case 'Minus': {
          this._chart.getChartStore().zoom(-0.5)
          break
        }
        case 'ArrowLeft': {
          const store = this._chart.getChartStore()
          store.startScroll()
          store.scroll(-3 * store.getBarSpace().bar)
          break
        }
        case 'ArrowRight': {
          const store = this._chart.getChartStore()
          store.startScroll()
          store.scroll(3 * store.getBarSpace().bar)
          break
        }
        default: {
          break
        }
      }
    }
  }

  constructor (container: HTMLElement, chart: Chart) {
    this._container = container
    this._chart = chart
    this._event = new SyntheticEvent(container, this, {
      treatVertDragAsPageScroll: () => false,
      treatHorzDragAsPageScroll: () => false
    })
    container.addEventListener('keydown', this._boundKeyBoardDownEvent)
  }

  pinchStartEvent (): boolean {
    this._touchZoomed = true
    this._pinchScale = 1
    return true
  }

  pinchEvent (e: MouseTouchEvent, scale: number): boolean {
    const { pane, widget } = this._findWidgetByEvent(e)
    if (pane?.getId() !== PaneIdConstants.X_AXIS && widget?.getName() === WidgetNameConstants.MAIN) {
      const event = this._makeWidgetEvent(e, widget)
      const zoomScale = (scale - this._pinchScale) * 5
      this._pinchScale = scale
      this._chart.getChartStore().zoom(zoomScale, { x: event.x, y: event.y })
      return true
    }
    return false
  }

  mouseWheelHortEvent (_: MouseTouchEvent, distance: number): boolean {
    const store = this._chart.getChartStore()
    store.startScroll()
    store.scroll(distance)
    return true
  }

  mouseWheelVertEvent (e: MouseTouchEvent, scale: number): boolean {
    const { widget } = this._findWidgetByEvent(e)
    const event = this._makeWidgetEvent(e, widget)
    const name = widget?.getName()
    if (name === WidgetNameConstants.MAIN) {
      this._chart.getChartStore().zoom(scale, { x: event.x, y: event.y })
      return true
    }
    return false
  }

  mouseDownEvent (e: MouseTouchEvent): boolean {
    const { pane, widget } = this._findWidgetByEvent(e)
    this._mouseDownWidget = widget
    if (widget !== null) {
      const event = this._makeWidgetEvent(e, widget)
      const name = widget.getName()
      switch (name) {
        case WidgetNameConstants.SEPARATOR: {
          return widget.dispatchEvent('mouseDownEvent', event)
        }
        case WidgetNameConstants.MAIN: {
          const range = (pane as DrawPane<YAxis>).getAxisComponent().getRange()
          this._prevYAxisRange = { ...range }
          this._startScrollCoordinate = { x: event.x, y: event.y }
          this._chart.getChartStore().startScroll()
          return widget.dispatchEvent('mouseDownEvent', event)
        }
        case WidgetNameConstants.X_AXIS: {
          return this._processXAxisScrollStartEvent(widget, event)
        }
        case WidgetNameConstants.Y_AXIS: {
          return this._processYAxisScaleStartEvent(widget as Widget<DrawPane<YAxis>>, event)
        }
      }
    }
    return false
  }

  mouseMoveEvent (e: MouseTouchEvent): boolean {
    const { pane, widget } = this._findWidgetByEvent(e)
    const event = this._makeWidgetEvent(e, widget)
    if (
      this._mouseMoveTriggerWidgetInfo.pane?.getId() !== pane?.getId() ||
      this._mouseMoveTriggerWidgetInfo.widget?.getName() !== widget?.getName()
    ) {
      widget?.dispatchEvent('mouseEnterEvent', event)
      this._mouseMoveTriggerWidgetInfo.widget?.dispatchEvent('mouseLeaveEvent', event)
      this._mouseMoveTriggerWidgetInfo = { pane, widget }
    }
    if (widget !== null) {
      const name = widget.getName()
      switch (name) {
        case WidgetNameConstants.MAIN: {
          const consumed = widget.dispatchEvent('mouseMoveEvent', event)
          let crosshair: Crosshair | undefined = { x: event.x, y: event.y, paneId: pane?.getId() }
          if (consumed) {
            crosshair = undefined
            widget.getContainer().style.cursor = 'pointer'
          }
          this._chart.getChartStore().setCrosshair(crosshair)
          return consumed
        }
        case WidgetNameConstants.SEPARATOR:
        case WidgetNameConstants.X_AXIS:
        case WidgetNameConstants.Y_AXIS: {
          const consumed = widget.dispatchEvent('mouseMoveEvent', event)
          this._chart.getChartStore().setCrosshair()
          return consumed
        }
      }
    }
    return false
  }

  pressedMouseMoveEvent (e: MouseTouchEvent): boolean {
    if (this._mouseDownWidget !== null && this._mouseDownWidget.getName() === WidgetNameConstants.SEPARATOR) {
      return this._mouseDownWidget.dispatchEvent('pressedMouseMoveEvent', e)
    }
    const { pane, widget } = this._findWidgetByEvent(e)
    if (
      widget !== null &&
      this._mouseDownWidget?.getPane().getId() === pane?.getId() &&
      this._mouseDownWidget?.getName() === widget.getName()
    ) {
      const event = this._makeWidgetEvent(e, widget)
      const name = widget.getName()
      switch (name) {
        case WidgetNameConstants.MAIN: {
          const consumed = widget.dispatchEvent('pressedMouseMoveEvent', event)
          if (!consumed) {
            this._processMainScrollingEvent(widget as Widget<DrawPane<YAxis>>, event)
          }
          this._chart.getChartStore().setCrosshair({ x: event.x, y: event.y, paneId: pane?.getId() })
          return consumed
        }
        case WidgetNameConstants.X_AXIS: {
          return this._processXAxisScrollingEvent(widget as Widget<DrawPane<XAxis>>, event)
        }
        case WidgetNameConstants.Y_AXIS: {
          return this._processYAxisScalingEvent(widget as Widget<DrawPane<YAxis>>, event)
        }
      }
    }
    return false
  }

  mouseUpEvent (e: MouseTouchEvent): boolean {
    const { widget } = this._findWidgetByEvent(e)
    let consumed = false
    if (widget !== null) {
      const event = this._makeWidgetEvent(e, widget)
      const name = widget.getName()
      switch (name) {
        case WidgetNameConstants.MAIN:
        case WidgetNameConstants.SEPARATOR:
        case WidgetNameConstants.X_AXIS:
        case WidgetNameConstants.Y_AXIS: {
          consumed = widget.dispatchEvent('mouseUpEvent', event)
          break
        }
      }
      if (consumed) {
        this._chart.updatePane(UpdateLevel.Overlay)
      }
    }
    this._mouseDownWidget = null
    this._startScrollCoordinate = null
    this._prevYAxisRange = null
    this._xAxisStartScaleCoordinate = null
    this._xAxisStartScaleDistance = 0
    this._xAxisScale = 1
    this._yAxisStartScaleDistance = 0
    return consumed
  }

  mouseClickEvent (e: MouseTouchEvent): boolean {
    const { widget } = this._findWidgetByEvent(e)
    if (widget !== null) {
      const event = this._makeWidgetEvent(e, widget)
      return widget.dispatchEvent('mouseClickEvent', event)
    }
    return false
  }

  mouseRightClickEvent (e: MouseTouchEvent): boolean {
    const { widget } = this._findWidgetByEvent(e)
    let consumed = false
    if (widget !== null) {
      const event = this._makeWidgetEvent(e, widget)
      const name = widget.getName()
      switch (name) {
        case WidgetNameConstants.MAIN:
        case WidgetNameConstants.X_AXIS:
        case WidgetNameConstants.Y_AXIS: {
          consumed = widget.dispatchEvent('mouseRightClickEvent', event)
          break
        }
      }
      if (consumed) {
        this._chart.updatePane(UpdateLevel.Overlay)
      }
    }
    return false
  }

  mouseDoubleClickEvent (e: MouseTouchEvent): boolean {
    const { pane, widget } = this._findWidgetByEvent(e)
    if (widget !== null) {
      const name = widget.getName()
      switch (name) {
        case WidgetNameConstants.MAIN: {
          const event = this._makeWidgetEvent(e, widget)
          return widget.dispatchEvent('mouseDoubleClickEvent', event)
        }
        case WidgetNameConstants.Y_AXIS: {
          const yAxis = (pane as DrawPane<YAxis>).getAxisComponent()
          if (!yAxis.getAutoCalcTickFlag()) {
            yAxis.setAutoCalcTickFlag(true)
            this._chart.layout({
              measureWidth: true,
              update: true,
              buildYAxisTick: true
            })
            return true
          }
          break
        }
      }
    }
    return false
  }

  mouseLeaveEvent (): boolean {
    this._chart.getChartStore().setCrosshair()
    return true
  }

  touchStartEvent (e: MouseTouchEvent): boolean {
    const { pane, widget } = this._findWidgetByEvent(e)
    if (widget !== null) {
      const event = this._makeWidgetEvent(e, widget)
      const name = widget.getName()
      switch (name) {
        case WidgetNameConstants.MAIN: {
          const chartStore = this._chart.getChartStore()
          if (widget.dispatchEvent('mouseDownEvent', event)) {
            this._touchCancelCrosshair = true
            this._touchCoordinate = null
            chartStore.setCrosshair(undefined, { notInvalidate: true })
            this._chart.updatePane(UpdateLevel.Overlay)
            return true
          }
          if (this._flingScrollRequestId !== null) {
            cancelAnimationFrame(this._flingScrollRequestId)
            this._flingScrollRequestId = null
          }
          this._flingStartTime = new Date().getTime()
          const range = (pane as DrawPane<YAxis>).getAxisComponent().getRange()
          this._prevYAxisRange = { ...range }
          this._startScrollCoordinate = { x: event.x, y: event.y }
          chartStore.startScroll()
          this._touchZoomed = false
          if (this._touchCoordinate !== null) {
            const xDif = event.x - this._touchCoordinate.x
            const yDif = event.y - this._touchCoordinate.y
            const radius = Math.sqrt(xDif * xDif + yDif * yDif)
            if (radius < TOUCH_MIN_RADIUS) {
              this._touchCoordinate = { x: event.x, y: event.y }
              chartStore.setCrosshair({ x: event.x, y: event.y, paneId: pane?.getId() })
            } else {
              this._touchCoordinate = null
              this._touchCancelCrosshair = true
              chartStore.setCrosshair()
            }
          }
          return true
        }
        case WidgetNameConstants.X_AXIS: {
          const consumed = this._processXAxisScrollStartEvent(widget, event)
          if (consumed) {
            event.preventDefault?.()
          }
          return consumed
        }
        case WidgetNameConstants.Y_AXIS: {
          const consumed = this._processYAxisScaleStartEvent(widget as Widget<DrawPane<YAxis>>, event)
          if (consumed) {
            event.preventDefault?.()
          }
          return consumed
        }
      }
    }
    return false
  }

  touchMoveEvent (e: MouseTouchEvent): boolean {
    const { pane, widget } = this._findWidgetByEvent(e)
    if (widget !== null) {
      const event = this._makeWidgetEvent(e, widget)
      const name = widget.getName()
      const chartStore = this._chart.getChartStore()
      switch (name) {
        case WidgetNameConstants.MAIN: {
          if (widget.dispatchEvent('pressedMouseMoveEvent', event)) {
            event.preventDefault?.()
            chartStore.setCrosshair(undefined, { notInvalidate: true })
            this._chart.updatePane(UpdateLevel.Overlay)
            return true
          }
          if (this._touchCoordinate !== null) {
            event.preventDefault?.()
            chartStore.setCrosshair({ x: event.x, y: event.y, paneId: pane?.getId() })
          } else {
            this._processMainScrollingEvent(widget as Widget<DrawPane<YAxis>>, event)
          }
          return true
        }
        case WidgetNameConstants.X_AXIS: {
          const consumed = this._processXAxisScrollingEvent(widget as Widget<DrawPane<XAxis>>, event)
          if (consumed) {
            event.preventDefault?.()
          }
          return consumed
        }
        case WidgetNameConstants.Y_AXIS: {
          const consumed = this._processYAxisScalingEvent(widget as Widget<DrawPane<YAxis>>, event)
          if (consumed) {
            event.preventDefault?.()
          }
          return consumed
        }
      }
    }
    return false
  }

  touchEndEvent (e: MouseTouchEvent): boolean {
    const { widget } = this._findWidgetByEvent(e)
    if (widget !== null) {
      const event = this._makeWidgetEvent(e, widget)
      const name = widget.getName()
      switch (name) {
        case WidgetNameConstants.MAIN: {
          widget.dispatchEvent('mouseUpEvent', event)
          if (this._startScrollCoordinate !== null) {
            const time = new Date().getTime() - this._flingStartTime
            const distance = event.x - this._startScrollCoordinate.x
            let v = distance / (time > 0 ? time : 1) * 20
            if (time < 200 && Math.abs(v) > 0) {
              const store = this._chart.getChartStore()
              const flingScroll: (() => void) = () => {
                this._flingScrollRequestId = requestAnimationFrame(() => {
                  store.startScroll()
                  store.scroll(v)
                  v = v * (1 - 0.025)
                  if (Math.abs(v) < 1) {
                    if (this._flingScrollRequestId !== null) {
                      cancelAnimationFrame(this._flingScrollRequestId)
                      this._flingScrollRequestId = null
                    }
                  } else {
                    flingScroll()
                  }
                })
              }
              flingScroll()
            }
          }
          return true
        }
        case WidgetNameConstants.X_AXIS:
        case WidgetNameConstants.Y_AXIS: {
          const consumed = widget.dispatchEvent('mouseUpEvent', event)
          if (consumed) {
            this._chart.updatePane(UpdateLevel.Overlay)
          }
        }
      }
      this._startScrollCoordinate = null
      this._prevYAxisRange = null
      this._xAxisStartScaleCoordinate = null
      this._xAxisStartScaleDistance = 0
      this._xAxisScale = 1
      this._yAxisStartScaleDistance = 0
    }
    return false
  }

  tapEvent (e: MouseTouchEvent): boolean {
    const { pane, widget } = this._findWidgetByEvent(e)
    let consumed = false
    if (widget !== null) {
      const event = this._makeWidgetEvent(e, widget)
      const result = widget.dispatchEvent('mouseClickEvent', event)
      if (widget.getName() === WidgetNameConstants.MAIN) {
        const event = this._makeWidgetEvent(e, widget)
        const chartStore = this._chart.getChartStore()
        if (result) {
          this._touchCancelCrosshair = true
          this._touchCoordinate = null
          chartStore.setCrosshair(undefined, { notInvalidate: true })
          consumed = true
        } else {
          if (!this._touchCancelCrosshair && !this._touchZoomed) {
            this._touchCoordinate = { x: event.x, y: event.y }
            chartStore.setCrosshair({ x: event.x, y: event.y, paneId: pane?.getId() }, { notInvalidate: true })
            consumed = true
          }
          this._touchCancelCrosshair = false
        }
      }
      if (consumed || result) {
        this._chart.updatePane(UpdateLevel.Overlay)
      }
    }
    return consumed
  }

  doubleTapEvent (e: MouseTouchEvent): boolean {
    return this.mouseDoubleClickEvent(e)
  }

  longTapEvent (e: MouseTouchEvent): boolean {
    const { pane, widget } = this._findWidgetByEvent(e)
    if (widget !== null && widget.getName() === WidgetNameConstants.MAIN) {
      const event = this._makeWidgetEvent(e, widget)
      this._touchCoordinate = { x: event.x, y: event.y }
      this._chart.getChartStore().setCrosshair({ x: event.x, y: event.y, paneId: pane?.getId() })
      return true
    }
    return false
  }

  private _processMainScrollingEvent (widget: Widget<DrawPane<YAxis>>, event: MouseTouchEvent): void {
    if (this._startScrollCoordinate !== null) {
      const yAxis = widget.getPane().getAxisComponent()
      const bounding = widget.getBounding()
      if (this._prevYAxisRange !== null && !yAxis.getAutoCalcTickFlag() && yAxis.scrollZoomEnabled) {
        const { from, to, range } = this._prevYAxisRange
        let distance = 0
        if (yAxis.reverse) {
          distance = this._startScrollCoordinate.y - event.y
        } else {
          distance = event.y - this._startScrollCoordinate.y
        }
        const scale = distance / bounding.height
        const difRange = range * scale
        const newFrom = from + difRange
        const newTo = to + difRange
        const newRealFrom = yAxis.valueToRealValue(newFrom, { range: this._prevYAxisRange })
        const newRealTo = yAxis.valueToRealValue(newTo, { range: this._prevYAxisRange })
        const newDisplayFrom = yAxis.realValueToDisplayValue(newRealFrom, { range: this._prevYAxisRange })
        const newDisplayTo = yAxis.realValueToDisplayValue(newRealTo, { range: this._prevYAxisRange })
        yAxis.setRange({
          from: newFrom,
          to: newTo,
          range: newTo - newFrom,
          realFrom: newRealFrom,
          realTo: newRealTo,
          realRange: newRealTo - newRealFrom,
          displayFrom: newDisplayFrom,
          displayTo: newDisplayTo,
          displayRange: newDisplayTo - newDisplayFrom
        })
      }
      const distance = event.x - this._startScrollCoordinate.x
      this._chart.getChartStore().scroll(distance)
    }
  }

  private _processXAxisScrollStartEvent (widget: Widget, event: MouseTouchEvent): boolean {
    const consumed = widget.dispatchEvent('mouseDownEvent', event)
    if (consumed) {
      this._chart.updatePane(UpdateLevel.Overlay)
    }
    this._xAxisStartScaleCoordinate = { x: event.x, y: event.y }
    this._xAxisStartScaleDistance = event.pageX
    return consumed
  }

  private _processXAxisScrollingEvent (widget: Widget<DrawPane<XAxis>>, event: MouseTouchEvent): boolean {
    const consumed = widget.dispatchEvent('pressedMouseMoveEvent', event)
    if (!consumed) {
      const xAxis = widget.getPane().getAxisComponent()
      if ((xAxis.scrollZoomEnabled)) {
        const scale = this._xAxisStartScaleDistance / event.pageX
        if (Number.isFinite(scale)) {
          const zoomScale = (scale - this._xAxisScale) * 10
          this._xAxisScale = scale
          this._chart.getChartStore().zoom(zoomScale, this._xAxisStartScaleCoordinate ?? undefined)
        }
      }
    } else {
      this._chart.updatePane(UpdateLevel.Overlay)
    }
    return consumed
  }

  private _processYAxisScaleStartEvent (widget: Widget<DrawPane<YAxis>>, event: MouseTouchEvent): boolean {
    const consumed = widget.dispatchEvent('mouseDownEvent', event)
    if (consumed) {
      this._chart.updatePane(UpdateLevel.Overlay)
    }
    const range = widget.getPane().getAxisComponent().getRange()
    this._prevYAxisRange = { ...range }
    this._yAxisStartScaleDistance = event.pageY
    return consumed
  }

  private _processYAxisScalingEvent (widget: Widget<DrawPane<YAxis>>, event: MouseTouchEvent): boolean {
    const consumed = widget.dispatchEvent('pressedMouseMoveEvent', event)
    if (!consumed) {
      const yAxis = widget.getPane().getAxisComponent()
      if (this._prevYAxisRange !== null && yAxis.scrollZoomEnabled) {
        const { from, to, range } = this._prevYAxisRange
        const scale = event.pageY / this._yAxisStartScaleDistance
        const newRange = range * scale
        const difRange = (newRange - range) / 2
        const newFrom = from - difRange
        const newTo = to + difRange
        const newRealFrom = yAxis.valueToRealValue(newFrom, { range: this._prevYAxisRange })
        const newRealTo = yAxis.valueToRealValue(newTo, { range: this._prevYAxisRange })
        const newDisplayFrom = yAxis.realValueToDisplayValue(newRealFrom, { range: this._prevYAxisRange })
        const newDisplayTo = yAxis.realValueToDisplayValue(newRealTo, { range: this._prevYAxisRange })
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
        this._chart.layout({
          measureWidth: true,
          update: true,
          buildYAxisTick: true
        })
      }
    } else {
      this._chart.updatePane(UpdateLevel.Overlay)
    }
    return consumed
  }

  private _findWidgetByEvent (event: MouseTouchEvent): EventTriggerWidgetInfo {
    const { x, y } = event
    const separatorPanes = this._chart.getSeparatorPanes()
    const separatorSize = this._chart.getStyles().separator.size
    for (const [, pane] of separatorPanes) {
      const bounding = pane.getBounding()
      const top = bounding.top - Math.round((REAL_SEPARATOR_HEIGHT - separatorSize) / 2)
      if (
        x >= bounding.left && x <= bounding.left + bounding.width &&
        y >= top && y <= top + REAL_SEPARATOR_HEIGHT
      ) {
        return { pane, widget: pane.getWidget() }
      }
    }

    const drawPanes = this._chart.getDrawPanes()

    let pane: Nullable<DrawPane> = null
    for (const p of drawPanes) {
      const bounding = p.getBounding()
      if (
        x >= bounding.left && x <= bounding.left + bounding.width &&
        y >= bounding.top && y <= bounding.top + bounding.height
      ) {
        pane = p
        break
      }
    }
    let widget: Nullable<Widget> = null
    if (pane !== null) {
      if (!isValid(widget)) {
        const mainWidget = pane.getMainWidget()
        const mainBounding = mainWidget.getBounding()
        if (
          x >= mainBounding.left && x <= mainBounding.left + mainBounding.width &&
          y >= mainBounding.top && y <= mainBounding.top + mainBounding.height
        ) {
          widget = mainWidget
        }
      }
      if (!isValid(widget)) {
        const yAxisWidget = pane.getYAxisWidget()
        if (yAxisWidget !== null) {
          const yAxisBounding = yAxisWidget.getBounding()
          if (
            x >= yAxisBounding.left && x <= yAxisBounding.left + yAxisBounding.width &&
            y >= yAxisBounding.top && y <= yAxisBounding.top + yAxisBounding.height
          ) {
            widget = yAxisWidget
          }
        }
      }
    }
    return { pane, widget }
  }

  private _makeWidgetEvent (event: MouseTouchEvent, widget: Nullable<Widget>): MouseTouchEvent {
    const bounding = widget?.getBounding() ?? null
    return {
      ...event,
      x: event.x - (bounding?.left ?? 0),
      y: event.y - (bounding?.top ?? 0)
    }
  }

  destroy (): void {
    this._container.removeEventListener('keydown', this._boundKeyBoardDownEvent)
    this._event.destroy()
  }
}
