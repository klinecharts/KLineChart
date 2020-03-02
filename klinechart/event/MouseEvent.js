import Event from './Event'
import { stopEvent, isValidEvent, getCanvasPoint } from './eventHelper'

const CROSS = 'cross'
const DRAG = 'drag'

class MouseEvent extends Event {
  constructor (
    tooltipChart, mainChart, volChart,
    subIndicatorChart, xAxisChart,
    markerChart, dataProvider
  ) {
    super(tooltipChart, mainChart, volChart, subIndicatorChart, xAxisChart, dataProvider)
    this.markerChart = markerChart
    // 事件模型
    this.mouseMode = CROSS
    this.mouseDownPoint = { x: 0, y: 0 }
    this.documentMouseUp = () => {
      document.removeEventListener('mouseup', this.documentMouseUp, false)
      this.mouseMode = CROSS
      this.dataProvider.isDragMarker = false
      this.tooltipChart.flush()
    }
  }

  /**
   * 鼠标按下事件
   * @param e
   */
  mouseDown (e) {
    if (this.dataProvider.dataList.length === 0) {
      return
    }
    if (e.button === 0) {
      const point = getCanvasPoint(e, this.tooltipChart.canvasDom)
      if (!isValidEvent(point, this.viewPortHandler)) {
        return
      }
      document.addEventListener('mouseup', this.documentMouseUp, false)
      this.mouseDownPoint.x = e.x
      this.mouseDownPoint.y = e.y
      this.mouseMode = DRAG
      this.dataProvider.crossPoint = null
      this.tooltipChart.flush()
    }
  }

  /**
   * 鼠标抬起时事件
   * @param e
   */
  mouseUp (e) {
    if (this.dataProvider.dataList.length === 0) {
      return
    }
    stopEvent(e)
    const point = getCanvasPoint(e, this.tooltipChart.canvasDom)
    if (!isValidEvent(point, this.viewPortHandler)) {
      return
    }
    document.removeEventListener('mouseup', this.documentMouseUp, false)
    this.mouseMode = CROSS
    this.dataProvider.crossPoint = { x: point.x, y: point.y }
    this.dataProvider.isDragMarker = false
    this.tooltipChart.flush()
  }

  mouseLeave (e) {
    if (this.dataProvider.dataList.length === 0) {
      return
    }
    stopEvent(e)
    this.dataProvider.crossPoint = null
    this.tooltipChart.flush()
  }

  /**
   * 鼠标移动时事件
   * @param e
   * @param loadMore
   */
  mouseMove (e, loadMore) {
    if (this.dataProvider.dataList.length === 0) {
      return
    }
    stopEvent(e)
    const point = getCanvasPoint(e, this.tooltipChart.canvasDom)
    if (!isValidEvent(point, this.viewPortHandler)) {
      this.dataProvider.crossPoint = null
      this.tooltipChart.flush()
      return
    }
    if (!this.waitingForMouseMoveAnimationFrame) {
      this.waitingForMouseMoveAnimationFrame = true
      if (this.mouseMode === DRAG) {
        if (this.dataProvider.isDragMarker) {
          this.cross(point)
        } else {
          if (this.drag(this.mouseDownPoint, e.x, loadMore)) {
            this.markerChart.flush()
          }
        }
      } else if (this.mouseMode === CROSS) {
        this.cross(point)
      }
      this.waitingForMouseMoveAnimationFrame = false
    }
  }

  /**
   * 鼠标滚轮事件
   * @param e
   */
  mouseWheel (e) {
    if (this.dataProvider.dataList.length === 0 || this.dataProvider.isDragMarker) {
      return
    }
    stopEvent(e)
    const point = getCanvasPoint(e, this.tooltipChart.canvasDom)
    if (!isValidEvent(point, this.viewPortHandler)) {
      return
    }
    const touchStartPosition = this.dataProvider.minPos
    const touchRange = this.dataProvider.range
    const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY)))
    // 是否缩小
    const isZoomingOut = delta === 1
    let scaleX = 1
    if (isZoomingOut) {
      scaleX = 0.95
    } else {
      scaleX = 1.05
    }
    if (this.zoom(isZoomingOut, scaleX, touchStartPosition, touchRange)) {
      this.cross(point)
      this.markerChart.flush()
    }
  }
}

export default MouseEvent
