class Event {
  constructor (
    tooltipChart, candleChart, volChart,
    subIndicatorChart, xAxisChart, storage
  ) {
    this.tooltipChart = tooltipChart
    this.candleChart = candleChart
    this.volChart = volChart
    this.subIndicatorChart = subIndicatorChart
    this.xAxisChart = xAxisChart
    this.storage = storage
    this.handler = tooltipChart.handler
  }

  /**
   * 拖拽
   * @param eventPoint
   * @param dragX
   * @param loadMore
   * @returns {boolean}
   */
  drag (eventPoint, dragX, loadMore) {
    const dataSpace = this.storage.dataSpace
    const dataSize = this.storage.dataList.length
    const range = this.storage.range
    let minPos = this.storage.minPos
    const moveDist = dragX - eventPoint.x
    if (moveDist > dataSpace / 2) {
      if (minPos === 0 || dataSize < range) {
        return false
      }

      eventPoint.x = dragX

      let moveRange = +Math.abs(moveDist / dataSpace).toFixed(0)
      if (moveRange === 0) {
        moveRange = 1
      }

      minPos -= moveRange
      if (minPos < 0) {
        minPos = 0
      }
      this.storage.minPos = minPos
      this.candleChart.flush()
      this.volChart.flush()
      this.subIndicatorChart.flush()
      this.xAxisChart.flush()
      if (minPos === 0) {
        loadMore()
      }
      return true
    } else if (moveDist < 0 - dataSpace / 2) {
      if (minPos + range === dataSize || dataSize < range) {
        return false
      }

      eventPoint.x = dragX

      let moveRange = +Math.abs(moveDist / dataSpace).toFixed(0)
      if (moveRange === 0) {
        moveRange = 1
      }

      minPos += moveRange
      if (minPos >= dataSize - range) {
        minPos = dataSize - range
      }
      this.storage.minPos = minPos
      this.candleChart.flush()
      this.volChart.flush()
      this.subIndicatorChart.flush()
      this.xAxisChart.flush()
      return true
    }
    return false
  }

  /**
   * 缩放
   * @param isZoomingOut
   * @param scaleX
   * @param touchStartPosition
   * @param touchRange
   * @returns {boolean}
   */
  zoom (isZoomingOut, scaleX, touchStartPosition, touchRange) {
    let range = this.storage.range
    const maxRange = this.storage.maxRange
    const minRange = this.storage.minRange
    if (isZoomingOut) {
      if (range >= maxRange) {
        // 无法继续缩小
        return false
      }
    } else {
      if (range <= minRange) {
        // 无法继续放大
        return false
      }
    }

    // 计算缩放后的range大小
    range = +(touchRange / scaleX).toFixed(0)

    range = Math.min(Math.max(range, minRange), maxRange)
    let minPos = touchStartPosition + touchRange - range

    if (minPos + range > this.storage.dataList.length || minPos < 0) {
      minPos = 0
    }
    this.storage.range = range
    this.storage.minPos = minPos
    this.storage.space(this.handler.contentRight() - this.handler.contentLeft())
    this.candleChart.flush()
    this.volChart.flush()
    this.subIndicatorChart.flush()
    this.xAxisChart.flush()
    return true
  }

  /**
   * 十字光标
   * @param point
   */
  cross (point) {
    this.storage.crossPoint = { x: point.x, y: point.y }
    this.storage.calcCurrentTooltipDataPos(this.handler.contentLeft(), point.x)
    this.tooltipChart.flush()
  }
}

export default Event
