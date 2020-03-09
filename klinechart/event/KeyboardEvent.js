import Event from './Event'
import { stopEvent } from './eventHelper'

class KeyboardEvent extends Event {
  constructor (
    candleChart, volChart, subIndicatorChart,
    tooltipChart, graphicMarkChart, xAxisChart, storage
  ) {
    super(tooltipChart, candleChart, volChart, subIndicatorChart, xAxisChart, storage)
    this.graphicMarkChart = graphicMarkChart
  }

  /**
   * 按键按下事件
   * @param e
   * @param loadMore
   */
  keyDown (e, loadMore) {
    stopEvent(e)
    if (e.keyCode === 37 || e.keyCode === 39) {
      let shouldFlush = false
      if (e.keyCode === 37) {
        // 左移
        if (this.storage.minPos > 0) {
          this.storage.minPos--
          this.storage.tooltipDataPos--
          shouldFlush = true
        }
      } else {
        // 右移
        if (this.storage.minPos < this.storage.dataList.length - this.storage.range) {
          this.storage.minPos++
          this.storage.tooltipDataPos++
          shouldFlush = true
        }
      }
      if (shouldFlush) {
        this.candleChart.flush()
        this.volChart.flush()
        this.subIndicatorChart.flush()
        this.xAxisChart.flush()
        this.graphicMarkChart.flush()
        if (this.storage.crossPoint) {
          this.tooltipChart.flush()
        }
        if (this.storage.minPos === 0) {
          loadMore()
        }
      }
    } else if (e.keyCode === 38 || e.keyCode === 40) {
      let isZoomingOut = true
      let scaleX = 0.95
      if (e.keyCode === 38) {
        // 放大
        isZoomingOut = false
        scaleX = 1.05
      }
      if (this.zoom(isZoomingOut, scaleX, this.storage.minPos, this.storage.range)) {
        if (this.storage.crossPoint) {
          this.cross(this.storage.crossPoint)
        }
        this.graphicMarkChart.flush()
      }
    }
  }
}

export default KeyboardEvent
