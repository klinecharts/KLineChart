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
import { MouseTouchEvent, TOUCH_MIN_RADIUS } from '../common/MouseTouchEventHandler'

import { Crosshair } from '../store/CrosshairStore'

import Pane from '../pane/Pane'

import DrawWidget from './DrawWidget'

import YAxis from '../componentl/YAxis'

import GridView from '../view/GridView'
import IndicatorView from '../view/IndicatorView'
import CrosshairLineView from '../view/CrosshairLineView'
import IndicatorTooltipView from '../view/IndicatorTooltipView'

import { cancelAnimationFrame, requestAnimationFrame } from '../common/utils/compatible'

export default class IndicatorWidget extends DrawWidget<YAxis> {
  private readonly _gridView = new GridView(this)
  private readonly _indicatorView = new IndicatorView(this)
  private readonly _crosshairLineView = new CrosshairLineView(this)
  private readonly _tooltipView = this.createTooltipView()

  // 惯性滚动开始时间
  private _flingStartTime = new Date().getTime()
  // 惯性滚动定时器
  private _flingScrollTimerId: TypeOrNull<number> = null
  // 开始滚动时坐标点
  private _startScrollCoordinate: TypeOrNull<Coordinate> = null
  // 开始触摸时坐标
  private _touchCoordinate: TypeOrNull<Coordinate> = null
  // 是否是取消了十字光标
  private _touchCancelCrosshair = false
  // 是否缩放过
  private _touchZoomed = false
  // 用来记录捏合缩放的尺寸
  private _pinchScale = 1

  constructor (rootContainer: HTMLElement, pane: Pane<YAxis>) {
    super(rootContainer, pane)
    this.getEventContainer().style.cursor = 'crosshair'
  }

  pinchStartEvent (): void {
    this._pinchScale = 1
    this._touchZoomed = true
  }

  pinchEvent (coordinate: Coordinate, scale: number): void {
    const zoomScale = (scale - this._pinchScale) * 5
    this._pinchScale = scale
    this.getPane().getChart().getChartStore().getTimeScaleStore().zoom(zoomScale, coordinate)
  }

  mouseWheelHorizontalEvent (distance: number): void {
    const timeScaleStore = this.getPane().getChart().getChartStore().getTimeScaleStore()
    timeScaleStore.startScroll()
    timeScaleStore.scroll(distance)
  }

  mouseWheelVerticalEvent (coordinate: Coordinate, scale: number): void {
    this.getPane().getChart().getChartStore().getTimeScaleStore().zoom(scale, coordinate)
  }

  mouseClickEvent (event: MouseTouchEvent): void {
    if (event.isTouch && this._touchCoordinate === null && !this._touchCancelCrosshair && !this._touchZoomed) {
      this._touchCoordinate = { x: event.x, y: event.y }
      const pane = this.getPane()
      pane.getChart().getChartStore().getCrosshairStore().set({ x: event.x, y: event.y, paneId: pane.getId() })
    }
  }

  pressedMouseMoveEvent (event: MouseTouchEvent): void {
    const pane = this.getPane()
    const chartStore = pane.getChart().getChartStore()
    let crosshair: Crosshair | undefined = { x: event.x, y: event.y, paneId: pane.getId() }
    if (event.isTouch) {
      if (this._touchCoordinate !== null) {
        this._touchCoordinate = { x: event.x, y: event.y }
        chartStore.getCrosshairStore().set(crosshair)
        return
      } else {
        crosshair = undefined
      }
    }
    if (this._startScrollCoordinate !== null) {
      const distance = event.x - this._startScrollCoordinate.x
      chartStore.getTimeScaleStore().scroll(distance, crosshair)
    }
  }

  mouseUpEvent (): void {
    this._startScrollCoordinate = null
  }

  mouseDownEvent (event: MouseTouchEvent): void {
    if (this._flingScrollTimerId !== null) {
      cancelAnimationFrame(this._flingScrollTimerId)
      this._flingScrollTimerId = null
    }
    const pane = this.getPane()
    const chartStore = pane.getChart().getChartStore()
    this._flingStartTime = new Date().getTime()
    this._startScrollCoordinate = { x: event.x, y: event.x }
    chartStore.getTimeScaleStore().startScroll()
    if (event.isTouch) {
      this._touchZoomed = false
      if (this._touchCoordinate !== null) {
        const xDif = event.x - this._touchCoordinate.x
        const yDif = event.y - this._touchCoordinate.y
        const radius = Math.sqrt(xDif * xDif + yDif * yDif)
        const crosshairStore = chartStore.getCrosshairStore()
        if (radius < TOUCH_MIN_RADIUS) {
          this._touchCoordinate = { x: event.x, y: event.y }
          crosshairStore.set({ x: event.x, y: event.y, paneId: pane.getId() })
        } else {
          this._touchCancelCrosshair = true
          this._touchCoordinate = null
          crosshairStore.set()
        }
      } else {
        this._touchCancelCrosshair = false
      }
    }
  }

  mouseMoveEvent (event: MouseTouchEvent): void {
    const pane = this.getPane()
    const chartStore = pane.getChart().getChartStore()
    if (!chartStore.getDragPaneFlag()) {
      chartStore.getCrosshairStore().set({ x: event.x, y: event.y, paneId: pane.getId() })
    }
  }

  mouseLeaveEvent (event: MouseTouchEvent): void {
    if (event.isTouch) {
      if (this._startScrollCoordinate !== null) {
        const time = new Date().getTime() - this._flingStartTime
        const distance = event.x - this._startScrollCoordinate.x
        let v = (distance) / (time > 0 ? time : 1) * 20
        if (time < 200 && Math.abs(v) > 0) {
          const timeScaleStore = this.getPane().getChart().getChartStore().getTimeScaleStore()
          const flingScroll: (() => void) = () => {
            this._flingScrollTimerId = requestAnimationFrame(() => {
              timeScaleStore.startScroll()
              timeScaleStore.scroll(v)
              v = v * (1 - 0.025)
              if (Math.abs(v) < 1) {
                if (this._flingScrollTimerId !== null) {
                  cancelAnimationFrame(this._flingScrollTimerId)
                  this._flingScrollTimerId = null
                }
              } else {
                flingScroll()
              }
            })
          }
          flingScroll()
        }
      }
    } else {
      this._startScrollCoordinate = null
      this.getPane().getChart().getChartStore().getCrosshairStore().set()
    }
  }

  longTapEvent (event: MouseTouchEvent): void {
    if (event.isTouch) {
      this._touchCoordinate = { x: event.x, y: event.y }
      const pane = this.getPane()
      this.getPane().getChart().getChartStore().getCrosshairStore().set({ x: event.x, y: event.y, paneId: pane.getId() })
    }
  }

  protected updateMain (ctx: CanvasRenderingContext2D): void {
    this._gridView.draw(ctx)
    this.updateMainContent(ctx)
    this._indicatorView.draw(ctx)
  }

  protected createTooltipView (): IndicatorTooltipView {
    return new IndicatorTooltipView(this)
  }

  protected updateMainContent (ctx: CanvasRenderingContext2D): void {}

  protected updateOverlay (ctx: CanvasRenderingContext2D): void {
    this._crosshairLineView.draw(ctx)
    this._tooltipView.draw(ctx)
  }
}
