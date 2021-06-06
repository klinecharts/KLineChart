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

import EventHandler, { isMouse } from './EventHandler'
import { CANDLE_PANE_ID, InvalidateLevel } from '../data/constants'
import { GraphicMarkMouseOperateElement } from '../base/overlay/mark/GraphicMark'

export default class OverlayEventHandler extends EventHandler {
  constructor (chartData) {
    super(chartData)
    this._pressedGraphicMark = null
  }

  /**
   * 处理覆盖物鼠标hover事件
   * @param overlays
   * @param preHoverOperate
   * @param coordinate
   * @param event
   * @return {*}
   * @private
   */
  _performOverlayMouseHover (overlays, preHoverOperate, coordinate, event) {
    let hoverOperate
    for (const overlay of overlays) {
      hoverOperate = overlay.checkMousePointOnGraphic(coordinate)
      if (hoverOperate) {
        break
      }
    }
    if (!hoverOperate || preHoverOperate.id !== hoverOperate.id) {
      if (preHoverOperate.id && preHoverOperate.instance && isMouse(event)) {
        preHoverOperate.instance.onMouseLeave({
          id: preHoverOperate.id,
          points: preHoverOperate.instance.points(),
          event
        })
      }
      if (hoverOperate && hoverOperate.id !== preHoverOperate.id && hoverOperate.instance && isMouse(event)) {
        hoverOperate.instance.onMouseEnter({
          id: hoverOperate.id,
          points: hoverOperate.instance.points(),
          event
        })
      }
    }
    return hoverOperate
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
    if (!this._checkEventPointX(event.localX) || !this._checkEventPointY(event.localY) || this._waitingForMouseMoveAnimationFrame) {
      return
    }
    this._waitingForMouseMoveAnimationFrame = true
    const coordinate = { x: event.localX, y: event.localY }
    const graphicMarks = this._chartData.graphicMarks()
    const visibleAnnotations = this._chartData.visibleAnnotations()
    const lastGraphicMark = graphicMarks[graphicMarks.length - 1]
    const preGraphicMarkHoverOperate = this._chartData.graphicMarkMouseOperate().hover
    const preAnnotationHoverOperate = this._chartData.annotationMouseOperate()
    let graphicMarkHoverOperate
    let graphicMarkClickOperate
    let annotationHoverOperate
    if (lastGraphicMark && lastGraphicMark.isDrawing()) {
      lastGraphicMark.mouseMoveForDrawing(coordinate)
      graphicMarkHoverOperate = lastGraphicMark.checkMousePointOnGraphic(coordinate)
      graphicMarkClickOperate = {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      }
    } else {
      graphicMarkHoverOperate = this._performOverlayMouseHover(graphicMarks, preGraphicMarkHoverOperate, coordinate, event)
      annotationHoverOperate = this._performOverlayMouseHover(visibleAnnotations, preAnnotationHoverOperate, coordinate, event)
    }
    this._chartData.setOverlayMouseOperate({
      hover: graphicMarkHoverOperate || {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      },
      click: graphicMarkClickOperate
    }, annotationHoverOperate || { id: '' })
    this._waitingForMouseMoveAnimationFrame = false
  }

  /**
   * 鼠标按下事件
   * @param event
   */
  mouseDownEvent (event) {
    if (!this._checkEventPointX(event.localX) || !this._checkEventPointY(event.localY)) {
      return
    }
    const coordinate = { x: event.localX, y: event.localY }
    const graphicMarks = this._chartData.graphicMarks()
    const lastGraphicMark = graphicMarks[graphicMarks.length - 1]
    let graphicMarkHoverOperate = {
      id: '',
      element: GraphicMarkMouseOperateElement.NONE,
      elementIndex: -1
    }
    let graphicMarkClickOperate
    if (lastGraphicMark && lastGraphicMark.isDrawing()) {
      lastGraphicMark.mouseLeftButtonDownForDrawing(coordinate)
      graphicMarkClickOperate = lastGraphicMark.checkMousePointOnGraphic(coordinate)
    } else {
      for (const graphicMark of graphicMarks) {
        graphicMarkClickOperate = graphicMark.checkMousePointOnGraphic(coordinate)
        if (graphicMarkClickOperate) {
          if (graphicMarkClickOperate.element === GraphicMarkMouseOperateElement.POINT) {
            this._pressedGraphicMark = graphicMark
            this._chartData.setDragGraphicMarkFlag(true)
            graphicMarkHoverOperate = {
              ...graphicMarkClickOperate
            }
          }
          graphicMark.onClick({
            id: graphicMarkClickOperate.id,
            points: graphicMark.points(),
            event
          })
          break
        }
      }
      const visibleAnnotations = this._chartData.visibleAnnotations()
      for (const annotation of visibleAnnotations) {
        const annotationOperate = annotation.checkMousePointOnGraphic(coordinate)
        if (annotationOperate) {
          annotation.onClick({
            id: annotationOperate.id,
            points: annotation.points(),
            event
          })
          break
        }
      }
    }
    this._chartData.setOverlayMouseOperate({
      hover: graphicMarkHoverOperate,
      click: graphicMarkClickOperate || {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      }
    })
  }

  mouseRightDownEvent (event) {
    const graphicMark = this._chartData.graphicMarks().find(gm => gm.checkMousePointOnGraphic({ x: event.localX, y: event.localY }))
    if (graphicMark && !graphicMark.onRightClick({ id: graphicMark.id(), points: graphicMark.points(), event })) {
      this._chartData.removeGraphicMarkInstance(graphicMark.id())
    }
    const annotation = this._chartData.visibleAnnotations().find(an => an.checkMousePointOnGraphic({ x: event.localX, y: event.localY }))
    if (annotation) {
      annotation.onRightClick({ id: annotation.id(), points: annotation.points(), event })
    }
  }

  pressedMouseMoveEvent (event) {
    const graphicMarks = this._chartData.graphicMarks()
    const lastGraphicMark = graphicMarks[graphicMarks.length - 1]
    if ((!lastGraphicMark || !lastGraphicMark.isDrawing()) && this._pressedGraphicMark) {
      this._pressedGraphicMark.mousePressedMove({ x: event.localX, y: event.localY }, event)
      this._chartData.invalidate(InvalidateLevel.OVERLAY)
    }
  }

  _checkEventPointY (y) {
    const size = this._paneContentSize[CANDLE_PANE_ID]
    return y > size.contentTop && y < size.contentBottom
  }
}
