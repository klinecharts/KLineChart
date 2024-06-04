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
import { type MouseTouchEvent } from '../common/SyntheticEvent'
import { ActionType } from '../common/Action'
import { createDom } from '../common/utils/dom'
import { throttle } from '../common/utils/performance'

import Widget from './Widget'
import { WidgetNameConstants, REAL_SEPARATOR_HEIGHT } from './types'

import type SeparatorPane from '../pane/SeparatorPane'

import type AxisPane from '../pane/DrawPane'

export default class SeparatorWidget extends Widget<SeparatorPane> {
  private _dragFlag = false
  private _dragStartY = 0

  private _topPaneHeight = 0
  private _bottomPaneHeight = 0

  constructor (rootContainer: HTMLElement, pane: SeparatorPane) {
    super(rootContainer, pane)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.registerEvent('touchStartEvent', this._mouseDownEvent.bind(this))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .registerEvent('touchMoveEvent', this._pressedMouseMoveEvent.bind(this))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .registerEvent('touchEndEvent', this._mouseUpEvent.bind(this))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .registerEvent('mouseDownEvent', this._mouseDownEvent.bind(this))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .registerEvent('mouseUpEvent', this._mouseUpEvent.bind(this))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .registerEvent('pressedMouseMoveEvent', this._pressedMouseMoveEvent.bind(this))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .registerEvent('mouseEnterEvent', this._mouseEnterEvent.bind(this))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .registerEvent('mouseLeaveEvent', this._mouseLeaveEvent.bind(this))
  }

  override getName (): string {
    return WidgetNameConstants.SEPARATOR
  }

  override checkEventOn (): boolean {
    return true
  }

  private _mouseDownEvent (event: MouseTouchEvent): boolean {
    this._dragFlag = true
    this._dragStartY = event.pageY
    const pane = this.getPane()
    this._topPaneHeight = pane.getTopPane().getBounding().height
    this._bottomPaneHeight = pane.getBottomPane().getBounding().height
    return true
  }

  private _mouseUpEvent (): boolean {
    this._dragFlag = false
    return this._mouseLeaveEvent()
  }

  // eslint-disable-next-line @typescript-eslint/unbound-method
  private readonly _pressedMouseMoveEvent = throttle(this._pressedTouchMouseMoveEvent, 20)

  private _pressedTouchMouseMoveEvent (event: MouseTouchEvent): boolean {
    const dragDistance = event.pageY - this._dragStartY
    const currentPane = this.getPane()
    const topPane = currentPane.getTopPane()
    const bottomPane = currentPane.getBottomPane()
    const isUpDrag = dragDistance < 0
    if (
      topPane !== null &&
      bottomPane?.getOptions().dragEnabled
    ) {
      let reducedPane: AxisPane
      let increasedPane: AxisPane
      let startDragReducedPaneHeight: number
      let startDragIncreasedPaneHeight: number
      if (isUpDrag) {
        reducedPane = topPane
        increasedPane = bottomPane
        startDragReducedPaneHeight = this._topPaneHeight
        startDragIncreasedPaneHeight = this._bottomPaneHeight
      } else {
        reducedPane = bottomPane
        increasedPane = topPane
        startDragReducedPaneHeight = this._bottomPaneHeight
        startDragIncreasedPaneHeight = this._topPaneHeight
      }
      const reducedPaneMinHeight = reducedPane.getOptions().minHeight
      if (startDragReducedPaneHeight > reducedPaneMinHeight) {
        const reducedPaneHeight = Math.max(startDragReducedPaneHeight - Math.abs(dragDistance), reducedPaneMinHeight)
        const diffHeight = startDragReducedPaneHeight - reducedPaneHeight
        reducedPane.setBounding({ height: reducedPaneHeight })
        increasedPane.setBounding({ height: startDragIncreasedPaneHeight + diffHeight })
        const chart = currentPane.getChart()
        chart.getChartStore().getActionStore().execute(ActionType.OnPaneDrag, { paneId: currentPane.getId() })
        chart.adjustPaneViewport(true, true, true, true, true)
      }
    }
    return true
  }

  private _mouseEnterEvent (): boolean {
    const pane = this.getPane()
    const bottomPane = pane.getBottomPane()
    if (bottomPane?.getOptions().dragEnabled ?? false) {
      const chart = pane.getChart()
      const styles = chart.getStyles().separator
      this.getContainer().style.background = styles.activeBackgroundColor
      return true
    }
    return false
  }

  private _mouseLeaveEvent (): boolean {
    if (!this._dragFlag) {
      this.getContainer().style.background = ''
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
