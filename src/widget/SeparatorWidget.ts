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

import Bounding from '../common/Bounding'
import { UpdateLevel } from '../common/Updater'
import { MouseTouchEvent } from '../common/SyntheticEvent'
import { ActionType } from '../common/Action'

import Axis from '../component/Axis'
import YAxis from '../component/YAxis'

import Widget, { WidgetNameConstants } from './Widget'
import Pane from '../pane/Pane'

import { createDom } from '../common/utils/dom'
import { getPixelRatio } from '../common/utils/canvas'
import { throttle } from '../common/utils/performance'

export const REAL_SEPARATOR_HEIGHT = 7

export default class SeparatorWidget extends Widget<YAxis> {
  private _moveDom: HTMLElement

  private _dragFlag = false
  private _dragStartY = 0

  private _topPaneHeight = 0
  private _currentPaneHeight = 0

  constructor (rootContainer: HTMLElement, pane: Pane<YAxis>) {
    super(rootContainer, pane)
    this.registerEvent('touchStartEvent', this._mouseDownEvent.bind(this))
      .registerEvent('touchMoveEvent', this._pressedMouseMoveEvent.bind(this))
      .registerEvent('touchEndEvent', this._mouseUpEvent.bind(this))
      .registerEvent('mouseDownEvent', this._mouseDownEvent.bind(this))
      .registerEvent('mouseUpEvent', this._mouseUpEvent.bind(this))
      .registerEvent('pressedMouseMoveEvent', this._pressedMouseMoveEvent.bind(this))
      .registerEvent('mouseEnterEvent', this._mouseEnterEvent.bind(this))
      .registerEvent('mouseLeaveEvent', this._mouseLeaveEvent.bind(this))
  }

  getName (): string {
    return WidgetNameConstants.SEPARATOR
  }

  checkEventOn (): boolean {
    return true
  }

  private _mouseDownEvent (event: MouseTouchEvent): boolean {
    this._dragFlag = true
    this._dragStartY = event.pageY
    const pane = this.getPane()
    this._topPaneHeight = pane.getTopPane()?.getBounding().height ?? 0
    this._currentPaneHeight = pane.getBounding().height
    return true
  }

  private _mouseUpEvent (): boolean {
    this._dragFlag = false
    return this._mouseLeaveEvent()
  }

  private readonly _pressedMouseMoveEvent = throttle(this._pressedTouchMouseMoveEvent, 20)

  private _pressedTouchMouseMoveEvent (event: MouseTouchEvent): boolean {
    const dragDistance = event.pageY - this._dragStartY
    const currentPane = this.getPane()
    const topPane = currentPane.getTopPane()
    const isUpDrag = dragDistance < 0
    if (topPane !== null && currentPane.getOptions().dragEnabled) {
      let reducedPane: Pane<Axis>
      let increasedPane: Pane<Axis>
      let startDragReducedPaneHeight: number
      let startDragIncreasedPaneHeight: number
      if (isUpDrag) {
        reducedPane = topPane
        increasedPane = currentPane
        startDragReducedPaneHeight = this._topPaneHeight
        startDragIncreasedPaneHeight = this._currentPaneHeight
      } else {
        reducedPane = currentPane
        increasedPane = topPane
        startDragReducedPaneHeight = this._currentPaneHeight
        startDragIncreasedPaneHeight = this._topPaneHeight
      }
      const reducedPaneMinHeight = reducedPane.getOptions().minHeight
      if (startDragReducedPaneHeight > reducedPaneMinHeight) {
        const reducedPaneHeight = Math.max(startDragReducedPaneHeight - Math.abs(dragDistance), reducedPaneMinHeight)
        const diffHeight = startDragReducedPaneHeight - reducedPaneHeight
        reducedPane.setBounding({ height: reducedPaneHeight })
        increasedPane.setBounding({ height: startDragIncreasedPaneHeight + diffHeight })
        const chart = currentPane.getChart()
        chart.getChartStore().getActionStore().execute(ActionType.onPaneDrag, { paneId: currentPane.getId })
        chart.adjustPaneViewport(true, true, true, true, true)
      }
    }
    return true
  }

  private _mouseEnterEvent (): boolean {
    const pane = this.getPane()
    if (pane.getOptions().dragEnabled) {
      const chart = pane.getChart()
      const styles = chart.getStyles().separator
      this._moveDom.style.background = styles.activeBackgroundColor
      const chartStore = chart.getChartStore()
      chartStore.setDragPaneFlag(true)
      chartStore.getCrosshairStore().set()
      return true
    }
    return false
  }

  private _mouseLeaveEvent (): boolean {
    if (!this._dragFlag) {
      this._moveDom.style.background = ''
      this.getPane().getChart().getChartStore().setDragPaneFlag(false)
      return true
    }
    return false
  }

  protected getContainerStyle (): Partial<CSSStyleDeclaration> {
    return {
      margin: '0',
      padding: '0',
      position: 'relative',
      boxSizing: 'border-box'
    }
  }

  protected insertBefore (): boolean { return true }

  protected initDom (container: HTMLElement): void {
    this._moveDom = createDom('div', {
      width: '100%',
      height: `${REAL_SEPARATOR_HEIGHT}px`,
      margin: '0',
      padding: '0',
      position: 'absolute',
      top: '-3px',
      zIndex: '20',
      boxSizing: 'border-box',
      cursor: 'ns-resize'
    })
    container.appendChild(this._moveDom)
  }

  protected updateImp (level: UpdateLevel, container: HTMLElement, bounding: Bounding): void {
    if (level === UpdateLevel.ALL || level === UpdateLevel.SEPARATOR) {
      const styles = this.getPane().getChart().getStyles().separator
      this._moveDom.style.top = `${-Math.floor((REAL_SEPARATOR_HEIGHT - styles.size) / 2)}px`
      this._moveDom.style.height = `${REAL_SEPARATOR_HEIGHT}px`
      const fill = styles.fill
      container.style.backgroundColor = styles.color
      container.style.height = `${styles.size}px`
      container.style.marginLeft = `${fill ? 0 : bounding.left}px`
      container.style.width = fill ? '100%' : `${bounding.width}px`
    }
  }

  getImage (): HTMLCanvasElement {
    const styles = this.getPane().getChart().getStyles().separator
    const width = this.getContainer().offsetWidth
    const height = styles.size
    const canvas = createDom('canvas', {
      width: `${width}px`,
      height: `${height}px`,
      boxSizing: 'border-box'
    })
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const pixelRatio = getPixelRatio(canvas)
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)
    ctx.fillStyle = styles.color
    ctx.fillRect(this.getBounding().left, 0, width, height)
    return canvas
  }
}
