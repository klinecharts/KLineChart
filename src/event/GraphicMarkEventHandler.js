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

import { CANDLE_STICK_PANE_ID } from '../pane/ChartPane'
import EventHandler from './EventHandler'
import { InvalidateLevel } from '../data/ChartData'
import { HoverType } from '../mark/GraphicMark'

export default class GraphicMarkEventHandler extends EventHandler {
  constructor (chartData) {
    super(chartData)
    this._pressedGraphicMark = null
  }

  /**
   * 鼠标抬起事件
   * @param event
   */
  mouseUpEvent (event) {
    if (this._pressedGraphicMark) {
      this._pressedGraphicMark = null
      this._chartData.setDragGraphicMarkFlag(false)
    }
  }

  mouseMoveEvent (event) {
    if (!this._checkEventPointX(event.localX) || !this._checkEventPointY(event.localY)) {
      return
    }
    const point = { x: event.localX, y: event.localY }
    if (!this._waitingForMouseMoveAnimationFrame) {
      this._waitingForMouseMoveAnimationFrame = true
      const graphicMarks = this._chartData.graphicMarks()
      const lastGraphicMark = graphicMarks.last()
      if (lastGraphicMark && lastGraphicMark.isDrawing()) {
        lastGraphicMark.mouseMoveForDrawing(point)
        lastGraphicMark.checkMousePointOnGraphic(point)
      } else {
        let isHover = false
        graphicMarks.forEach(graphicMark => {
          graphicMark.resetHoverParams()
          if (!isHover) {
            isHover = graphicMark.checkMousePointOnGraphic(point)
          }
        })
      }
      this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK)
      this._waitingForMouseMoveAnimationFrame = false
    }
  }

  /**
   * 鼠标按下事件
   * @param event
   */
  mouseDownEvent (event) {
    if (!this._checkEventPointX(event.localX) || !this._checkEventPointY(event.localY)) {
      return
    }
    const point = { x: event.localX, y: event.localY }
    const graphicMarks = this._chartData.graphicMarks()
    const lastGraphicMark = graphicMarks[graphicMarks.length - 1]
    if (lastGraphicMark && lastGraphicMark.isDrawing()) {
      lastGraphicMark.mouseLeftButtonDownForDrawing(point)
      this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK)
    } else {
      for (let i = 0; i < graphicMarks.length; i++) {
        if (graphicMarks[i].checkMousePointOnGraphic(point) && graphicMarks[i].hoverType() === HoverType.POINT) {
          this._pressedGraphicMark = graphicMarks[i]
          this._chartData.setDragGraphicMarkFlag(true)
          this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK)
          return
        }
      }
    }
  }

  mouseRightDownEvent (event) {
    const point = { x: event.localX, y: event.localY }
    const graphicMarks = this._chartData.graphicMarks()
    for (let i = 0; i < graphicMarks.length; i++) {
      if (graphicMarks[i].checkMousePointOnGraphic(point)) {
        graphicMarks.splice(i, 1)
        this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK)
        return
      }
    }
  }

  pressedMouseMoveEvent (event) {
    const graphicMarks = this._chartData.graphicMarks()
    const lastGraphicMark = graphicMarks.last()
    if ((!lastGraphicMark || !lastGraphicMark.isDrawing()) && this._pressedGraphicMark) {
      this._pressedGraphicMark.mousePressedMove({ x: event.localX, y: event.localY })
      this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK)
    }
  }

  _checkEventPointY (y) {
    const size = this._paneContentSize[CANDLE_STICK_PANE_ID]
    return y > size.contentTop && y < size.contentBottom
  }
}
