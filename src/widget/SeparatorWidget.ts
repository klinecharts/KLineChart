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

import type Bounding from '../common/Bounding'
import { UpdateLevel } from '../common/Updater'
import type { MouseTouchEvent } from '../common/EventHandler'
import { createDom } from '../common/utils/dom'
import { throttle } from '../common/utils/performance'
import type Nullable from '../common/Nullable'
import { isValid } from '../common/utils/typeChecks'

import Widget from './Widget'
import { WidgetNameConstants, REAL_SEPARATOR_HEIGHT } from './types'

import type SeparatorPane from '../pane/SeparatorPane'
import type DrawPane from '../pane/DrawPane'

export default class SeparatorWidget extends Widget<SeparatorPane> {
  private _dragFlag = false
  private _dragStartY = 0

  private _topPaneHeight = 0
  private _bottomPaneHeight = 0

  private _topPane: Nullable<DrawPane> = null
  private _bottomPane: Nullable<DrawPane> = null

  constructor (rootContainer: HTMLElement, pane: SeparatorPane) {
    super(rootContainer, pane)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
    this.registerEvent('touchStartEvent', this._mouseDownEvent.bind(this))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
      .registerEvent('touchMoveEvent', this._pressedMouseMoveEvent.bind(this))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
      .registerEvent('touchEndEvent', this._mouseUpEvent.bind(this))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
      .registerEvent('mouseDownEvent', this._mouseDownEvent.bind(this))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
      .registerEvent('mouseUpEvent', this._mouseUpEvent.bind(this))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
      .registerEvent('pressedMouseMoveEvent', this._pressedMouseMoveEvent.bind(this))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
      .registerEvent('mouseEnterEvent', this._mouseEnterEvent.bind(this))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ignore
      .registerEvent('mouseLeaveEvent', this._mouseLeaveEvent.bind(this))
  }

  override getName (): string {
    return WidgetNameConstants.SEPARATOR
  }

  private _mouseDownEvent (event: MouseTouchEvent): boolean {
    this._dragFlag = true
    this._dragStartY = event.pageY
    const pane = this.getPane()
    const chart = pane.getChart()
    this._topPane = pane.getTopPane()
    this._bottomPane = pane.getBottomPane()
    const drawPanes = chart.getDrawPanes()
    if (this._topPane.getOptions().state === 'minimize') {
      const index = drawPanes.findIndex(pane => pane.getId() === this._topPane?.getId())
      for (let i = index - 1; i > -1; i--) {
        const pane = drawPanes[i]
        if (pane.getOptions().state !== 'minimize') {
          this._topPane = pane
          break
        }
      }
    }
    if (this._bottomPane.getOptions().state === 'minimize') {
      const index = drawPanes.findIndex(pane => pane.getId() === this._bottomPane?.getId())
      for (let i = index + 1; i < drawPanes.length; i++) {
        const pane = drawPanes[i]
        if (pane.getOptions().state !== 'minimize') {
          this._bottomPane = pane
          break
        }
      }
    }
    this._topPaneHeight = this._topPane.getBounding().height
    this._bottomPaneHeight = this._bottomPane.getBounding().height
    return true
  }

  private _mouseUpEvent (): boolean {
    this._dragFlag = false
    this._topPane = null
    this._bottomPane = null
    this._topPaneHeight = 0
    this._bottomPaneHeight = 0
    return this._mouseLeaveEvent()
  }

  // eslint-disable-next-line @typescript-eslint/unbound-method -- ignore
  private readonly _pressedMouseMoveEvent = throttle(this._pressedTouchMouseMoveEvent, 20)

  private _pressedTouchMouseMoveEvent (event: MouseTouchEvent): boolean {
    const dragDistance = event.pageY - this._dragStartY

    const isUpDrag = dragDistance < 0
    if (isValid(this._topPane) && isValid(this._bottomPane)) {
      const bottomPaneOptions = this._bottomPane.getOptions()
      if (
        this._topPane.getOptions().state !== 'minimize' &&
        bottomPaneOptions.state !== 'minimize' &&
        bottomPaneOptions.dragEnabled
      ) {
        let reducedPane: Nullable<DrawPane> = null
        let increasedPane: Nullable<DrawPane> = null
        let startDragReducedPaneHeight = 0
        let startDragIncreasedPaneHeight = 0
        if (isUpDrag) {
          reducedPane = this._topPane
          increasedPane = this._bottomPane
          startDragReducedPaneHeight = this._topPaneHeight
          startDragIncreasedPaneHeight = this._bottomPaneHeight
        } else {
          reducedPane = this._bottomPane
          increasedPane = this._topPane
          startDragReducedPaneHeight = this._bottomPaneHeight
          startDragIncreasedPaneHeight = this._topPaneHeight
        }
        const reducedPaneMinHeight = reducedPane.getOptions().minHeight
        if (startDragReducedPaneHeight > reducedPaneMinHeight) {
          const reducedPaneHeight = Math.max(startDragReducedPaneHeight - Math.abs(dragDistance), reducedPaneMinHeight)
          const diffHeight = startDragReducedPaneHeight - reducedPaneHeight
          reducedPane.setBounding({ height: reducedPaneHeight })
          increasedPane.setBounding({ height: startDragIncreasedPaneHeight + diffHeight })
          const currentPane = this.getPane()
          const chart = currentPane.getChart()
          chart.getChartStore().executeAction('onPaneDrag', { paneId: currentPane.getId() })
          chart.layout({
            measureHeight: true,
            measureWidth: true,
            update: true,
            buildYAxisTick: true,
            forceBuildYAxisTick: true
          })
        }
      }
    }

    return true
  }

  private _mouseEnterEvent (): boolean {
    const pane = this.getPane()
    const bottomPane = pane.getBottomPane()
    if (bottomPane.getOptions().dragEnabled) {
      const chart = pane.getChart()
      const styles = chart.getStyles().separator
      this.getContainer().style.background = styles.activeBackgroundColor
      return true
    }
    return false
  }

  private _mouseLeaveEvent (): boolean {
    if (!this._dragFlag) {
      this.getContainer().style.background = 'transparent'
      return true
    }
    return false
  }

  override createContainer (): HTMLElement {
    return createDom('div', {
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
  }

  override updateImp (container: HTMLElement, _bounding: Bounding, level: UpdateLevel): void {
    if (level === UpdateLevel.All || level === UpdateLevel.Separator) {
      const styles = this.getPane().getChart().getStyles().separator
      container.style.top = `${-Math.floor((REAL_SEPARATOR_HEIGHT - styles.size) / 2)}px`
      container.style.height = `${REAL_SEPARATOR_HEIGHT}px`
    }
  }
}
