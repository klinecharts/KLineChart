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

/**
 * The file comes from tradingview/lightweight-charts
 * https://www.tradingview.com/
 * Convert files from typescript to javascript.
 * Modified the class name.
 * The use of the source code of this file is also subject to the terms
 * and consitions of the license of "lightweight-charts" (Apache License V2, see
 * </licenses/LICENSE-lightweight-charts>).
 */

import { EventType } from './eventTypeChecks'

const MouseEventButton = {
  LEFT: 0,
  RIGHT: 2
}

const DELAY_RESET_CLICK = 500
const DELAY_LONG_TAG = 600

function getBoundingClientRect (element) {
  return element.getBoundingClientRect() || { left: 0, top: 0 }
}

function isTouchEvent (event) {
  return Boolean(event.touches)
}

function preventDefault (event) {
  if (event.cancelable) {
    event.preventDefault()
  }
}

function mobileTouch () {
  let touchEvent
  if ('ontouchstart' in window) {
    touchEvent = true
  } else {
    touchEvent = Boolean(window.DocumentTouch && document instanceof window.DocumentTouch)
  }
  return ('onorientationchange' in window) && (!!navigator.maxTouchPoints || !!navigator.msMaxTouchPoints || touchEvent)
}

function getDistance (p1, p2) {
  const xDiff = p1.clientX - p2.clientX
  const yDiff = p1.clientY - p2.clientY
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
}

export default class EventBase {
  constructor (target, eventHandler, options) {
    this._target = target
    this._handler = eventHandler
    this._options = options

    this._clickCount = 0
    this._clickTimeoutId = null
    this._longTapTimeoutId = null
    this._longTapActive = false
    this._mouseMoveStartPosition = null
    this._moveExceededManhattanDistance = false
    this._cancelClick = false
    this._unsubscribeOutsideEvents = null
    this._unsubscribeMousemove = null
    this._unsubscribeRoot = null

    this._startPinchMiddleCoordinate = null
    this._startPinchDistance = 0
    this._pinchPrevented = false
    this._preventDragProcess = false

    this._mousePressed = false

    this._init()
  }

  setOptions (options = {}) {
    this._options = { ...this.options, ...options }
  }

  destroy () {
    if (this._unsubscribeOutsideEvents !== null) {
      this._unsubscribeOutsideEvents()
      this._unsubscribeOutsideEvents = null
    }

    if (this._unsubscribeMousemove !== null) {
      this._unsubscribeMousemove()
      this._unsubscribeMousemove = null
    }

    if (this._unsubscribeRoot !== null) {
      this._unsubscribeRoot()
      this._unsubscribeRoot = null
    }

    this._clearLongTapTimeout()
    this._resetClickTimeout()
  }

  _mouseEnterHandler (enterEvent) {
    if (this._unsubscribeMousemove) {
      this._unsubscribeMousemove()
    }

    {
      const boundMouseMoveHandler = this._mouseMoveHandler.bind(this)
      const boundMouseWheelHandler = this._mouseWheelHandler.bind(this)
      this._unsubscribeMousemove = () => {
        this._target.removeEventListener('mousemove', boundMouseMoveHandler)
        this._target.removeEventListener('wheel', boundMouseWheelHandler)
      }
      this._target.addEventListener('mousemove', boundMouseMoveHandler)
      this._target.addEventListener('wheel', boundMouseWheelHandler, { passive: false })
    }

    if (isTouchEvent(enterEvent)) {
      this._mouseMoveHandler(enterEvent)
    }

    const compatEvent = this._makeCompatEvent(enterEvent)
    this._processEvent(compatEvent, this._handler.mouseEnterEvent)
  }

  _resetClickTimeout () {
    if (this._clickTimeoutId !== null) {
      clearTimeout(this._clickTimeoutId)
    }

    this._clickCount = 0
    this._clickTimeoutId = null
  }

  _mouseMoveHandler (moveEvent) {
    if (this._mousePressed && !isTouchEvent(moveEvent)) {
      return
    }

    const compatEvent = this._makeCompatEvent(moveEvent)
    this._processEvent(compatEvent, this._handler.mouseMoveEvent)
  }

  _mouseWheelHandler (wheelEvent) {
    const compatEvent = this._makeCompatEvent(wheelEvent)
    wheelEvent.localX = compatEvent.localX
    wheelEvent.localY = compatEvent.localY
    this._processEvent(wheelEvent, this._handler.mouseWheelEvent)
  }

  _mouseMoveWithDownHandler (moveEvent) {
    if ('button' in moveEvent && moveEvent.button !== MouseEventButton.LEFT) {
      return
    }

    if (this._startPinchMiddleCoordinate !== null) {
      return
    }

    const isTouch = isTouchEvent(moveEvent)
    if (this._preventDragProcess && isTouch) {
      return
    }

    this._pinchPrevented = true

    const compatEvent = this._makeCompatEvent(moveEvent)

    const startMouseMovePos = this._mouseMoveStartPosition
    const xOffset = Math.abs(startMouseMovePos.x - compatEvent.pageX)
    const yOffset = Math.abs(startMouseMovePos.y - compatEvent.pageY)

    const moveExceededManhattanDistance = xOffset + yOffset > 5

    if (!moveExceededManhattanDistance && isTouch) {
      return
    }

    if (moveExceededManhattanDistance && !this._moveExceededManhattanDistance && isTouch) {
      // vertical drag is more important than horizontal drag
      // because we scroll the page vertically often than horizontally
      const correctedXOffset = xOffset * 0.5

      // a drag can be only if touch page scroll isn't allowed
      const isVertDrag = yOffset >= correctedXOffset && !this._options.treatVertTouchDragAsPageScroll
      const isHorzDrag = correctedXOffset > yOffset && !this._options.treatHorzTouchDragAsPageScroll

      // if drag event happened then we should revert preventDefault state to original one
      // and try to process the drag event
      // else we shouldn't prevent default of the event and ignore processing the drag event
      if (!isVertDrag && !isHorzDrag) {
        this._preventDragProcess = true
      }
    }

    if (moveExceededManhattanDistance) {
      this._moveExceededManhattanDistance = true

      // if manhattan distance is more that 5 - we should cancel click event
      this._cancelClick = true

      if (isTouch) {
        this._clearLongTapTimeout()
      }
    }

    if (!this._preventDragProcess) {
      this._processEvent(compatEvent, this._handler.pressedMouseMoveEvent)

      // we should prevent default in case of touch only
      // to prevent scroll of the page
      if (isTouch) {
        preventDefault(moveEvent)
      }
    }
  }

  _mouseUpHandler (mouseUpEvent) {
    if ('button' in mouseUpEvent && mouseUpEvent.button !== MouseEventButton.LEFT) {
      return
    }
    const compatEvent = this._makeCompatEvent(mouseUpEvent)

    this._clearLongTapTimeout()

    this._mouseMoveStartPosition = null

    this._mousePressed = false

    if (this._unsubscribeRoot) {
      this._unsubscribeRoot()
      this._unsubscribeRoot = null
    }

    if (isTouchEvent(mouseUpEvent)) {
      this._mouseLeaveHandler(mouseUpEvent)
    }

    this._processEvent(compatEvent, this._handler.mouseUpEvent)
    ++this._clickCount
    if (this._clickTimeoutId && this._clickCount > 1) {
      this._processEvent(compatEvent, this._handler.mouseDoubleClickEvent)
      this._resetClickTimeout()
    } else {
      if (!this._cancelClick) {
        this._processEvent(compatEvent, this._handler.mouseClickEvent)
      }
    }

    // prevent safari's dblclick-to-zoom
    // we handle mouseDoubleClickEvent here ourself
    if (isTouchEvent(mouseUpEvent)) {
      preventDefault(mouseUpEvent)

      this._mouseLeaveHandler(mouseUpEvent)

      if (mouseUpEvent.touches.length === 0) {
        this._longTapActive = false
      }
    }
  }

  _clearLongTapTimeout () {
    if (this._longTapTimeoutId === null) {
      return
    }

    clearTimeout(this._longTapTimeoutId)
    this._longTapTimeoutId = null
  }

  _mouseDownHandler (downEvent) {
    if ('button' in downEvent && downEvent.button !== MouseEventButton.LEFT && downEvent.button !== MouseEventButton.RIGHT) {
      return
    }
    const compatEvent = this._makeCompatEvent(downEvent)
    if ('button' in downEvent && downEvent.button === MouseEventButton.RIGHT) {
      this._processEvent(compatEvent, this._handler.mouseRightDownEvent)
      return
    }
    this._cancelClick = false
    this._moveExceededManhattanDistance = false
    this._preventDragProcess = false

    if (isTouchEvent(downEvent)) {
      this._mouseEnterHandler(downEvent)
    }

    this._mouseMoveStartPosition = {
      x: compatEvent.pageX,
      y: compatEvent.pageY
    }

    if (this._unsubscribeRoot) {
      this._unsubscribeRoot()
      this._unsubscribeRoot = null
    }

    {
      const boundMouseMoveWithDownHandler = this._mouseMoveWithDownHandler.bind(this)
      const boundMouseUpHandler = this._mouseUpHandler.bind(this)
      const rootElement = this._target.ownerDocument.documentElement

      this._unsubscribeRoot = () => {
        rootElement.removeEventListener('touchmove', boundMouseMoveWithDownHandler)
        rootElement.removeEventListener('touchend', boundMouseUpHandler)

        rootElement.removeEventListener('mousemove', boundMouseMoveWithDownHandler)
        rootElement.removeEventListener('mouseup', boundMouseUpHandler)
      }

      rootElement.addEventListener('touchmove', boundMouseMoveWithDownHandler, { passive: false })
      rootElement.addEventListener('touchend', boundMouseUpHandler, { passive: false })

      this._clearLongTapTimeout()

      if (isTouchEvent(downEvent) && downEvent.touches.length === 1) {
        this._longTapTimeoutId = setTimeout(this._longTapHandler.bind(this, downEvent), DELAY_LONG_TAG)
      } else {
        rootElement.addEventListener('mousemove', boundMouseMoveWithDownHandler)
        rootElement.addEventListener('mouseup', boundMouseUpHandler)
      }
    }

    this._mousePressed = true
    this._processEvent(compatEvent, this._handler.mouseDownEvent)

    if (!this._clickTimeoutId) {
      this._clickCount = 0
      this._clickTimeoutId = setTimeout(this._resetClickTimeout.bind(this), DELAY_RESET_CLICK)
    }
  }

  _init () {
    this._target.addEventListener('mouseenter', this._mouseEnterHandler.bind(this))

    this._target.addEventListener('touchcancel', this._clearLongTapTimeout.bind(this))

    {
      const doc = this._target.ownerDocument

      const outsideHandler = (event) => {
        if (!this._handler.mouseDownOutsideEvent) {
          return
        }
        if (event.target && this._target.contains(event.target)) {
          return
        }
        this._handler.mouseDownOutsideEvent()
      }

      this._unsubscribeOutsideEvents = () => {
        doc.removeEventListener('mousedown', outsideHandler)
        doc.removeEventListener('touchstart', outsideHandler)
      }

      doc.addEventListener('mousedown', outsideHandler)
      doc.addEventListener('touchstart', outsideHandler, { passive: true })
    }

    this._target.addEventListener('mouseleave', this._mouseLeaveHandler.bind(this))

    this._target.addEventListener('touchstart', this._mouseDownHandler.bind(this), { passive: true })
    if (!mobileTouch()) {
      this._target.addEventListener('mousedown', this._mouseDownHandler.bind(this))
    }

    this._initPinch()

    // Hey mobile Safari, what's up?
    // If mobile Safari doesn't have any touchmove handler with passive=false
    // it treats a touchstart and the following touchmove events as cancelable=false,
    // so we can't prevent them (as soon we subscribe on touchmove inside handler of touchstart).
    // And we'll get scroll of the page along with chart's one instead of only chart's scroll.
    this._target.addEventListener('touchmove', () => {}, { passive: false })
  }

  _initPinch () {
    if (this._handler.pinchStartEvent === undefined &&
      this._handler.pinchEvent === undefined &&
      this._handler.pinchEndEvent === undefined
    ) {
      return
    }

    this._target.addEventListener(
      'touchstart',
      (event) => this._checkPinchState(event.touches),
      { passive: true }
    )

    this._target.addEventListener(
      'touchmove',
      (event) => {
        if (event.touches.length !== 2 || this._startPinchMiddleCoordinate === null) {
          return
        }

        if (this._handler.pinchEvent !== undefined) {
          const currentDistance = getDistance(event.touches[0], event.touches[1])
          const scale = currentDistance / this._startPinchDistance
          this._handler.pinchEvent(this._startPinchMiddleCoordinate, scale)
          preventDefault(event)
        }
      },
      { passive: false }
    )

    this._target.addEventListener('touchend', (event) => {
      this._checkPinchState(event.touches)
    })
  }

  _checkPinchState (touches) {
    if (touches.length === 1) {
      this._pinchPrevented = false
    }

    if (touches.length !== 2 || this._pinchPrevented || this._longTapActive) {
      this._stopPinch()
    } else {
      this._startPinch(touches)
    }
  }

  _startPinch (touches) {
    const box = getBoundingClientRect(this._target)
    this._startPinchMiddleCoordinate = {
      x: ((touches[0].clientX - box.left) + (touches[1].clientX - box.left)) / 2,
      y: ((touches[0].clientY - box.top) + (touches[1].clientY - box.top)) / 2
    }

    this._startPinchDistance = getDistance(touches[0], touches[1])

    if (this._handler.pinchStartEvent !== undefined) {
      this._handler.pinchStartEvent()
    }

    this._clearLongTapTimeout()
  }

  _stopPinch () {
    if (this._startPinchMiddleCoordinate === null) {
      return
    }

    this._startPinchMiddleCoordinate = null

    if (this._handler.pinchEndEvent !== undefined) {
      this._handler.pinchEndEvent()
    }
  }

  _mouseLeaveHandler (event) {
    if (this._unsubscribeMousemove) {
      this._unsubscribeMousemove()
    }
    const compatEvent = this._makeCompatEvent(event)
    this._processEvent(compatEvent, this._handler.mouseLeaveEvent)
  }

  _longTapHandler (event) {
    const compatEvent = this._makeCompatEvent(event)
    this._processEvent(compatEvent, this._handler.longTapEvent)
    this._cancelClick = true

    // long tap is active untill touchend event with 0 touches occured
    this._longTapActive = true
  }

  _processEvent (event, callback) {
    if (!callback) {
      return
    }
    callback.call(this._handler, event)
  }

  _makeCompatEvent (event) {
  // TouchEvent has no clientX/Y coordinates:
  // We have to use the last Touch instead
    let eventLike
    if ('touches' in event && event.touches.length) {
      eventLike = event.touches[0]
    } else if ('changedTouches' in event && event.changedTouches.length) {
      eventLike = event.changedTouches[0]
    } else {
      eventLike = event
    }

    const box = getBoundingClientRect(this._target)

    return {
      clientX: eventLike.clientX,
      clientY: eventLike.clientY,
      pageX: eventLike.pageX,
      pageY: eventLike.pageY,
      screenX: eventLike.screenX,
      screenY: eventLike.screenY,
      localX: eventLike.clientX - box.left,
      localY: eventLike.clientY - box.top,

      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,

      type: event.type.startsWith('mouse') ? EventType.MOUSE : EventType.TOUCH,

      target: eventLike.target,
      view: event.view
    }
  }
}
