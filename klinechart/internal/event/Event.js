class Event {
  constructor (
    tooltipChart, mainChart, volChart,
    subIndicatorChart, xAxisChart, dataProvider
  ) {
    this.tooltipChart = tooltipChart
    this.mainChart = mainChart
    this.volChart = volChart
    this.subIndicatorChart = subIndicatorChart
    this.xAxisChart = xAxisChart
    this.dataProvider = dataProvider
    this.viewPortHandler = tooltipChart.viewPortHandler
  }

  /**
   * 拖拽
   * @param eventPoint
   * @param dragX
   * @returns {boolean}
   */
  drag (eventPoint, dragX) {
    const dataSpace = this.dataProvider.dataSpace
    const dataSize = this.dataProvider.dataList.length
    const range = this.dataProvider.range
    let minPos = this.dataProvider.minPos
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
      this.dataProvider.minPos = minPos
      this.mainChart.flush()
      this.volChart.flush()
      this.subIndicatorChart.flush()
      this.xAxisChart.flush()
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
      this.dataProvider.minPos = minPos
      this.mainChart.flush()
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
    let range = this.dataProvider.range
    const maxRange = this.dataProvider.maxRange
    const minRange = this.dataProvider.minRange
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

    if (minPos + range > this.dataProvider.dataList.length || minPos < 0) {
      minPos = 0
    }
    this.dataProvider.range = range
    this.dataProvider.minPos = minPos
    this.dataProvider.space(this.viewPortHandler.contentRight() - this.viewPortHandler.contentLeft())
    this.mainChart.flush()
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
    this.dataProvider.crossPoint = { x: point.x, y: point.y }
    this.dataProvider.calcCurrentTooltipDataPos(this.viewPortHandler.contentLeft(), point.x)
    this.tooltipChart.flush()
  }
}

export default Event
