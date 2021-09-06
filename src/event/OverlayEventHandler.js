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
import { InvalidateLevel } from '../data/constants'
import { ShapeMouseOperateElement } from '../component/overlay/Shape'

export default class OverlayEventHandler extends EventHandler {
  constructor (chartData, yAxis) {
    super(chartData)
    this._yAxis = yAxis
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
    this._chartData.shapeStore().updatePressedInstance()
  }

  mouseMoveEvent (event) {
    if (this._waitingForMouseMove) {
      return false
    }
    this._waitingForMouseMove = true
    const coordinate = { x: event.localX, y: event.paneY }
    const { paneId, instance } = this._chartData.shapeStore().progressInstance()
    let shapeHoverOperate
    let shapeClickOperate
    let annotationHoverOperate
    if (instance && instance.isDrawing()) {
      if (event.paneId) {
        if (instance.isStart()) {
          this._chartData.shapeStore().updateProgressInstance(this._yAxis(event.paneId), event.paneId)
        }
        if (paneId === event.paneId) {
          instance.mouseMoveForDrawing(coordinate, event)
        }
        shapeHoverOperate = instance.checkEventCoordinateOn(coordinate)
      }
      shapeClickOperate = {
        id: '',
        element: ShapeMouseOperateElement.NONE,
        elementIndex: -1
      }
    } else {
      const annotations = this._chartData.annotationStore().get(event.paneId)
      const shapes = this._chartData.shapeStore().instances(event.paneId)
      const prevShapeHoverOperate = this._chartData.shapeStore().mouseOperate().hover
      const prevAnnotationHoverOperate = this._chartData.annotationStore().mouseOperate()
      shapeHoverOperate = this._performOverlayMouseHover(shapes, prevShapeHoverOperate, coordinate, event)
      annotationHoverOperate = this._performOverlayMouseHover(annotations, prevAnnotationHoverOperate, coordinate, event)
    }
    this._chartData.shapeStore().setMouseOperate({
      hover: shapeHoverOperate || {
        id: '',
        element: ShapeMouseOperateElement.NONE,
        elementIndex: -1
      },
      click: shapeClickOperate
    })
    this._chartData.annotationStore().setMouseOperate(annotationHoverOperate || { id: '' })
    this._waitingForMouseMove = false
  }

  /**
   * 鼠标按下事件
   * @param event
   */
  mouseDownEvent (event) {
    const coordinate = { x: event.localX, y: event.paneY }
    const { instance, paneId } = this._chartData.shapeStore().progressInstance()
    let shapeHoverOperate = {
      id: '',
      element: ShapeMouseOperateElement.NONE,
      elementIndex: -1
    }
    let shapeClickOperate
    if (instance && instance.isDrawing() && paneId === event.paneId) {
      instance.mouseLeftButtonDownForDrawing()
      shapeClickOperate = instance.checkEventCoordinateOn(coordinate)
    } else {
      const shapes = this._chartData.shapeStore().instances(event.paneId)
      for (const shape of shapes) {
        shapeClickOperate = shape.checkEventCoordinateOn(coordinate)
        if (shapeClickOperate) {
          this._chartData.shapeStore().updatePressedInstance(shape, event.paneId, shapeClickOperate.element)
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
    const { instance } = this._chartData.shapeStore().progressInstance()
    let removeShape
    if (instance) {
      removeShape = instance
    } else {
      const shapes = this._chartData.shapeStore().instances(event.paneId)
      removeShape = shapes.find(s => s.checkEventCoordinateOn({ x: event.localX, y: event.paneY }))
    }
    if (removeShape && !removeShape.onRightClick({ id: removeShape.id(), points: removeShape.points(), event })) {
      this._chartData.shapeStore().removeInstance(removeShape.id())
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
    const { instance, paneId, element } = this._chartData.shapeStore().pressedInstance()
    if (instance && paneId === event.paneId) {
      const coordinate = { x: event.localX, y: event.paneY }
      if (element === ShapeMouseOperateElement.POINT) {
        instance.mousePressedPointMove(coordinate, event)
      } else {
        instance.mousePressedOtherMove(coordinate)
      }
      this._chartData.crosshairStore().set({ x: event.localX, y: event.paneY, paneId: event.paneId })
    }
  }
}
