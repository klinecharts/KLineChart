import MainChart from './MainChart'
import MarkerChart from './MarkerChart'
import IndicatorChart from './IndicatorChart'
import TooltipChart from './TooltipChart'
import XAxisChart from './XAxisChart'
import { isArray, isFunction, isNumber, isBoolean, merge } from '../utils/dataUtils'
import { calcTextWidth, requestAnimationFrame } from '../utils/drawUtils'
import calcIndicator from '../internal/calcIndicator'

import DataProvider from '../internal/DataProvider'

import { getDefaultStyle, getDefaultIndicatorParams, getDefaultPrecision, getDefaultPeriod } from '../internal/config'
import { isMobile } from '../utils/platformUtils'
import TouchEvent from '../event/TouchEvent'
import MouseEvent from '../event/MouseEvent'
import MarkerEvent from '../event/MarkerEvent'
import KeyboardEvent from '../event/KeyboardEvent'

import { IndicatorType, YAxisPosition, YAxisTextPosition, MarkerType, ChartType } from '../internal/constants'

class RootChart {
  constructor (dom, s = {}) {
    // 是否没有更多
    this.noMore = true
    this.style = getDefaultStyle()
    merge(this.style, s)
    this.indicatorParams = getDefaultIndicatorParams()
    this.precision = getDefaultPrecision()
    this.period = getDefaultPeriod()
    dom.style.position = 'relative'
    dom.style.outline = 'none'
    dom.style.borderStyle = 'none'
    dom.tabIndex = 1
    this.dom = dom
    this.dataProvider = new DataProvider()
    this.xAxisChart = new XAxisChart(dom, this.style, this.dataProvider, this.period)
    this.mainChart = new MainChart(dom, this.style, this.dataProvider, this.indicatorParams, this.precision)
    this.markerChart = new MarkerChart(dom, this.style, this.dataProvider, this.mainChart.yAxisRender, this.precision)
    this.volIndicatorChart = new IndicatorChart(dom, this.style, this.dataProvider, this.indicatorParams, IndicatorType.VOL)
    this.subIndicatorChart = new IndicatorChart(dom, this.style, this.dataProvider, this.indicatorParams)
    this.tooltipChart = new TooltipChart(
      dom, this.style,
      this.mainChart, this.volIndicatorChart, this.subIndicatorChart,
      this.xAxisChart, this.dataProvider, this.indicatorParams, this.precision
    )
    this.calcChartDimensions()
    this.initEvent()
  }

  /**
   * 初始化事件
   */
  initEvent () {
    const mobile = isMobile(window.navigator.userAgent)
    this.dom.addEventListener('contextmenu', (e) => { e.preventDefault() }, false)
    const loadMore = () => {
      // 有更多并且没有在加载则去加载更多
      if (!this.noMore && !this.loading && this.loadMoreCallback && isFunction(this.loadMoreCallback)) {
        this.loading = true
        this.loadMoreCallback((this.dataProvider.dataList[0] || {}).timestamp)
      }
    }
    if (mobile) {
      const motionEvent = new TouchEvent(
        this.tooltipChart, this.mainChart,
        this.volIndicatorChart, this.subIndicatorChart,
        this.xAxisChart, this.dataProvider
      )
      this.dom.addEventListener('touchstart', (e) => { motionEvent.touchStart(e) }, false)
      this.dom.addEventListener('touchmove', (e) => {
        motionEvent.touchMove(e, loadMore)
      }, false)
      this.dom.addEventListener('touchend', (e) => { motionEvent.touchEnd(e) }, false)
    } else {
      const motionEvent = new MouseEvent(
        this.tooltipChart, this.mainChart,
        this.volIndicatorChart, this.subIndicatorChart,
        this.xAxisChart, this.markerChart, this.dataProvider
      )
      const markerEvent = new MarkerEvent(this.dataProvider, this.markerChart, this.style)
      const keyboardEvent = new KeyboardEvent(
        this.mainChart, this.volIndicatorChart, this.subIndicatorChart,
        this.tooltipChart, this.markerChart, this.xAxisChart, this.dataProvider
      )
      this.dom.addEventListener('mousedown', (e) => {
        motionEvent.mouseDown(e)
        markerEvent.mouseDown(e)
      }, false)
      this.dom.addEventListener('mouseup', (e) => {
        motionEvent.mouseUp(e)
        markerEvent.mouseUp(e)
      }, false)
      this.dom.addEventListener('mousemove', (e) => {
        motionEvent.mouseMove(e, loadMore)
        markerEvent.mouseMove(e)
      }, false)
      this.dom.addEventListener('mouseleave', (e) => { motionEvent.mouseLeave(e) }, false)
      this.dom.addEventListener('wheel', (e) => { motionEvent.mouseWheel(e) }, false)
      this.dom.addEventListener('keydown', (e) => {
        keyboardEvent.keyDown(e, loadMore)
      }, false)
    }
  }

  /**
   * 刷新图
   * @param charts
   */
  flushCharts (charts = []) {
    for (const chart of charts) {
      chart.flush()
    }
  }

  /**
   * 计算图的尺寸
   */
  calcChartDimensions () {
    const xAxisHeight = this.calcXAxisHeight()
    const yAxisWidth = this.calcYAxisWidth()
    const domWidth = this.dom.offsetWidth
    const domHeight = this.dom.offsetHeight
    this.domWidth = domWidth
    this.domHeight = domHeight
    const contentHeight = domHeight - xAxisHeight
    let chartTop = 0
    let volChartHeight = 0
    let subIndicatorChartHeight = 0
    const isShowVolIndicator = this.volIndicatorChart.indicatorType !== IndicatorType.NO
    const isShowSubIndicator = this.subIndicatorChart.indicatorType !== IndicatorType.NO
    if (isShowVolIndicator && isShowSubIndicator) {
      const height = +((contentHeight * 0.18).toFixed(0))
      volChartHeight = height
      subIndicatorChartHeight = height
    } else if ((!isShowVolIndicator && isShowSubIndicator) || (isShowVolIndicator && !isShowSubIndicator)) {
      const height = +((contentHeight * 0.26).toFixed(0))
      if (isShowVolIndicator) {
        volChartHeight = height
      } else {
        subIndicatorChartHeight = height
      }
    }
    let offsetLeft = 0
    let offsetRight = 0
    if (this.style.yAxis.position === YAxisPosition.LEFT) {
      offsetLeft = yAxisWidth
    } else {
      offsetRight = yAxisWidth
    }
    this.dataProvider.space(domWidth - offsetRight - offsetLeft)
    this.xAxisChart.setChartDimensions(0, domWidth, domHeight, offsetLeft, offsetRight, 0, xAxisHeight)
    const mainChartHeight = contentHeight - volChartHeight - subIndicatorChartHeight
    this.mainChart.setChartDimensions(chartTop, domWidth, mainChartHeight, offsetLeft, offsetRight)
    this.markerChart.setChartDimensions(chartTop, domWidth, mainChartHeight, offsetLeft, offsetRight)
    chartTop += mainChartHeight
    this.volIndicatorChart.setChartDimensions(chartTop, domWidth, volChartHeight, offsetLeft, offsetRight)
    chartTop += volChartHeight
    this.subIndicatorChart.setChartDimensions(chartTop, domWidth, subIndicatorChartHeight, offsetLeft, offsetRight)
    this.tooltipChart.setChartDimensions(0, domWidth, domHeight, offsetLeft, offsetRight, 0, xAxisHeight)
  }

  /**
   * 计算x轴高度
   */
  calcXAxisHeight () {
    const xAxis = this.style.xAxis
    const tickText = xAxis.tick.text
    const tickLine = xAxis.tick.line
    let height = tickText.size + tickText.margin
    if (xAxis.display && tickLine.display) {
      height += tickLine.length
    }
    if (xAxis.display && xAxis.line.display) {
      height += xAxis.line.size
    }
    height = Math.max(xAxis.minHeight, Math.min(height, xAxis.maxHeight))
    return (+Math.ceil(Number(height)).toFixed(0))
  }

  /**
   * 计算y轴宽度
   */
  calcYAxisWidth () {
    const yAxis = this.style.yAxis
    const tickText = yAxis.tick.text
    const tickLine = yAxis.tick.line
    const needsOffset = (((tickText.display || tickLine.display || tickText.margin > 0) && tickText.position === YAxisTextPosition.OUTSIDE) || yAxis.line.display) && yAxis.display
    if (needsOffset) {
      let width = 0
      if (tickText.position === YAxisTextPosition.OUTSIDE) {
        width += calcTextWidth(tickText.size, '0000000') + tickText.margin
        if (yAxis.display && tickLine.display) {
          width += tickLine.length
        }
      }
      const axisLineSize = yAxis.line.size
      if (yAxis.display && yAxis.line.display) {
        width += axisLineSize
      }
      if (width > axisLineSize) {
        width = Math.max(yAxis.minWidth, Math.min(width, yAxis.maxWidth))
      }
      return Math.ceil(width)
    }
    return 0
  }

  /**
   * 计算图表指标
   */
  calcChartIndicator () {
    if (this.mainChart.chartType === ChartType.REAL_TIME) {
      if (this.style.realTime.averageLine.display) {
        this.dataProvider.dataList = calcIndicator.average(this.dataProvider.dataList)
        this.flushCharts([this.mainChart])
      }
    } else {
      if (this.mainChart.indicatorType !== IndicatorType.NO) {
        this.calcIndicator(this.mainChart.indicatorType, this.mainChart)
      }
    }
    if (this.volIndicatorChart.indicatorType !== IndicatorType.NO) {
      this.calcIndicator(IndicatorType.VOL, this.volIndicatorChart)
    }
    if (this.subIndicatorChart.indicatorType !== IndicatorType.NO) {
      this.calcIndicator(this.subIndicatorChart.indicatorType, this.subIndicatorChart)
    }
  }

  /**
   * 计算指标
   * @param indicatorType
   * @param chart
   */
  calcIndicator (indicatorType, chart) {
    Promise.resolve().then(() => {
      const calc = calcIndicator[indicatorType]
      if (isFunction(calc)) {
        this.dataProvider.dataList = calc(this.dataProvider.dataList, this.indicatorParams[indicatorType])
        this.flushCharts([chart, this.tooltipChart])
      }
    })
  }

  /**
   * 调整尺寸
   */
  resize () {
    if (this.domWidth !== this.dom.offsetWidth || this.domHeight !== this.dom.offsetHeight) {
      requestAnimationFrame(() => {
        this.calcChartDimensions()
      })
    }
  }

  /**
   * 添加数据集合
   * @param data
   * @param pos
   * @param noMore
   */
  addData (data, pos = this.dataProvider.dataList.length, noMore) {
    if (pos <= 0) {
      // 当添加的数据是从0的位置开始时，则判断是在加载更多的数据请求来的，将loading重置为未加载状态
      this.loading = false
    }
    if (isBoolean(noMore)) {
      this.noMore = noMore
    }
    this.dataProvider.addData(data, pos)
    this.calcChartIndicator()
    this.xAxisChart.flush()
  }

  /**
   * 设置样式
   * @param s
   */
  setStyle (s = {}) {
    merge(this.style, s)
    this.calcChartDimensions()
  }

  /**
   * 设置主图类型
   * @param chartType
   */
  setMainChartType (chartType) {
    if (this.mainChart.chartType !== chartType) {
      this.mainChart.chartType = chartType
      if (chartType === ChartType.REAL_TIME && this.style.realTime.averageLine.display) {
        this.dataProvider.dataList = calcIndicator.average(this.dataProvider.dataList)
      }
      this.flushCharts([this.mainChart, this.tooltipChart])
      this.clearAllMarker()
    }
  }

  /**
   * 设置主图指标
   * @param indicatorType
   */
  setMainIndicatorType (indicatorType) {
    if (this.mainChart.indicatorType !== indicatorType) {
      this.mainChart.indicatorType = indicatorType
      if (indicatorType === IndicatorType.NO) {
        this.flushCharts([this.mainChart])
      } else {
        this.calcIndicator(indicatorType, this.mainChart)
      }
    }
  }

  /**
   * 设置副图指标
   * @param indicatorType
   */
  setSubIndicatorType (indicatorType) {
    if (this.subIndicatorChart.indicatorType !== indicatorType) {
      const shouldCalcChartHeight = indicatorType === IndicatorType.NO || this.subIndicatorChart.indicatorType === IndicatorType.NO
      this.subIndicatorChart.indicatorType = indicatorType
      if (shouldCalcChartHeight) {
        this.calcChartDimensions()
      }
      if (indicatorType !== IndicatorType.NO) {
        this.calcIndicator(indicatorType, this.subIndicatorChart)
      }
    }
  }

  /**
   * 设置指标参数
   * @param indicatorType
   * @param params
   */
  setIndicatorParams (indicatorType, params) {
    if (!this.indicatorParams.hasOwnProperty(indicatorType) ||
      (indicatorType !== IndicatorType.MA &&
      indicatorType !== IndicatorType.VOL &&
      params.length !== this.indicatorParams[indicatorType].length)) {
      return
    }
    this.indicatorParams[indicatorType] = params
    if (this.getMainIndicatorType() === indicatorType) {
      this.calcIndicator(indicatorType, this.mainChart)
    }
    if (this.isShowVolChart() && indicatorType === IndicatorType.VOL) {
      this.calcIndicator(indicatorType, this.volIndicatorChart)
    }
    if (this.getSubIndicatorType() === indicatorType) {
      this.calcIndicator(indicatorType, this.subIndicatorChart)
    }
  }

  /**
   * 获取指标参数
   * @returns {{DMI: number[], OBV: [number], SAR: number[], BIAS: number[], MTM: number[], CCI: [number], RSI: number[], TRIX: number[], CR: number[], EMV: number[], KDJ: number[], VOL: number[], BOLL: [number], MA: number[], MACD: number[], PSY: [number], DMA: number[], WR: number[], VR: number[], BRAR: [number]}}
   */
  getIndicatorParams (indicatorType) {
    if (indicatorType) {
      return this.indicatorParams[indicatorType] || []
    }
    return this.indicatorParams
  }

  /**
   * 设置精度
   * @param pricePrecision
   * @param volumePrecision
   */
  setPrecision (pricePrecision = this.precision.pricePrecision, volumePrecision = this.precision.volumePrecision) {
    this.precision.pricePrecision = pricePrecision
    this.precision.volumePrecision = volumePrecision
  }

  /**
   * 设置k线周期
   * @param period
   */
  setPeriod (period) {
    if (period && (/^[1-9]*?[DWMY]?$/i).test(period)) {
      this.period.period = period
    }
  }

  /**
   * 显示成交量图
   * @param isShow
   */
  showVolChart (isShow) {
    const isShowVol = this.volIndicatorChart.indicatorType !== IndicatorType.NO
    if (isShow !== isShowVol) {
      this.volIndicatorChart.indicatorType = isShow ? IndicatorType.VOL : IndicatorType.NO
      this.calcChartDimensions()
      if (isShow) {
        this.calcIndicator(IndicatorType.VOL, this.volIndicatorChart)
      }
    }
  }

  /**
   * 设置默认的range
   * @param range
   */
  setDefaultRange (range) {
    if (isNumber(range) && range >= this.dataProvider.minRange && range <= this.dataProvider.maxRange) {
      this.dataProvider.range = range
      this.dataProvider.space(this.tooltipChart.viewPortHandler.contentRight() - this.tooltipChart.viewPortHandler.contentLeft())
      if (this.dataProvider.minPos + range > this.dataProvider.dataList.length) {
        this.dataProvider.minPos = this.dataProvider.dataList.length - range
        if (this.dataProvider.minPos < 0) {
          this.dataProvider.minPos = 0
        }
      }
      this.flushCharts([this.mainChart, this.volIndicatorChart, this.subIndicatorChart, this.xAxisChart])
    }
  }

  /**
   * 设置最小range
   * @param range
   */
  setMinRange (range) {
    if (isNumber(range) && range <= this.dataProvider.range) {
      this.dataProvider.minRange = range
    }
  }

  /**
   * 设置最大range
   * @param range
   */
  setMaxRange (range) {
    if (isNumber(range) && range >= this.dataProvider.range) {
      this.dataProvider.maxRange = range
    }
  }

  /**
   * 获取主图指标类型
   * @returns {string}
   */
  getMainIndicatorType () {
    return this.mainChart.indicatorType
  }

  /**
   * 获取附图指标类型
   * @returns {string}
   */
  getSubIndicatorType () {
    return this.subIndicatorChart.indicatorType
  }

  /**
   * 成交量图是否显示
   * @returns {boolean}
   */
  isShowVolChart () {
    return this.volIndicatorChart.indicatorType !== IndicatorType.NO
  }

  /**
   * 获取数据集合
   * @returns {Array}
   */
  getDataList () {
    return this.dataProvider.dataList
  }

  /**
   * 获取当前样式
   * @returns {{indicator, yAxis, xAxis, grid, candle, tooltip}}
   */
  getStyle () {
    return this.style
  }

  /**
   * 清空数据
   */
  clearData () {
    this.dataProvider.dataList = []
  }

  /**
   * 绘制标记图形
   * @param markerType
   */
  drawMarker (markerType) {
    // 如果当前是正在绘制其它的线模型，则清除掉当前正在绘制的数据
    const currentMarkerType = this.dataProvider.currentMarkerType
    if (currentMarkerType !== markerType) {
      const markerData = this.dataProvider.markerDatas[currentMarkerType]
      if (markerData && isArray(markerData)) {
        markerData.splice(markerData.length - 1, 1)
        this.dataProvider.markerDatas[currentMarkerType] = markerData
        this.tooltipChart.flush()
      }
    }
    this.dataProvider.currentMarkerType = markerType
  }

  /**
   * 清空所有标记图形
   */
  clearAllMarker () {
    const markerDatas = this.dataProvider.markerDatas
    Object.keys(markerDatas).forEach(key => {
      this.dataProvider.markerDatas[key] = []
    })
    this.dataProvider.currentMarkerType = MarkerType.NONE
    this.markerChart.flush()
  }

  /**
   * 加载更多
   * @param cb
   */
  loadMore (cb) {
    this.loadMoreCallback = cb
  }

  /**
   * 获取图表转换为图片后url
   * @param type
   * @param excludes
   */
  getConvertPictureUrl (type = 'jpeg', excludes = []) {
    if (type !== 'png' && type !== 'jpeg' && type !== 'bmp') {
      throw new Error('Picture format only supports jpeg, png and bmp!!!')
    }
    const c = document.createElement('canvas')
    const xAxisCanvas = this.xAxisChart.canvasDom
    const mainCanvas = this.mainChart.canvasDom
    const volCanvas = this.volIndicatorChart.canvasDom
    const indicatorCanvas = this.subIndicatorChart.canvasDom
    const tooltipCanvas = this.tooltipChart.canvasDom
    c.width = tooltipCanvas.width
    c.height = tooltipCanvas.height
    c.style.width = tooltipCanvas.style.width
    c.style.height = tooltipCanvas.style.height
    const ctx = c.getContext('2d')
    ctx.drawImage(xAxisCanvas, 0, 0, xAxisCanvas.width, xAxisCanvas.height)
    if (!excludes || excludes.indexOf('candle') < 0) {
      ctx.drawImage(mainCanvas, 0, 0, mainCanvas.width, mainCanvas.height)
    }
    if (!excludes || excludes.indexOf('vol') < 0) {
      ctx.drawImage(volCanvas, 0, mainCanvas.height, volCanvas.width, volCanvas.height)
    }
    if (!excludes || excludes.indexOf('subIndicator') < 0) {
      ctx.drawImage(indicatorCanvas, 0, mainCanvas.height + volCanvas.height, indicatorCanvas.width, indicatorCanvas.height)
    }
    if (!excludes || excludes.indexOf('marker') < 0) {
      const markerCanvas = this.markerChart.canvasDom
      ctx.drawImage(markerCanvas, 0, 0, markerCanvas.width, markerCanvas.height)
    }
    if (!excludes || excludes.indexOf('tooltip') < 0) {
      ctx.drawImage(tooltipCanvas, 0, 0, tooltipCanvas.width, tooltipCanvas.height)
    }
    return c.toDataURL(`image/${type}`)
  }
}

export default RootChart
