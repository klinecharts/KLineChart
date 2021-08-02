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
import { ShapeMouseOperateElement } from '../component/overlay/Shape'

export default class OverlayEventHandler extends EventHandler {
  constructor (chartData) {
    super(chartData)
    this._pressedShape = null
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
    if (this._pressedShape) {
      this._pressedShape = null
      this._chartData.shapeStore().setDragFlag(false)
    }
  }

  mouseMoveEvent (event) {
    if (this._waitingForMouseMove) {
      return
    }
    this._waitingForMouseMove = true
    const coordinate = { x: event.localX, y: event.paneY }
    const annotations = this._chartData.annotationStore().get(event.paneId)
    const shapes = this._chartData.shapeStore().instances()
    const lastShape = shapes[shapes.length - 1]
    const prevShapeHoverOperate = this._chartData.shapeStore().mouseOperate().hover
    const prevAnnotationHoverOperate = this._chartData.annotationStore().mouseOperate()
    let shapeHoverOperate
    let shapeClickOperate
    let annotationHoverOperate
    if (lastShape && lastShape.isDrawing()) {
      lastShape.mouseMoveForDrawing(coordinate)
      shapeHoverOperate = lastShape.checkEventCoordinateOn(coordinate)
      shapeClickOperate = {
        id: '',
        element: ShapeMouseOperateElement.NONE,
        elementIndex: -1
      }
    } else {
      shapeHoverOperate = this._performOverlayMouseHover(shapes, prevShapeHoverOperate, coordinate, event)
      annotationHoverOperate = this._performOverlayMouseHover(annotations, prevAnnotationHoverOperate, coordinate, event)
    }
    const shapeOperateValid = this._chartData.shapeStore().setMouseOperate({
      hover: shapeHoverOperate || {
        id: '',
        element: ShapeMouseOperateElement.NONE,
        elementIndex: -1
      },
      click: shapeClickOperate
    })
    const annotationOperateValid = this._chartData.annotationStore().setMouseOperate(annotationHoverOperate || { id: '' })
    if (shapeOperateValid || annotationOperateValid || lastShape.isDrawing()) {
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
    const shapes = this._chartData.shapeStore().instances()
    const lastShape = shapes[shapes.length - 1]
    let shapeHoverOperate = {
      id: '',
      element: ShapeMouseOperateElement.NONE,
      elementIndex: -1
    }
    let shapeClickOperate
    if (lastShape && lastShape.isDrawing()) {
      lastShape.mouseLeftButtonDownForDrawing(coordinate)
      shapeClickOperate = lastShape.checkEventCoordinateOn(coordinate)
    } else {
      for (const shape of shapes) {
        shapeClickOperate = shape.checkEventCoordinateOn(coordinate)
        if (shapeClickOperate) {
          this._chartData.shapeStore().setDragFlag(true)
          this._pressedShape = { instance: shape, element: shapeClickOperate.element }
          if (shapeClickOperate.element === ShapeMouseOperateElement.POINT) {
            shapeHoverOperate = {
              ...shapeClickOperate
            }
          } else {
            shape.startPressedOtherMove(coordinate)
          }
          shape.onClick({
            id: shapeClickOperate.id,
            points: shape.points(),
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
    const shapeOperateValid = this._chartData.shapeStore().setMouseOperate({
      hover: shapeHoverOperate,
      click: shapeClickOperate || {
        id: '',
        element: ShapeMouseOperateElement.NONE,
        elementIndex: -1
      }
    })
    if (shapeOperateValid) {
      this._chartData.invalidate(InvalidateLevel.OVERLAY)
    }
  }

  mouseRightDownEvent (event) {
    if (event.paneId === CANDLE_PANE_ID) {
      const shapes = this._chartData.shapeStore().instances()
      if (shapes) {
        const shape = shapes.find(gm => gm.checkEventCoordinateOn({ x: event.localX, y: event.paneY }))
        if (shape && !shape.onRightClick({ id: shape.id(), points: shape.points(), event })) {
          this._chartData.shapeStore().removeInstance(shape.id())
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
    if (!this._chartData.shapeStore().isDrawing() && this._pressedShape) {
      const coordinate = { x: event.localX, y: event.paneY }
      if (this._pressedShape.element === ShapeMouseOperateElement.POINT) {
        this._pressedShape.instance.mousePressedPointMove(coordinate, event)
      } else {
        this._pressedShape.instance.mousePressedOtherMove(coordinate)
      }
      this._chartData.invalidate(InvalidateLevel.OVERLAY)
    }
  }
}
