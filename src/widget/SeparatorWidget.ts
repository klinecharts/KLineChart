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

import Axis from '../componentl/Axis'
import YAxis from '../componentl/YAxis'

import Widget from './Widget'
import Pane from '../pane/Pane'

import MouseTouchEventHandler, { MouseTouchEvent } from '../common/MouseTouchEventHandler'

import { createDom } from '../common/utils/dom'

export default class SeparatorWidget extends Widget<YAxis> {
  private _moveDom: HTMLElement

  private readonly _event: MouseTouchEventHandler

  private _dragFlag = false
  private _dragStartY = 0

  private _topPaneHeight = 0
  private _currentPaneHeight = 0

  constructor (rootContainer: HTMLElement, pane: Pane<YAxis>) {
    super(rootContainer, pane)
    this._event = new MouseTouchEventHandler(
      this._moveDom,
      {
        mouseDownEvent: this._mouseDownEvent.bind(this),
        touchStartEvent: this._mouseDownEvent.bind(this),
        pressedMouseMoveEvent: this._pressedMouseMoveEvent.bind(this),
        touchMoveEvent: this._pressedMouseMoveEvent.bind(this),
        mouseUpEvent: this._mouseUpEvent.bind(this),
        touchEndEvent: this._mouseUpEvent.bind(this),
        mouseEnterEvent: this._mouseEnterEvent.bind(this),
        mouseLeaveEvent: this._mouseLeaveEvent.bind(this)
      },
      {
        treatVertTouchDragAsPageScroll: () => false,
        treatHorzTouchDragAsPageScroll: () => true
      }
    )
  }

  private _mouseDownEvent (event: MouseTouchEvent): void {
    this._dragFlag = true
    this._dragStartY = event.pageY
    const pane = this.getPane()
    this._topPaneHeight = pane.getTopPane()?.getBounding().height ?? 0
    this._currentPaneHeight = pane.getBounding().height
  }

  private _mouseUpEvent (): void {
    this._dragFlag = false
    // this.getPane().getChart().getChartStore().setDragPaneFlag(false)
  }

  private _pressedMouseMoveEvent (event: MouseTouchEvent): void {
    // event.preventDefault()
    const dragDistance = event.pageY - this._dragStartY
    const currentPane = this.getPane()
    const topPane = currentPane.getTopPane()
    const isUpDrag = dragDistance > 0
    if (topPane !== null) {
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
        chart.getChartStore().getCrosshairStore().set({}, true)
        chart.adjustPaneViewport(false, true, true, true, true)
      }
    }
  }

  private _mouseEnterEvent (): void {
    const separatorOptions = this.getPane().getChart().getChartStore().getStyleOptions().separator
    this._moveDom.style.background = separatorOptions.activeBackgroundColor
    // this._chartStore.setDragPaneFlag(true)
    this.getPane().getChart().getChartStore().getCrosshairStore().set()
  }

  private _mouseLeaveEvent (): void {
    if (!this._dragFlag) {
      this._moveDom.style.background = ''
      // this._chartStore.setDragPaneFlag(false)
    }
  }

  protected getContainerStyle (): Partial<CSSStyleDeclaration> {
    return {
      margin: '0',
      padding: '0',
      position: 'relative',
      boxSizing: 'border-box'
    }
  }

  protected initDom (container: HTMLElement): void {
    this._moveDom = createDom('div', {
      width: '100%',
      height: '7px',
      margin: '0',
      padding: '0',
      position: 'absolute',
      top: '-3px',
      zIndex: '20',
      boxSizing: 'border-box'
    })
    container.appendChild(this._moveDom)
  }

  protected updateImp (level: UpdateLevel, container: HTMLElement, bounding: Required<Bounding>): void {
    if (level === UpdateLevel.ALL || level === UpdateLevel.SEPARATOR) {
      const separatorStyles = this.getPane().getChart().getChartStore().getStyleOptions().separator
      this._moveDom.style.top = `${-Math.floor((7 - separatorStyles.size) / 2)}px`
      const fill = separatorStyles.fill
      container.style.backgroundColor = separatorStyles.color
      container.style.height = `${separatorStyles.size}px`
      container.style.marginLeft = `${fill ? 0 : bounding.left}px`
      container.style.width = fill ? '100%' : `${bounding.width}px`
    }
  }
}
