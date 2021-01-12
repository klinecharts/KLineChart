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

import { CANDLE_PANE_ID } from '../pane/ChartPane'
import EventHandler from './EventHandler'
import { GraphicMarkMouseOperateElement, InvalidateLevel, RemoveGraphicMarkType } from '../data/ChartData'

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
      const lastGraphicMark = graphicMarks[graphicMarks.length - 1]
      let graphicMarkHoverOperate
      let graphicMarkClickOperate
      if (lastGraphicMark && lastGraphicMark.isDrawing()) {
        lastGraphicMark.mouseMoveForDrawing(point)
        graphicMarkHoverOperate = lastGraphicMark.checkMousePointOnGraphic(point)
        graphicMarkClickOperate = {
          id: '',
          element: GraphicMarkMouseOperateElement.NONE,
          elementIndex: -1
        }
      } else {
        for (const graphicMark of graphicMarks) {
          graphicMarkHoverOperate = graphicMark.checkMousePointOnGraphic(point)
          if (graphicMarkHoverOperate) {
            break
          }
        }
      }
      this._chartData.setGraphicMarkMouseOperate(graphicMarkHoverOperate || {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      }, graphicMarkClickOperate)
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
    let graphicMarkClickOperate
    if (lastGraphicMark && lastGraphicMark.isDrawing()) {
      lastGraphicMark.mouseLeftButtonDownForDrawing(point)
      graphicMarkClickOperate = lastGraphicMark.checkMousePointOnGraphic(point)
    } else {
      for (let i = 0; i < graphicMarks.length; i++) {
        graphicMarkClickOperate = graphicMarks[i].checkMousePointOnGraphic(point)
        if (graphicMarkClickOperate) {
          if (graphicMarkClickOperate.element === GraphicMarkMouseOperateElement.POINT) {
            this._pressedGraphicMark = graphicMarks[i]
            this._chartData.setDragGraphicMarkFlag(true)
          }
          break
        }
      }
    }
    this._chartData.setGraphicMarkMouseOperate(
      {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      },
      graphicMarkClickOperate || {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      }
    )
  }

  mouseRightDownEvent () {
    this._chartData.removeGraphicMarkInstance({ type: RemoveGraphicMarkType.ACTIVE })
  }

  pressedMouseMoveEvent (event) {
    const graphicMarks = this._chartData.graphicMarks()
    const lastGraphicMark = graphicMarks[graphicMarks.length - 1]
    if ((!lastGraphicMark || !lastGraphicMark.isDrawing()) && this._pressedGraphicMark) {
      this._pressedGraphicMark.mousePressedMove({ x: event.localX, y: event.localY })
      this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK)
    }
  }

  _checkEventPointY (y) {
    const size = this._paneContentSize[CANDLE_PANE_ID]
    return y > size.contentTop && y < size.contentBottom
  }
}
