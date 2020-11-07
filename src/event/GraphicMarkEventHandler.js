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

import { CANDLE_STICK_PANE_TAG } from '../pane/ChartPane'
import EventHandler from './EventHandler'
import { NONE } from '../mark/defaultGraphicMarkType'
import { InvalidateLevel } from '../data/ChartData'
import { MousePointOnGraphicType } from '../mark/GraphicMark'

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
      const graphicMarkType = this._chartData.graphicMarkType()
      const graphicMarks = this._chartData.graphicMarks()
      if (graphicMarkType === NONE) {
        let isActive = false
        for (const key in graphicMarks) {
          graphicMarks[key].forEach(graphicMark => {
            graphicMark.resetMousePointOnGraphicParams()
            if (!isActive) {
              isActive = graphicMark.checkMousePointOnGraphic(point)
            }
          })
        }
      } else {
        const graphicMarkArray = graphicMarks[graphicMarkType]
        const graphicMark = graphicMarkArray[graphicMarkArray.length - 1]
        graphicMark.mouseMoveForDrawing(point)
        graphicMark.checkMousePointOnGraphic(point)
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
    const graphicMarkType = this._chartData.graphicMarkType()
    const graphicMarks = this._chartData.graphicMarks()
    if (graphicMarkType === NONE) {
      for (const key in graphicMarks) {
        const graphicMarkArray = graphicMarks[key]
        for (let i = 0; i < graphicMarkArray.length; i++) {
          if (graphicMarkArray[i].checkMousePointOnGraphic(point) && graphicMarkArray[i].mousePointOnGraphicType() === MousePointOnGraphicType.POINT) {
            this._pressedGraphicMark = graphicMarkArray[i]
            this._chartData.setDragGraphicMarkFlag(true)
            this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK)
            return
          }
        }
      }
    } else {
      const graphicMarkArray = graphicMarks[graphicMarkType]
      graphicMarkArray[graphicMarkArray.length - 1].mouseLeftButtonDownForDrawing(point)
      this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK)
    }
  }

  mouseRightDownEvent (event) {
    const point = { x: event.localX, y: event.localY }
    const graphicMarks = this._chartData.graphicMarks()
    for (const key in graphicMarks) {
      const graphicMarkArray = graphicMarks[key]
      for (let i = 0; i < graphicMarkArray.length; i++) {
        if (graphicMarkArray[i].checkMousePointOnGraphic(point)) {
          graphicMarks[key].splice(i, 1)
          if (graphicMarks[key].length === 0) {
            delete graphicMarks[key]
          }
          this._chartData.setGraphicMarkType(NONE)
          this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK)
          return
        }
      }
    }
  }

  pressedMouseMoveEvent (event) {
    const graphicMarkType = this._chartData.graphicMarkType()
    if (graphicMarkType === NONE && this._pressedGraphicMark) {
      this._pressedGraphicMark.mousePressedMove({ x: event.localX, y: event.localY })
      this._chartData.invalidate(InvalidateLevel.GRAPHIC_MARK)
    }
  }

  _checkEventPointY (y) {
    const size = this._paneContentSize[CANDLE_STICK_PANE_TAG]
    return y > size.contentTop && y < size.contentBottom
  }
}
