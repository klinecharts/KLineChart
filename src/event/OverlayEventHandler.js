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

import EventHandler from './EventHandler'
import { isMouse, isTouch } from './eventTypeChecks'

import InvalidateLevel from '../enum/InvalidateLevel'
import { ShapeEventOperateElement } from '../component/overlay/Shape'

export default class OverlayEventHandler extends EventHandler {
  constructor (chartStore, yAxis) {
    super(chartStore)
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
    this._chartStore.shapeStore().updatePressedInstance()
  }

  mouseMoveEvent (event) {
    if (isMouse(event)) {
      if (this._waitingForMouseMove) {
        return false
      }
      this._waitingForMouseMove = true
      const coordinate = { x: event.localX, y: event.paneY }
      const { instance, paneId } = this._chartStore.shapeStore().progressInstance()
      let shapeHoverOperate
      let shapeClickOperate
      let annotationHoverOperate
      if (instance && instance.isDrawing()) {
        if (event.paneId) {
          if (instance.isStart()) {
            this._chartStore.shapeStore().updateProgressInstance(this._yAxis(event.paneId), event.paneId)
          }
          if (paneId === event.paneId) {
            instance.mouseMoveForDrawing(coordinate, event)
          }
          shapeHoverOperate = {
            id: instance.id(),
            element: ShapeEventOperateElement.POINT,
            elementIndex: instance.points().length - 1
          }
        }
        shapeClickOperate = {
          id: '',
          element: ShapeEventOperateElement.NONE,
          elementIndex: -1
        }
      } else {
        const annotations = this._chartStore.annotationStore().get(event.paneId)
        const shapes = this._chartStore.shapeStore().instances(event.paneId)
        const prevShapeHoverOperate = this._chartStore.shapeStore().eventOperate().hover
        const prevAnnotationHoverOperate = this._chartStore.annotationStore().eventOperate()
        shapeHoverOperate = this._performOverlayMouseHover(shapes, prevShapeHoverOperate, coordinate, event)
        annotationHoverOperate = this._performOverlayMouseHover(annotations, prevAnnotationHoverOperate, coordinate, event)
      }
      this._chartStore.shapeStore().setEventOperate({
        hover: shapeHoverOperate || {
          id: '',
          element: ShapeEventOperateElement.NONE,
          elementIndex: -1
        },
        click: shapeClickOperate
      })
      this._chartStore.annotationStore().setEventOperate(annotationHoverOperate || { id: '' })
      this._waitingForMouseMove = false
    }
  }

  /**
   * 鼠标按下事件
   * @param event
   */
  mouseDownEvent (event) {
    const coordinate = { x: event.localX, y: event.paneY }
    const { instance, paneId } = this._chartStore.shapeStore().progressInstance()
    let shapeHoverOperate = {
      id: '',
      element: ShapeEventOperateElement.NONE,
      elementIndex: -1
    }
    let progressShapePaneId = paneId
    let shapeClickOperate
    if (instance && instance.isDrawing()) {
      if (isTouch(event)) {
        if (instance.isStart()) {
          this._chartStore.shapeStore().updateProgressInstance(this._yAxis(event.paneId), event.paneId)
          progressShapePaneId = event.paneId
        }
        if (progressShapePaneId === event.paneId) {
          // 移动端添加点数据到实例
          instance.mouseMoveForDrawing(coordinate, event)
        }
      }
      if (progressShapePaneId === event.paneId) {
        instance.mouseLeftButtonDownForDrawing()
        shapeClickOperate = {
          id: instance.id(),
          element: ShapeEventOperateElement.POINT,
          elementIndex: instance.points().length - 1
        }
        shapeHoverOperate = {
          id: instance.id(),
          element: ShapeEventOperateElement.POINT,
          elementIndex: instance.points().length - 1
        }
      }
    } else {
      const shapes = this._chartStore.shapeStore().instances(event.paneId)
      for (const shape of shapes) {
        shapeClickOperate = shape.checkEventCoordinateOn(coordinate)
        if (shapeClickOperate) {
          this._chartStore.shapeStore().updatePressedInstance(shape, event.paneId, shapeClickOperate.element)
          if (shapeClickOperate.element === ShapeEventOperateElement.POINT) {
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
      const visibleAnnotations = this._chartStore.annotationStore().get(event.paneId)
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
    const shapeOperateValid = this._chartStore.shapeStore().setEventOperate({
      hover: shapeHoverOperate,
      click: shapeClickOperate || {
        id: '',
        element: ShapeEventOperateElement.NONE,
        elementIndex: -1
      }
    })
    if (shapeOperateValid) {
      this._chartStore.invalidate(InvalidateLevel.OVERLAY)
    }
  }

  mouseRightDownEvent (event) {
    const { instance } = this._chartStore.shapeStore().progressInstance()
    let removeShape
    if (instance) {
      removeShape = instance
    } else {
      const shapes = this._chartStore.shapeStore().instances(event.paneId)
      removeShape = shapes.find(s => s.checkEventCoordinateOn({ x: event.localX, y: event.paneY }))
    }
    if (removeShape && !removeShape.onRightClick({ id: removeShape.id(), points: removeShape.points(), event })) {
      this._chartStore.shapeStore().removeInstance(removeShape.id())
    }
    const visibleAnnotations = this._chartStore.annotationStore().get(event.paneId)
    if (visibleAnnotations) {
      const annotation = visibleAnnotations.find(an => an.checkEventCoordinateOn({ x: event.localX, y: event.paneY }))
      if (annotation) {
        annotation.onRightClick({ id: annotation.id(), points: annotation.points(), event })
      }
    }
  }

  pressedMouseMoveEvent (event) {
    const { instance, paneId, element } = this._chartStore.shapeStore().pressedInstance()
    if (instance && paneId === event.paneId) {
      const coordinate = { x: event.localX, y: event.paneY }
      if (element === ShapeEventOperateElement.POINT) {
        instance.mousePressedPointMove(coordinate, event)
      } else {
        instance.mousePressedOtherMove(coordinate, event)
      }
      this._chartStore.crosshairStore().set({ x: event.localX, y: event.paneY, paneId: event.paneId })
    }
  }
}
