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

import ChartPane, { TECHNICAL_INDICATOR_PANE } from './pane/ChartPane'
import { clone, isNumber, isValid, isArray } from './utils/typeChecks'
import { DEV } from './utils/env'
import './utils/extension'

export default class Chart {
  constructor (container, styleOptions) {
    this._chartPane = new ChartPane(container, styleOptions)
  }

  /**
   * 设置样式配置
   * @param options
   */
  setStyleOptions (options) {
    if (options) {
      this._chartPane.chartData().applyStyleOptions(options)
      this._chartPane.adjustPaneViewport(true, true, true, true, true)
    }
  }

  /**
   * 获取样式配置
   * @returns {[]|*[]}
   */
  getStyleOptions () {
    return clone(this._chartPane.chartData().styleOptions())
  }

  /**
   * 覆盖技术指标
   * @param override
   */
  overrideTechnicalIndicator (override) {
    this._chartPane.overrideTechnicalIndicator(override)
  }

  /**
   * 获取技术指标信息
   * @param technicalIndicatorType
   * @return {{}|{series: *, calcParams: *, precision: *, name: *}}
   */
  getTechnicalIndicatorInfo (technicalIndicatorType) {
    return this._chartPane.chartData().technicalIndicatorInfo(technicalIndicatorType)
  }

  /**
   * 设置价格数量精度
   * @param pricePrecision
   * @param volumePrecision
   */
  setPriceVolumePrecision (pricePrecision, volumePrecision) {
    if (!isValid(pricePrecision) || !isNumber(pricePrecision) || pricePrecision < 0) {
      if (DEV) {
        console.warn('setPriceVolumePrecision -> Invalid parameter: pricePrecision!!!')
      }
      return
    }
    if (!isValid(volumePrecision) || !isNumber(volumePrecision) || volumePrecision < 0) {
      if (DEV) {
        console.warn('setPriceVolumePrecision -> Invalid parameter: volumePrecision!!!')
      }
      return
    }
    this._chartPane.chartData().applyPriceVolumePrecision(pricePrecision, volumePrecision)
  }

  /**
   * 设置时区
   * @param timezone
   */
  setTimezone (timezone) {
    this._chartPane.setTimezone(timezone)
  }

  /**
   * 获取当前时区
   */
  getTimezone () {
    return this._chartPane.chartData().timezone()
  }

  /**
   * 重置尺寸，总是会填充父容器
   */
  resize () {
    this._chartPane.adjustPaneViewport(true, true, true, true, true)
  }

  /**
   * 设置右边间距
   * @param space
   */
  setOffsetRightSpace (space) {
    this._chartPane.chartData().setOffsetRightSpace(space)
  }

  /**
   * 设置左边可见的最小bar数量
   * @param barCount
   */
  setLeftMinVisibleBarCount (barCount) {
    if (!isValid(barCount) || !isNumber(barCount) || barCount <= 0) {
      if (DEV) {
        console.warn('setLeftMinVisibleBarCount -> Invalid parameter: barCount!!!')
      }
      return
    }
    this._chartPane.chartData().setLeftMinVisibleBarCount(Math.ceil(barCount))
  }

  /**
   * 设置右边可见的最小bar数量
   * @param barCount
   */
  setRightMinVisibleBarCount (barCount) {
    if (!isValid(barCount) || !isNumber(barCount) || barCount <= 0) {
      if (DEV) {
        console.warn('setRightMinVisibleBarCount -> Invalid parameter: barCount!!!')
      }
      return
    }
    this._chartPane.chartData().setRightMinVisibleBarCount(Math.ceil(barCount))
  }

  /**
   * 设置一条数据的空间
   * @param space
   */
  setDataSpace (space) {
    this._chartPane.chartData().setDataSpace(space)
  }

  /**
   * 清空数据
   */
  clearData () {
    this._chartPane.chartData().clearDataList()
  }

  /**
   * 获取数据源
   */
  getDataList () {
    return this._chartPane.chartData().dataList()
  }

  /**
   * 添加新数据
   * @param dataList
   * @param more
   */
  applyNewData (dataList, more) {
    if (!isArray(dataList)) {
      if (DEV) {
        console.warn('applyNewData -> Invalid parameter: dataList, dataList be an array!!!')
      }
      return
    }
    this._chartPane.applyNewData(dataList, more)
  }

  /**
   * 添加历史更多数据
   * @param dataList
   * @param more
   */
  applyMoreData (dataList, more) {
    if (!isArray(dataList)) {
      if (DEV) {
        console.warn('applyMoreData -> Invalid parameter:dataList, dataList be an array!!!')
      }
      return
    }
    this._chartPane.applyMoreData(dataList, more)
  }

  /**
   * 更新数据
   * @param data
   */
  updateData (data) {
    this._chartPane.updateData(data)
  }

  /**
   * 设置加载更多回调
   * @param cb
   */
  loadMore (cb) {
    this._chartPane.chartData().loadMore(cb)
  }

  /**
   * 设置技术指标类型
   * @param technicalIndicatorType
   * @param isStack
   * @param paneId
   */
  setTechnicalIndicatorType (technicalIndicatorType, isStack, paneId) {
    this._chartPane.setTechnicalIndicatorType(technicalIndicatorType, isStack, paneId)
  }

  /**
   * 获取指标类型
   * @param paneId
   * @return {[]}
   */
  getTechnicalIndicatorType (paneId) {
    return this._chartPane.getTechnicalIndicatorType(paneId)
  }

  /**
   * 创建一个技术指标
   * @param type
   * @param options
   * @returns {string|null}
   */
  createPane (type = TECHNICAL_INDICATOR_PANE, options) {
    if (type === TECHNICAL_INDICATOR_PANE) {
      return this._chartPane.createPane(type, options)
    }
    if (DEV) {
      console.warn('createPane -> Invalid parameter: type, type only support technicalIndicator!!!')
    }
    return null
  }

  /**
   * 添加自定义技术指标
   * @param technicalIndicatorInfo
   */
  addCustomTechnicalIndicator (technicalIndicatorInfo) {
    this._chartPane.chartData().addCustomTechnicalIndicator(technicalIndicatorInfo)
  }

  /**
   * 移除一个技术指标
   * @param technicalIndicatorType
   * @param paneId
   */
  removeTechnicalIndicator (technicalIndicatorType, paneId) {
    this._chartPane.removeTechnicalIndicator(technicalIndicatorType, paneId)
  }

  /**
   * 添加图形标记
   * @param type
   */
  addGraphicMark (type) {
    const graphicMarkMapping = this._chartPane.chartData().graphicMarkMapping()
    if (!(type in graphicMarkMapping)) {
      if (DEV) {
        console.warn('addGraphicMark -> Invalid parameter: type, type not found!!!')
      }
      return
    }
    this._chartPane.addGraphicMark(type)
  }

  /**
   * 移除所有标记图形
   */
  removeAllGraphicMark () {
    this._chartPane.chartData().clearGraphicMark()
  }

  /**
   * 设置是否可以缩放
   * @param enabled
   */
  setZoomEnabled (enabled) {
    this._chartPane.chartData().setZoomEnabled(enabled)
  }

  /**
   * 是否可以缩放
   * @return {boolean}
   */
  isZoomEnabled () {
    return this._chartPane.chartData().zoomEnabled()
  }

  /**
   * 设置是否可以拖拽滚动
   * @param enabled
   */
  setScrollEnabled (enabled) {
    this._chartPane.chartData().setScrollEnabled(enabled)
  }

  /**
   * 是否可以拖拽滚动
   * @return {boolean}
   */
  isScrollEnabled () {
    return this._chartPane.chartData().scrollEnabled()
  }

  /**
   * 订阅绘制事件
   * @param type
   * @param callback
   */
  subscribeDrawAction (type, callback) {
    const delegate = this._chartPane.chartData().drawActionDelegate(type)
    if (!delegate) {
      if (DEV) {
        console.warn('subscribeDrawAction -> Invalid parameter: type, type does not exist!!!')
      }
      return
    }
    delegate.subscribe(callback)
  }

  /**
   * 取消订阅绘制事件
   * @param type
   * @param callback
   */
  unsubscribeDrawAction (type, callback) {
    const delegate = this._chartPane.chartData().drawActionDelegate(type)
    if (!delegate) {
      if (DEV) {
        console.warn('unsubscribeDrawAction -> Invalid parameter: type, does not exist!!!')
      }
      return
    }
    delegate.unsubscribe(callback)
  }

  /**
   * 获取将图表装换成图片后的url
   * @param includeFloatLayer
   * @param includeGraphicMark
   * @param type
   * @param backgroundColor
   */
  getConvertPictureUrl (includeFloatLayer, includeGraphicMark, type = 'jpeg', backgroundColor = '#333333') {
    if (type !== 'png' && type !== 'jpeg' && type !== 'bmp') {
      if (DEV) {
        console.warn('Picture format only supports jpeg, png and bmp!!!')
      }
      return
    }
    return this._chartPane.getConvertPictureUrl(includeFloatLayer, includeGraphicMark, type, backgroundColor)
  }

  /**
   * 销毁
   */
  destroy () {
    this._chartPane.destroy()
    delete this
  }
}
