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
 * Modified the class name.
 * The use of the source code of this file is also subject to the terms
 * and consitions of the license of "lightweight-charts" (Apache License V2, see
 * </licenses/LICENSE-lightweight-charts>).
 */

import Coordinate from '../common/Coordinate'

import TypeOrNull from '../common/TypeOrNull'

import { isFF, isIOS, isChrome } from '../common/utils/platform'

export type MouseTouchEventCallback = (event: MouseTouchEvent) => void
export type EmptyCallback = () => void
export type PinchEventCallback = (middleCoordinate: Coordinate, scale: number) => void

export interface EventHandlers {
  pinchStartEvent?: EmptyCallback
  pinchEvent?: PinchEventCallback
  pinchEndEvent?: EmptyCallback

  mouseClickEvent?: MouseTouchEventCallback
  tapEvent?: MouseTouchEventCallback

  mouseDoubleClickEvent?: MouseTouchEventCallback
  doubleTapEvent?: MouseTouchEventCallback

  mouseDownEvent?: MouseTouchEventCallback
  touchStartEvent?: MouseTouchEventCallback

  mouseUpEvent?: MouseTouchEventCallback
  touchEndEvent?: MouseTouchEventCallback

  mouseDownOutsideEvent?: EmptyCallback

  mouseEnterEvent?: MouseTouchEventCallback
  mouseLeaveEvent?: MouseTouchEventCallback

  mouseMoveEvent?: MouseTouchEventCallback

  pressedMouseMoveEvent?: MouseTouchEventCallback
  touchMoveEvent?: MouseTouchEventCallback

  longTapEvent?: MouseTouchEventCallback
}

export interface MouseTouchEvent {
  readonly clientX: number
  readonly clientY: number
  readonly pageX: number
  readonly pageY: number
  readonly screenX: number
  readonly screenY: number
  readonly localX: number
  readonly localY: number

  readonly ctrlKey: boolean
  readonly altKey: boolean
  readonly shiftKey: boolean
  readonly metaKey: boolean
  readonly srcType: string

  readonly isTouch: boolean

  target: MouseEvent['target']
  view: MouseEvent['view']

  preventDefault: EmptyCallback
}

export interface EventHandlerOptions {
  treatVertTouchDragAsPageScroll: () => boolean
  treatHorzTouchDragAsPageScroll: () => boolean
}

// we can use `const name = 500;` but with `const enum` this values will be inlined into code
// so we do not need to have it as variables
const enum Delay {
  ResetClick = 500,
  LongTap = 240,
  PreventFiresTouchEvents = 500,
}

const enum ManhattanDistance {
  CancelClick = 5,
  CancelTap = 5,
  DoubleClick = 5,
  DoubleTap = 30,
}

const enum MouseEventButton {
  Left = 0,
  Middle = 1,
  Right = 2,
}

type TimerId = ReturnType<typeof setTimeout>

interface MouseTouchMoveWithDownInfo {
  xOffset: number
  yOffset: number
  manhattanDistance: number
}

// TODO: get rid of a lot of boolean flags, probably we should replace it with some enum
export default class EventBase {
  private readonly _target: HTMLElement
  private readonly _handler: EventHandlers

  private readonly _options: EventHandlerOptions

  private _clickCount: number = 0
  private _clickTimeoutId: TypeOrNull<TimerId> = null
  private _clickCoordinate: Coordinate = { x: Number.NEGATIVE_INFINITY, y: Number.POSITIVE_INFINITY }

  private _tapCount: number = 0
  private _tapTimeoutId: TypeOrNull<TimerId> = null
  private _tapCoordinate: Coordinate = { x: Number.NEGATIVE_INFINITY, y: Number.POSITIVE_INFINITY }

  private _longTapTimeoutId: TypeOrNull<TimerId> = null
  private _longTapActive: boolean = false

  private _mouseMoveStartCoordinate: TypeOrNull<Coordinate> = null

  private _touchMoveStartCoordinate: TypeOrNull<Coordinate> = null
  private _touchMoveExceededManhattanDistance: boolean = false

  private _cancelClick: boolean = false
  private _cancelTap: boolean = false

  private _unsubscribeOutsideMouseEvents: TypeOrNull<EmptyCallback> = null
  private _unsubscribeOutsideTouchEvents: TypeOrNull<EmptyCallback> = null
  private _unsubscribeMobileSafariEvents: TypeOrNull<EmptyCallback> = null

  private _unsubscribeMousemove: TypeOrNull<EmptyCallback> = null

  private _unsubscribeRootMouseEvents: TypeOrNull<EmptyCallback> = null
  private _unsubscribeRootTouchEvents: TypeOrNull<EmptyCallback> = null

  private _startPinchMiddleCoordinate: TypeOrNull<Coordinate> = null
  private _startPinchDistance: number = 0
  private _pinchPrevented: boolean = false
  private _preventTouchDragProcess: boolean = false

  private _mousePressed: boolean = false

  private _lastTouchEventTimeStamp: number = 0

  // for touchstart/touchmove/touchend events we handle only first touch
  // i.e. we don't support several active touches at the same time (except pinch event)
  private _activeTouchId: TypeOrNull<number> = null

  // accept all mouse leave events if it's not an iOS device
  // see _mouseEnterHandler, _mouseMoveHandler, _mouseLeaveHandler
  private _acceptMouseLeave: boolean = !isIOS()

  constructor (
    target: HTMLElement,
    handler: EventHandlers,
    options: EventHandlerOptions
  ) {
    this._target = target
    this._handler = handler
    this._options = options

    this._init()
  }

  destroy (): void {
    if (this._unsubscribeOutsideMouseEvents !== null) {
      this._unsubscribeOutsideMouseEvents()
      this._unsubscribeOutsideMouseEvents = null
    }

    if (this._unsubscribeOutsideTouchEvents !== null) {
      this._unsubscribeOutsideTouchEvents()
      this._unsubscribeOutsideTouchEvents = null
    }

    if (this._unsubscribeMousemove !== null) {
      this._unsubscribeMousemove()
      this._unsubscribeMousemove = null
    }

    if (this._unsubscribeRootMouseEvents !== null) {
      this._unsubscribeRootMouseEvents()
      this._unsubscribeRootMouseEvents = null
    }

    if (this._unsubscribeRootTouchEvents !== null) {
      this._unsubscribeRootTouchEvents()
      this._unsubscribeRootTouchEvents = null
    }

    if (this._unsubscribeMobileSafariEvents !== null) {
      this._unsubscribeMobileSafariEvents()
      this._unsubscribeMobileSafariEvents = null
    }

    this._clearLongTapTimeout()
    this._resetClickTimeout()
  }

  private _mouseEnterHandler (enterEvent: MouseEvent): void {
    this._unsubscribeMousemove?.()

    const boundMouseMoveHandler = this._mouseMoveHandler.bind(this)
    this._unsubscribeMousemove = () => {
      this._target.removeEventListener('mousemove', boundMouseMoveHandler)
    }
    this._target.addEventListener('mousemove', boundMouseMoveHandler)

    if (this._firesTouchEvents(enterEvent)) {
      return
    }

    const compatEvent = this._makeCompatEvent(enterEvent)
    this._processMouseEvent(compatEvent, this._handler.mouseEnterEvent)
    this._acceptMouseLeave = true
  }

  private _resetClickTimeout (): void {
    if (this._clickTimeoutId !== null) {
      clearTimeout(this._clickTimeoutId)
    }

    this._clickCount = 0
    this._clickTimeoutId = null
    this._clickCoordinate = { x: Number.NEGATIVE_INFINITY, y: Number.POSITIVE_INFINITY }
  }

  private _resetTapTimeout (): void {
    if (this._tapTimeoutId !== null) {
      clearTimeout(this._tapTimeoutId)
    }

    this._tapCount = 0
    this._tapTimeoutId = null
    this._tapCoordinate = { x: Number.NEGATIVE_INFINITY, y: Number.POSITIVE_INFINITY }
  }

  private _mouseMoveHandler (moveEvent: MouseEvent): void {
    if (this._mousePressed || this._touchMoveStartCoordinate !== null) {
      return
    }

    if (this._firesTouchEvents(moveEvent)) {
      return
    }

    const compatEvent = this._makeCompatEvent(moveEvent)
    this._processMouseEvent(compatEvent, this._handler.mouseMoveEvent)
    this._acceptMouseLeave = true
  }

  private _touchMoveHandler (moveEvent: TouchEvent): void {
    const touch = touchWithId(moveEvent.changedTouches, this._activeTouchId)
    if (touch === null) {
      return
    }

    this._lastTouchEventTimeStamp = eventTimeStamp(moveEvent)

    if (this._startPinchMiddleCoordinate !== null) {
      return
    }

    if (this._preventTouchDragProcess) {
      return
    }

    // prevent pinch if move event comes faster than the second touch
    this._pinchPrevented = true

    const moveInfo = this._mouseTouchMoveWithDownInfo(getPosition(touch), this._touchMoveStartCoordinate as Coordinate)
    const { xOffset, yOffset, manhattanDistance } = moveInfo

    if (!this._touchMoveExceededManhattanDistance && manhattanDistance < ManhattanDistance.CancelTap) {
      return
    }

    if (!this._touchMoveExceededManhattanDistance) {
      // first time when current position exceeded manhattan distance

      // vertical drag is more important than horizontal drag
      // because we scroll the page vertically often than horizontally
      const correctedXOffset = xOffset * 0.5

      // a drag can be only if touch page scroll isn't allowed
      const isVertDrag = yOffset >= correctedXOffset && !this._options.treatVertTouchDragAsPageScroll()
      const isHorzDrag = correctedXOffset > yOffset && !this._options.treatHorzTouchDragAsPageScroll()

      // if drag event happened then we should revert preventDefault state to original one
      // and try to process the drag event
      // else we shouldn't prevent default of the event and ignore processing the drag event
      if (!isVertDrag && !isHorzDrag) {
        this._preventTouchDragProcess = true
      }

      this._touchMoveExceededManhattanDistance = true
      // if manhattan distance is more that 5 - we should cancel tap event
      this._cancelTap = true
      this._clearLongTapTimeout()
      this._resetTapTimeout()
    }

    if (!this._preventTouchDragProcess) {
      const compatEvent = this._makeCompatEvent(moveEvent, touch)
      this._processTouchEvent(compatEvent, this._handler.touchMoveEvent)

      // we should prevent default in case of touch only
      // to prevent scroll of the page
      preventDefault(moveEvent)
    }
  }

  private _mouseMoveWithDownHandler (moveEvent: MouseEvent): void {
    if (moveEvent.button !== MouseEventButton.Left) {
      return
    }

    const moveInfo = this._mouseTouchMoveWithDownInfo(getPosition(moveEvent), this._mouseMoveStartCoordinate as Coordinate)
    const { manhattanDistance } = moveInfo

    if (manhattanDistance >= ManhattanDistance.CancelClick) {
      // if manhattan distance is more that 5 - we should cancel click event
      this._cancelClick = true
      this._resetClickTimeout()
    }

    if (this._cancelClick) {
      // if this._cancelClick is true, that means that minimum manhattan distance is already exceeded
      const compatEvent = this._makeCompatEvent(moveEvent)
      this._processMouseEvent(compatEvent, this._handler.pressedMouseMoveEvent)
    }
  }

  private _mouseTouchMoveWithDownInfo (currentCoordinate: Coordinate, startCoordinate: Coordinate): MouseTouchMoveWithDownInfo {
    const xOffset = Math.abs(startCoordinate.x - currentCoordinate.x)
    const yOffset = Math.abs(startCoordinate.y - currentCoordinate.y)

    const manhattanDistance = xOffset + yOffset

    return { xOffset, yOffset, manhattanDistance }
  }

  /**
   * In Firefox mouse events dont't fire if the mouse position is outside of the browser's border.
   * To prevent the mouse from hanging while pressed we're subscribing on the mouseleave event of the document element.
   * We're subscribing on mouseleave, but this event is actually fired on mouseup outside of the browser's border.
   */
  private readonly _onFirefoxOutsideMouseUp = (mouseUpEvent: MouseEvent): void => {
    this._mouseUpHandler(mouseUpEvent)
  }

  /**
   * Safari doesn't fire touchstart/mousedown events on double tap since iOS 13.
   * There are two possible solutions:
   * 1) Call preventDefault in touchEnd handler. But it also prevents click event from firing.
   * 2) Add listener on dblclick event that fires with the preceding mousedown/mouseup.
   * https://developer.apple.com/forums/thread/125073
   */
  private readonly _onMobileSafariDoubleClick = (dblClickEvent: MouseEvent): void => {
    if (this._firesTouchEvents(dblClickEvent)) {
      const compatEvent = this._makeCompatEvent(dblClickEvent)
      ++this._tapCount

      if (this._tapTimeoutId !== null && this._tapCount > 1) {
        const { manhattanDistance } = this._mouseTouchMoveWithDownInfo(getPosition(dblClickEvent), this._tapCoordinate)
        if (manhattanDistance < ManhattanDistance.DoubleTap && !this._cancelTap) {
          this._processTouchEvent(compatEvent as unknown as MouseTouchEvent, this._handler.doubleTapEvent)
        }
        this._resetTapTimeout()
      }
    } else {
      const compatEvent = this._makeCompatEvent(dblClickEvent)
      ++this._clickCount

      if (this._clickTimeoutId !== null && this._clickCount > 1) {
        const { manhattanDistance } = this._mouseTouchMoveWithDownInfo(getPosition(dblClickEvent), this._clickCoordinate)
        if (manhattanDistance < ManhattanDistance.DoubleClick && !this._cancelClick) {
          this._processMouseEvent(compatEvent, this._handler.mouseDoubleClickEvent)
        }
        this._resetClickTimeout()
      }
    }
  }

  // eslint-disable-next-line complexity
  private _touchEndHandler (touchEndEvent: TouchEvent): void {
    let touch = touchWithId(touchEndEvent.changedTouches, this._activeTouchId)
    if (touch === null && touchEndEvent.touches.length === 0) {
      // something went wrong, somehow we missed the required touchend event
      // probably the browser has not sent this event
      touch = touchEndEvent.changedTouches[0]
    }

    if (touch === null) {
      return
    }

    this._activeTouchId = null
    this._lastTouchEventTimeStamp = eventTimeStamp(touchEndEvent)
    this._clearLongTapTimeout()
    this._touchMoveStartCoordinate = null

    if (this._unsubscribeRootTouchEvents !== null) {
      this._unsubscribeRootTouchEvents()
      this._unsubscribeRootTouchEvents = null
    }

    const compatEvent = this._makeCompatEvent(touchEndEvent, touch)
    this._processTouchEvent(compatEvent, this._handler.touchEndEvent)
    ++this._tapCount

    if (this._tapTimeoutId !== null && this._tapCount > 1) {
      // check that both clicks are near enough
      const { manhattanDistance } = this._mouseTouchMoveWithDownInfo(getPosition(touch), this._tapCoordinate)
      if (manhattanDistance < ManhattanDistance.DoubleTap && !this._cancelTap) {
        this._processTouchEvent(compatEvent, this._handler.doubleTapEvent)
      }
      this._resetTapTimeout()
    } else {
      if (!this._cancelTap) {
        this._processTouchEvent(compatEvent, this._handler.tapEvent)

        // do not fire mouse events if tap handler was executed
        // prevent click event on new dom element (who appeared after tap)
        if (this._handler.tapEvent != null) {
          preventDefault(touchEndEvent)
        }
      }
    }

    // prevent, for example, safari's dblclick-to-zoom or fast-click after long-tap
    // we handle mouseDoubleClickEvent here ourselves
    if (this._tapCount === 0) {
      preventDefault(touchEndEvent)
    }

    if (touchEndEvent.touches.length === 0) {
      if (this._longTapActive) {
        this._longTapActive = false
        // prevent native click event
        preventDefault(touchEndEvent)
      }
    }
  }

  private _mouseUpHandler (mouseUpEvent: MouseEvent): void {
    if (mouseUpEvent.button !== MouseEventButton.Left) {
      return
    }

    const compatEvent = this._makeCompatEvent(mouseUpEvent)

    this._mouseMoveStartCoordinate = null
    this._mousePressed = false

    if (this._unsubscribeRootMouseEvents !== null) {
      this._unsubscribeRootMouseEvents()
      this._unsubscribeRootMouseEvents = null
    }

    if (isFF()) {
      const rootElement = this._target.ownerDocument.documentElement
      rootElement.removeEventListener('mouseleave', this._onFirefoxOutsideMouseUp)
    }

    if (this._firesTouchEvents(mouseUpEvent)) {
      return
    }

    this._processMouseEvent(compatEvent, this._handler.mouseUpEvent)
    ++this._clickCount

    if (this._clickTimeoutId !== null && this._clickCount > 1) {
      // check that both clicks are near enough
      const { manhattanDistance } = this._mouseTouchMoveWithDownInfo(getPosition(mouseUpEvent), this._clickCoordinate)
      if (manhattanDistance < ManhattanDistance.DoubleClick && !this._cancelClick) {
        this._processMouseEvent(compatEvent, this._handler.mouseDoubleClickEvent)
      }
      this._resetClickTimeout()
    } else {
      if (!this._cancelClick) {
        this._processMouseEvent(compatEvent, this._handler.mouseClickEvent)
      }
    }
  }

  private _clearLongTapTimeout (): void {
    if (this._longTapTimeoutId === null) {
      return
    }

    clearTimeout(this._longTapTimeoutId)
    this._longTapTimeoutId = null
  }

  private _touchStartHandler (downEvent: TouchEvent): void {
    if (this._activeTouchId !== null) {
      return
    }
    const touch = downEvent.changedTouches[0]
    this._activeTouchId = touch.identifier

    this._lastTouchEventTimeStamp = eventTimeStamp(downEvent)

    const rootElement = this._target.ownerDocument.documentElement

    this._cancelTap = false
    this._touchMoveExceededManhattanDistance = false
    this._preventTouchDragProcess = false

    this._touchMoveStartCoordinate = getPosition(touch)

    if (this._unsubscribeRootTouchEvents !== null) {
      this._unsubscribeRootTouchEvents()
      this._unsubscribeRootTouchEvents = null
    }

    {
      const boundTouchMoveWithDownHandler = this._touchMoveHandler.bind(this)
      const boundTouchEndHandler = this._touchEndHandler.bind(this)

      this._unsubscribeRootTouchEvents = () => {
        rootElement.removeEventListener('touchmove', boundTouchMoveWithDownHandler)
        rootElement.removeEventListener('touchend', boundTouchEndHandler)
      }

      rootElement.addEventListener('touchmove', boundTouchMoveWithDownHandler, { passive: false })
      rootElement.addEventListener('touchend', boundTouchEndHandler, { passive: false })

      this._clearLongTapTimeout()
      this._longTapTimeoutId = setTimeout(this._longTapHandler.bind(this, downEvent), Delay.LongTap)
    }

    const compatEvent = this._makeCompatEvent(downEvent, touch)
    this._processTouchEvent(compatEvent, this._handler.touchStartEvent)

    if (this._tapTimeoutId === null) {
      this._tapCount = 0
      this._tapTimeoutId = setTimeout(this._resetTapTimeout.bind(this), Delay.ResetClick)
      this._tapCoordinate = getPosition(touch)
    }
  }

  private _mouseDownHandler (downEvent: MouseEvent): void {
    if (downEvent.button !== MouseEventButton.Left) {
      return
    }

    const rootElement = this._target.ownerDocument.documentElement
    if (isFF()) {
      rootElement.addEventListener('mouseleave', this._onFirefoxOutsideMouseUp)
    }

    this._cancelClick = false

    this._mouseMoveStartCoordinate = getPosition(downEvent)

    if (this._unsubscribeRootMouseEvents !== null) {
      this._unsubscribeRootMouseEvents()
      this._unsubscribeRootMouseEvents = null
    }

    {
      const boundMouseMoveWithDownHandler = this._mouseMoveWithDownHandler.bind(this)
      const boundMouseUpHandler = this._mouseUpHandler.bind(this)

      this._unsubscribeRootMouseEvents = () => {
        rootElement.removeEventListener('mousemove', boundMouseMoveWithDownHandler)
        rootElement.removeEventListener('mouseup', boundMouseUpHandler)
      }

      rootElement.addEventListener('mousemove', boundMouseMoveWithDownHandler)
      rootElement.addEventListener('mouseup', boundMouseUpHandler)
    }

    this._mousePressed = true

    if (this._firesTouchEvents(downEvent)) {
      return
    }

    const compatEvent = this._makeCompatEvent(downEvent)
    this._processMouseEvent(compatEvent, this._handler.mouseDownEvent)

    if (this._clickTimeoutId === null) {
      this._clickCount = 0
      this._clickTimeoutId = setTimeout(this._resetClickTimeout.bind(this), Delay.ResetClick)
      this._clickCoordinate = getPosition(downEvent)
    }
  }

  private _init (): void {
    this._target.addEventListener('mouseenter', this._mouseEnterHandler.bind(this))

    // Do not show context menu when something went wrong
    this._target.addEventListener('touchcancel', this._clearLongTapTimeout.bind(this))

    {
      const doc = this._target.ownerDocument

      const outsideHandler = (event: MouseEvent | TouchEvent): void => {
        if (this._handler.mouseDownOutsideEvent == null) {
          return
        }

        if (event.composed && this._target.contains(event.composedPath()[0] as Element)) {
          return
        }

        if ((event.target != null) && this._target.contains(event.target as Element)) {
          return
        }

        this._handler.mouseDownOutsideEvent()
      }

      this._unsubscribeOutsideTouchEvents = () => {
        doc.removeEventListener('touchstart', outsideHandler)
      }

      this._unsubscribeOutsideMouseEvents = () => {
        doc.removeEventListener('mousedown', outsideHandler)
      }

      doc.addEventListener('mousedown', outsideHandler)
      doc.addEventListener('touchstart', outsideHandler, { passive: true })
    }

    if (isIOS()) {
      this._unsubscribeMobileSafariEvents = () => {
        this._target.removeEventListener('dblclick', this._onMobileSafariDoubleClick)
      }
      this._target.addEventListener('dblclick', this._onMobileSafariDoubleClick)
    }

    this._target.addEventListener('mouseleave', this._mouseLeaveHandler.bind(this))

    this._target.addEventListener('touchstart', this._touchStartHandler.bind(this), { passive: true })
    preventScrollByWheelClick(this._target)
    this._target.addEventListener('mousedown', this._mouseDownHandler.bind(this))

    this._initPinch()

    // Hey mobile Safari, what's up?
    // If mobile Safari doesn't have any touchmove handler with passive=false
    // it treats a touchstart and the following touchmove events as cancelable=false,
    // so we can't prevent them (as soon we subscribe on touchmove inside touchstart's handler).
    // And we'll get scroll of the page along with chart's one instead of only chart's scroll.
    this._target.addEventListener('touchmove', () => {}, { passive: false })
  }

  private _initPinch (): void {
    if (this._handler.pinchStartEvent == null &&
      this._handler.pinchEvent == null &&
      this._handler.pinchEndEvent == null
    ) {
      return
    }

    this._target.addEventListener(
      'touchstart',
      (event: TouchEvent) => this._checkPinchState(event.touches),
      { passive: true }
    )

    this._target.addEventListener(
      'touchmove',
      (event: TouchEvent) => {
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

    this._target.addEventListener('touchend', (event: TouchEvent) => {
      this._checkPinchState(event.touches)
    })
  }

  private _checkPinchState (touches: TouchList): void {
    if (touches.length === 1) {
      this._pinchPrevented = false
    }

    if (touches.length !== 2 || this._pinchPrevented || this._longTapActive) {
      this._stopPinch()
    } else {
      this._startPinch(touches)
    }
  }

  private _startPinch (touches: TouchList): void {
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

  private _stopPinch (): void {
    if (this._startPinchMiddleCoordinate === null) {
      return
    }

    this._startPinchMiddleCoordinate = null

    if (this._handler.pinchEndEvent !== undefined) {
      this._handler.pinchEndEvent()
    }
  }

  private _mouseLeaveHandler (event: MouseEvent): void {
    this._unsubscribeMousemove?.()

    if (this._firesTouchEvents(event)) {
      return
    }

    if (!this._acceptMouseLeave) {
      // mobile Safari sometimes emits mouse leave event for no reason, there is no way to handle it in other way
      // just ignore this event if there was no mouse move or mouse enter events
      return
    }

    const compatEvent = this._makeCompatEvent(event)
    this._processMouseEvent(compatEvent, this._handler.mouseLeaveEvent)

    // accept all mouse leave events if it's not an iOS device
    this._acceptMouseLeave = !isIOS()
  }

  private _longTapHandler (event: TouchEvent): void {
    const touch = touchWithId(event.touches, this._activeTouchId)
    if (touch === null) {
      return
    }

    const compatEvent = this._makeCompatEvent(event, touch)
    this._processTouchEvent(compatEvent, this._handler.longTapEvent)
    this._cancelTap = true

    // long tap is active until touchend event with 0 touches occurred
    this._longTapActive = true
  }

  private _firesTouchEvents (e: MouseEvent): boolean {
    // @ts-expect-error
    if (e.sourceCapabilities?.firesTouchEvents !== undefined) {
      // @ts-expect-error
      return e.sourceCapabilities.firesTouchEvents
    }

    return eventTimeStamp(e) < this._lastTouchEventTimeStamp + Delay.PreventFiresTouchEvents
  }

  private _processTouchEvent (event: MouseTouchEvent, callback?: MouseTouchEventCallback): void {
    callback?.call(this._handler, event)
  }

  private _processMouseEvent (event: MouseTouchEvent, callback?: MouseTouchEventCallback): void {
    callback?.call(this._handler, event)
  }

  private _makeCompatEvent (event: MouseEvent | TouchEvent, touch?: Touch): MouseTouchEvent {
    // TouchEvent has no clientX/Y coordinates:
    // We have to use the last Touch instead
    const eventLike = touch ?? (event as MouseEvent)
    const box = this._target.getBoundingClientRect() ?? { left: 0, top: 0 }

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

      isTouch: !event.type.startsWith('mouse') && event.type !== 'contextmenu' && event.type !== 'click',
      srcType: event.type,

      target: eventLike.target,
      view: event.view,

      preventDefault: () => {
        if (event.type !== 'touchstart') {
          // touchstart is passive and cannot be prevented
          preventDefault(event)
        }
      }
    }
  }
}

function preventScrollByWheelClick (element: HTMLElement): void {
  if (!isChrome()) {
    return
  }
  element.addEventListener('mousedown', (e: MouseEvent) => {
    if (e.button === MouseEventButton.Middle) {
      // prevent incorrect scrolling event
      e.preventDefault()
      return false
    }
    return undefined
  })
}

function getBoundingClientRect (element: HTMLElement): DOMRect {
  return element.getBoundingClientRect() ?? { left: 0, top: 0 }
}

function getDistance (p1: Touch, p2: Touch): number {
  const xDiff = p1.clientX - p2.clientX
  const yDiff = p1.clientY - p2.clientY
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
}

function preventDefault (event: Event): void {
  if (event.cancelable) {
    event.preventDefault()
  }
}

function getPosition (eventLike: Touch | MouseEvent): Coordinate {
  return {
    x: eventLike.pageX,
    y: eventLike.pageY
  }
}

function eventTimeStamp (e: TouchEvent | MouseEvent): number {
  // for some reason e.timestamp is always 0 on iPad with magic mouse, so we use performance.now() as a fallback
  return e.timeStamp ?? performance.now()
}

function touchWithId (touches: TouchList, id: TypeOrNull<number>): TypeOrNull<Touch> {
  for (let i = 0; i < touches.length; ++i) {
    if (touches[i].identifier === id) {
      return touches[i]
    }
  }

  return null
}
