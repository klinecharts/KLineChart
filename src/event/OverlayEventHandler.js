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
import { GraphicMarkMouseOperateElement } from '../component/overlay/GraphicMark'

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
    if (overlays) {
      for (const overlay of overlays) {
        hoverOperate = overlay.checkEventCoordinateOn(coordinate)
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
    }
    return hoverOperate
  }

  /**
   * 鼠标抬起事件
   */
  mouseUpEvent () {
    if (this._pressedGraphicMark) {
      this._pressedGraphicMark = null
      this._chartData.graphicMarkStore().setDragFlag(false)
    }
  }

  mouseMoveEvent (event) {
    if (this._waitingForMouseMove) {
      return
    }
    this._waitingForMouseMove = true
    const coordinate = { x: event.localX, y: event.paneY }
    const annotations = this._chartData.annotationStore().get(event.paneId)
    const graphicMarks = this._chartData.graphicMarkStore().instances()
    const lastGraphicMark = graphicMarks[graphicMarks.length - 1]
    const preGraphicMarkHoverOperate = this._chartData.graphicMarkStore().mouseOperate().hover
    const preAnnotationHoverOperate = this._chartData.annotationStore().mouseOperate()
    let graphicMarkHoverOperate
    let graphicMarkClickOperate
    let annotationHoverOperate
    if (lastGraphicMark && lastGraphicMark.isDrawing()) {
      lastGraphicMark.mouseMoveForDrawing(coordinate)
      graphicMarkHoverOperate = lastGraphicMark.checkEventCoordinateOn(coordinate)
      graphicMarkClickOperate = {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      }
    } else {
      graphicMarkHoverOperate = this._performOverlayMouseHover(graphicMarks, preGraphicMarkHoverOperate, coordinate, event)
      annotationHoverOperate = this._performOverlayMouseHover(annotations, preAnnotationHoverOperate, coordinate, event)
    }
    const graphicMarkOperateValid = this._chartData.graphicMarkStore().setMouseOperate({
      hover: graphicMarkHoverOperate || {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      },
      click: graphicMarkClickOperate
    })
    const annotationOperateValid = this._chartData.annotationStore().setMouseOperate(annotationHoverOperate || { id: '' })
    if (graphicMarkOperateValid || annotationOperateValid || lastGraphicMark.isDrawing()) {
      this._chartData.invalidate(InvalidateLevel.OVERLAY)
    }
    this._waitingForMouseMove = false
  }

  /**
   * 鼠标按下事件
   * @param event
   */
  mouseDownEvent (event) {
    const coordinate = { x: event.localX, y: event.paneY }
    const graphicMarks = this._chartData.graphicMarkStore().instances()
    const lastGraphicMark = graphicMarks[graphicMarks.length - 1]
    let graphicMarkHoverOperate = {
      id: '',
      element: GraphicMarkMouseOperateElement.NONE,
      elementIndex: -1
    }
    let graphicMarkClickOperate
    if (lastGraphicMark && lastGraphicMark.isDrawing()) {
      lastGraphicMark.mouseLeftButtonDownForDrawing(coordinate)
      graphicMarkClickOperate = lastGraphicMark.checkEventCoordinateOn(coordinate)
    } else {
      for (const graphicMark of graphicMarks) {
        graphicMarkClickOperate = graphicMark.checkEventCoordinateOn(coordinate)
        if (graphicMarkClickOperate) {
          this._chartData.graphicMarkStore().setDragFlag(true)
          this._pressedGraphicMark = { instance: graphicMark, element: graphicMarkClickOperate.element }
          if (graphicMarkClickOperate.element === GraphicMarkMouseOperateElement.POINT) {
            graphicMarkHoverOperate = {
              ...graphicMarkClickOperate
            }
          } else {
            graphicMark.startPressedOtherMove(coordinate)
          }
          graphicMark.onClick({
            id: graphicMarkClickOperate.id,
            points: graphicMark.points(),
            event
          })
          break
        }
      }
      const visibleAnnotations = this._chartData.annotationStore().get(event.paneId)
      if (visibleAnnotations) {
        for (const an of visibleAnnotations) {
          const annotationOperate = an.checkEventCoordinateOn(coordinate)
          if (annotationOperate) {
            an.onClick({
              id: annotationOperate.id,
              points: an.points(),
              event
            })
            break
          }
        }
      }
    }
    const graphicMarkOperateValid = this._chartData.graphicMarkStore().setMouseOperate({
      hover: graphicMarkHoverOperate,
      click: graphicMarkClickOperate || {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      }
    })
    if (graphicMarkOperateValid) {
      this._chartData.invalidate(InvalidateLevel.OVERLAY)
    }
  }

  mouseRightDownEvent (event) {
    if (event.paneId === CANDLE_PANE_ID) {
      const graphicMarks = this._chartData.graphicMarkStore().instances()
      if (graphicMarks) {
        const graphicMark = graphicMarks.find(gm => gm.checkEventCoordinateOn({ x: event.localX, y: event.paneY }))
        if (graphicMark && !graphicMark.onRightClick({ id: graphicMark.id(), points: graphicMark.points(), event })) {
          this._chartData.graphicMarkStore().removeInstance(graphicMark.id())
        }
      }
    }
    const visibleAnnotations = this._chartData.annotationStore().get(event.paneId)
    if (visibleAnnotations) {
      const annotation = visibleAnnotations.get(event.paneId).find(an => an.checkEventCoordinateOn({ x: event.localX, y: event.paneY }))
      if (annotation) {
        annotation.onRightClick({ id: annotation.id(), points: annotation.points(), event })
      }
    }
  }

  pressedMouseMoveEvent (event) {
    if (!this._chartData.graphicMarkStore().isDrawing() && this._pressedGraphicMark) {
      const coordinate = { x: event.localX, y: event.paneY }
      if (this._pressedGraphicMark.element === GraphicMarkMouseOperateElement.POINT) {
        this._pressedGraphicMark.instance.mousePressedPointMove(coordinate, event)
      } else {
        this._pressedGraphicMark.instance.mousePressedOtherMove(coordinate)
      }
      this._chartData.invalidate(InvalidateLevel.OVERLAY)
    }
  }
}
