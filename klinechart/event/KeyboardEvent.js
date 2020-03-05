import Event from './Event'
import { stopEvent } from './eventHelper'

class KeyboardEvent extends Event {
  constructor (
    mainChart, volChart, subIndicatorChart,
    tooltipChart, markerChart, xAxisChart, dataProvider
  ) {
    super(tooltipChart, mainChart, volChart, subIndicatorChart, xAxisChart, dataProvider)
    this.markerChart = markerChart
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
        if (this.dataProvider.minPos > 0) {
          this.dataProvider.minPos--
          this.dataProvider.tooltipDataPos--
          shouldFlush = true
        }
      } else {
        // 右移
        if (this.dataProvider.minPos < this.dataProvider.dataList.length - this.dataProvider.range) {
          this.dataProvider.minPos++
          this.dataProvider.tooltipDataPos++
          shouldFlush = true
        }
      }
      if (shouldFlush) {
        this.mainChart.flush()
        this.volChart.flush()
        this.subIndicatorChart.flush()
        this.xAxisChart.flush()
        this.markerChart.flush()
        if (this.dataProvider.crossPoint) {
          this.tooltipChart.flush()
        }
        if (this.dataProvider.minPos === 0) {
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
      if (this.zoom(isZoomingOut, scaleX, this.dataProvider.minPos, this.dataProvider.range)) {
        if (this.dataProvider.crossPoint) {
          this.cross(this.dataProvider.crossPoint)
        }
        this.markerChart.flush()
      }
    }
  }
}

export default KeyboardEvent
