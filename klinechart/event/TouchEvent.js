import Event from './Event'
import { isValidEvent, stopEvent, distance, getXDist, spacing, getCanvasPoint } from './eventHelper'

/**
 * 无
 */
const TOUCH_NO = 0

/**
 * 拖拽
 */
const TOUCH_DRAG = 1

/**
 * 缩放
 */
const TOUCH_ZOOM = 2

/**
 *
 */
const TOUCH_POST_ZOOM = 3

/**
 * 十字光标
 */
const TOUCH_CROSS = 4

/**
 * 十字光标取消
 */
const TOUCH_CROSS_CANCEL = 5

class TouchEvent extends Event {
  constructor (
    tooltipChart, mainChart, volChart,
    subIndicatorChart, xAxisChart, storage
  ) {
    super(tooltipChart, mainChart, volChart, subIndicatorChart, xAxisChart, storage)
    // 事件模型
    this.touchMode = TOUCH_NO
    this.touchStartPoint = { x: 0, y: 0 }
    this.touchMovePoint = { x: 0, y: 0 }
    this.touchCrossPoint = { x: 0, y: 0 }
    this.savedDist = 1
    this.savedXDist = 1
    this.touchRange = storage.range
    this.touchStartPosition = storage.minPos
    this.delayTimeout = null
    this.delayActiveCross = () => {
      if (this.touchMode === TOUCH_NO || this.touchMode === TOUCH_CROSS_CANCEL) {
        if (this.tooltipChart) {
          this.touchMode = TOUCH_CROSS
          this.touchCrossPoint = { x: this.touchStartPoint.x, y: this.touchStartPoint.y }
          this.cross(this.touchCrossPoint)
        }
      }
    }
  }

  /**
   * 触摸事件开始
   * @param e
   */
  touchStart (e) {
    if (this.storage.dataList.length === 0) {
      return
    }
    if (e.targetTouches.length === 1) {
      const point = getCanvasPoint(e.targetTouches[0], this.tooltipChart.canvasDom)
      this.touchStartPoint = { x: point.x, y: point.y }
      this.touchMovePoint = { x: point.x, y: point.y }
      if (!isValidEvent(this.touchStartPoint, this.handler)) {
        return
      }
      if (this.touchMode === TOUCH_CROSS) {
        stopEvent(e)
        const crossRadius = distance(point.x, this.touchCrossPoint.x, point.y, this.touchCrossPoint.y)
        if (crossRadius < 10) {
          this.performCross(e)
        } else {
          this.touchMode = TOUCH_CROSS_CANCEL
          this.storage.crossPoint = null
          this.tooltipChart.flush()
        }
      } else {
        this.touchMode = TOUCH_NO
      }
      this.removeDelayActiveCross()
      this.postDelayDelayActiveCross()
    } else if (e.targetTouches.length > 1) {
      if (!isValidEvent(this.touchStartPoint, this.handler)) {
        return
      }
      if (this.touchMode !== TOUCH_CROSS) {
        stopEvent(e)
        this.savedDist = spacing(e, this.tooltipChart.canvasDom)
        this.savedXDist = getXDist(e, this.tooltipChart.canvasDom)
        if (this.savedDist > 3) {
          this.touchMode = TOUCH_ZOOM
        }
        this.touchRange = this.storage.range
        this.touchStartPosition = this.storage.minPos
      }
    }
  }

  /**
   * 触摸事件移动
   * @param e
   * @param loadMore
   */
  touchMove (e, loadMore) {
    if (!isValidEvent(this.touchStartPoint, this.handler) || this.storage.dataList.length === 0) {
      return
    }
    if (!this.waitingForMouseMoveAnimationFrame) {
      this.waitingForMouseMoveAnimationFrame = true
      switch (this.touchMode) {
        case TOUCH_ZOOM: {
          stopEvent(e)
          this.performZoom(e)
          break
        }
        case TOUCH_DRAG: {
          stopEvent(e)
          const point = getCanvasPoint(e.targetTouches[0], this.tooltipChart.canvasDom)
          this.drag(this.touchMovePoint, point.x, loadMore)
          break
        }
        case TOUCH_CROSS: {
          stopEvent(e)
          this.performCross(e)
          break
        }
        case TOUCH_CROSS_CANCEL: {
          this.removeDelayActiveCross()
          break
        }
        case TOUCH_NO: {
          const point = getCanvasPoint(e.targetTouches[0], this.tooltipChart.canvasDom)
          const dis = Math.abs(distance(point.x, this.touchStartPoint.x, point.y, this.touchStartPoint.y))
          if (dis > 10) {
            const distanceX = Math.abs(point.x - this.touchStartPoint.x)
            const distanceY = Math.abs(point.y - this.touchStartPoint.y)
            if (distanceY <= distanceX) {
              stopEvent(e)
              this.storage.crossPoint = null
              this.touchMode = TOUCH_DRAG
              this.tooltipChart.flush()
            }
          }
          this.removeDelayActiveCross()
        }
      }
      this.waitingForMouseMoveAnimationFrame = false
    }
  }

  /**
   * 触摸事件结束
   * @param e
   */
  touchEnd (e) {
    if (!isValidEvent(this.touchStartPoint, this.handler) || this.storage.dataList.length === 0) {
      return
    }
    stopEvent(e)
    if (e.targetTouches.length > 0) {
      if (this.touchMode === TOUCH_CROSS) {
        this.performCross(e)
      } else {
        this.touchMode = TOUCH_POST_ZOOM
      }
    } else {
      this.removeDelayActiveCross()
      // 拿起
      if (this.touchMode !== TOUCH_CROSS) {
        if (this.touchMode === TOUCH_NO) {
          this.touchMode = TOUCH_CROSS
          this.touchCrossPoint = { ...this.touchStartPoint }
          this.cross(this.touchCrossPoint)
        } else {
          this.touchMode = TOUCH_NO
          this.storage.crossPoint = null
          this.tooltipChart.flush()
        }
      }
    }
  }

  /**
   * 处理缩放
   * @param e
   * @returns {boolean}
   */
  performZoom (e) {
    if (e.targetTouches.length > 1) {
      const totalDist = spacing(e, this.tooltipChart.canvasDom)
      if (totalDist > 10) {
        const xDist = getXDist(e, this.tooltipChart.canvasDom)
        // x轴方向 scale
        const scaleX = xDist / this.savedXDist

        // 是否缩小
        const isZoomingOut = scaleX < 1
        this.zoom(isZoomingOut, scaleX, this.touchStartPosition, this.touchRange)
      }
    }
  }

  /**
   * 处理移动光标
   * @param e
   * @returns {boolean}
   */
  performCross (e) {
    const point = getCanvasPoint(e.targetTouches[0], this.tooltipChart.canvasDom)
    this.touchCrossPoint = { x: point.x, y: point.y }
    this.cross(this.touchCrossPoint)
  }

  /**
   * 执行延迟事件
   */
  postDelayDelayActiveCross () {
    this.delayTimeout = setTimeout(this.delayActiveCross, 200)
  }

  /**
   * 移除延迟事件
   */
  removeDelayActiveCross () {
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout)
      this.delayTimeout = null
    }
  }
}
export default TouchEvent
