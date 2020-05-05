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

import ChartSeries, { CANDLE_STICK_SERIES_TAG } from './series/ChartSeries'
import { isArray, clone } from './utils/typeChecks'
import { GraphicMarkType } from './data/ChartData'

export default class Chart {
  constructor (container, styleOptions) {
    this._chartSeries = new ChartSeries(container, styleOptions)
  }

  /**
   * 设置样式配置
   * @param options
   */
  setStyleOptions (options) {
    this._chartSeries.chartData().applyStyleOptions(options)
    this._chartSeries.measureSeriesSize()
  }

  /**
   * 获取样式配置
   * @returns {[]|*[]}
   */
  getStyleOptions () {
    return clone(this._chartSeries.chartData().styleOptions())
  }

  /**
   * 加载技术指标参数
   * @param technicalIndicatorType
   * @param params
   */
  setTechnicalIndicatorParams (technicalIndicatorType, params) {
    this._chartSeries.applyTechnicalIndicatorParams(technicalIndicatorType, params)
  }

  /**
   * 获取技术指标参数配置
   */
  getTechnicalIndicatorParamOptions () {
    return clone(this._chartSeries.chartData().technicalIndicatorParamOptions())
  }

  /**
   * 加载精度
   * @param pricePrecision
   * @param volumePrecision
   */
  setPrecision (pricePrecision, volumePrecision) {
    this._chartSeries.chartData().applyPrecision(pricePrecision, volumePrecision)
  }

  /**
   * 设置时区
   * @param timezone
   */
  setTimezone (timezone) {
    this._chartSeries.setTimezone(timezone)
  }

  /**
   * 重置尺寸，总是会填充父容器
   */
  resize () {
    this._chartSeries.measureSeriesSize()
  }

  /**
   * 设置右边间距
   * @param space
   */
  setOffsetRightSpace (space) {
    this._chartSeries.chartData().setOffsetRightSpace(space)
  }

  /**
   * 设置左边可见的最小bar数量
   * @param barCount
   */
  setLeftMinVisibleBarCount (barCount) {
    this._chartSeries.chartData().setLeftMinVisibleBarCount(barCount)
  }

  /**
   * 设置右边可见的最小bar数量
   * @param barCount
   */
  setRightMinVisibleBarCount (barCount) {
    this._chartSeries.chartData().setRightMinVisibleBarCount(barCount)
  }

  /**
   * 设置一条数据的空间
   * @param space
   */
  setDataSpace (space) {
    this._chartSeries.chartData().setDataSpace(space)
  }

  /**
   * 清空数据
   */
  clearData () {
    this._chartSeries.chartData().clearDataList()
  }

  /**
   * 获取数据源
   */
  getDataList () {
    return this._chartSeries.chartData().dataList()
  }

  /**
   * 添加新数据
   * @param dataList
   * @param more
   */
  applyNewData (dataList, more) {
    this._chartSeries.applyNewData(dataList, more)
  }

  /**
   * 添加历史更多数据
   * @param dataList
   * @param more
   */
  applyMoreData (dataList, more) {
    this._chartSeries.applyMoreData(dataList, more)
  }

  /**
   * 更新数据
   * @param data
   */
  setData (data, isClear) {
    this._chartSeries.setData(data, isClear)
  }

  /**
   * 更新数据
   * @param data
   */
  updateData (data) {
    this._chartSeries.updateData(data)
  }

  /**
   * 设置加载更多回调
   * @param cb
   */
  loadMore (cb) {
    this._chartSeries.chartData().loadMore(cb)
  }

  /**
   * 设置蜡烛图表类型
   * @param type
   */
  setCandleStickChartType (type) {
    this._chartSeries.setCandleStickSeriesType(type)
  }

  /**
   * 设置蜡烛图技术指标类型
   * @param technicalIndicatorType
   */
  setCandleStickTechnicalIndicatorType (technicalIndicatorType) {
    this._chartSeries.setTechnicalIndicatorType(CANDLE_STICK_SERIES_TAG, technicalIndicatorType)
  }

  /**
   * 设置技术指标类型
   * @param tag
   * @param technicalIndicatorType
   */
  setTechnicalIndicatorType (tag, technicalIndicatorType) {
    this._chartSeries.setTechnicalIndicatorType(tag, technicalIndicatorType)
  }

  /**
   * 添加一个技术指标
   * @param technicalIndicatorType
   * @param height
   * @param dragEnabled
   * @returns {string}
   */
  addTechnicalIndicator (technicalIndicatorType, height, dragEnabled) {
    return this._chartSeries.createTechnicalIndicator(technicalIndicatorType, height, dragEnabled)
  }

  /**
   * 移除一个技术指标
   * @param tag
   */
  removeTechnicalIndicator (tag) {
    this._chartSeries.removeTechnicalIndicator(tag)
  }

  /**
   * 设置图形标记数据
   * @param type
   * @param data
   */
  setGraphicMarkData (type, data) {
    if (isArray(data)) {
      const graphicMarkDatas = this._chartSeries.chartData().graphicMarkData()
      graphicMarkDatas[type] = data
      this._chartSeries.chartData().setGraphicMarkData(graphicMarkDatas)
    }
  }

  /**
   * 获取图形标记数据
   * @param type
   */
  getGraphicMarkData (type) {
    const graphicMarkDatas = this._chartSeries.chartData().graphicMarkData()
    return graphicMarkDatas[type]
  }

  /**
   * 添加图形标记
   * @param type
   */
  addGraphicMark (type) {
    const graphicMarkType = this._chartSeries.chartData().graphicMarkType()
    if (graphicMarkType !== type) {
      const graphicMarkDatas = this._chartSeries.chartData().graphicMarkData()
      const graphicMarkData = graphicMarkDatas[graphicMarkType]
      if (graphicMarkData && isArray(graphicMarkData)) {
        graphicMarkData.splice(graphicMarkData.length - 1, 1)
        graphicMarkDatas[graphicMarkType] = graphicMarkData
      }
      if (!graphicMarkDatas.hasOwnProperty(type)) {
        type = GraphicMarkType.NONE
      }
      this._chartSeries.chartData().setGraphicMarkType(type)
      this._chartSeries.chartData().setGraphicMarkData(graphicMarkDatas)
    }
  }

  /**
   * 移除所有标记图形
   */
  removeAllGraphicMark () {
    const graphicMarkDatas = this._chartSeries.chartData().graphicMarkData()
    const newGraphicMarkDatas = {}
    Object.keys(graphicMarkDatas).forEach(key => {
      newGraphicMarkDatas[key] = []
    })
    this._chartSeries.chartData().setGraphicMarkType(GraphicMarkType.NONE)
    this._chartSeries.chartData().setGraphicMarkData(newGraphicMarkDatas)
  }

  /**
   * 获取将图表装换成图片后的url
   * @param includeFloatLayer
   * @param includeGraphicMark
   * @param type
   * @param backgroundColor
   */
  getConvertPictureUrl (includeFloatLayer, includeGraphicMark, type, backgroundColor) {
    return this._chartSeries.getConvertPictureUrl(includeFloatLayer, includeGraphicMark, type, backgroundColor)
  }

  /**
   * 销毁
   */
  destroy () {
    this._chartSeries.destroy()
    delete this
  }
}
