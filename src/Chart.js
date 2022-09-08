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

import ChartPane, { CANDLE_PANE_ID } from './pane/ChartPane'
import { clone, isNumber, isObject, isArray, isFunction, isValid, isString } from './utils/typeChecks'
import { logWarn } from './utils/logger'
import { requestAnimationFrame } from './utils/compatible'
import { formatValue } from './utils/format'
import { binarySearchNearest } from './utils/number'

import { hasAction } from './enum/ActionType'

export default class Chart {
  constructor (container, styleOptions) {
    this._chartPane = new ChartPane(container, styleOptions)
  }

  /**
   * 获取dom
   * @param finder
   * @returns
   */
  getDom (finder) {
    if (finder) {
      if (!isObject(finder)) {
        logWarn('getDom', 'options', 'options must be an object!!!')
        return null
      }
      const { paneId, position } = finder
      const pane = this._chartPane.getPane(paneId)
      if (!pane) {
        logWarn('getDom', 'options.paneId', 'can not find the corresponding pane!!!')
        return null
      }
      return pane.container(position) || null
    }
    return this._chartPane.getContainer()
  }

  /**
   * 获取宽尺寸
   * @return {*|{}}
   */
  getWidth () {
    return this._chartPane.chartWidth()
  }

  /**
   * 获取高度尺寸
   * @return {*|{}}
   */
  getHeight () {
    return this._chartPane.chartHeight()
  }

  /**
   * 设置样式配置
   * @param options 配置
   */
  setStyleOptions (options) {
    if (!isObject(options)) {
      logWarn('setStyleOptions', 'options')
      return
    }
    this._chartPane.chartStore().applyStyleOptions(options)
    this._chartPane.adjustPaneViewport(true, true, true, true, true)
  }

  /**
   * 获取样式配置
   * @returns {[]|*[]}
   */
  getStyleOptions () {
    return clone(this._chartPane.chartStore().styleOptions())
  }

  /**
   * 设置价格数量精度
   * @param pricePrecision 价格精度
   * @param volumePrecision 数量精度
   */
  setPriceVolumePrecision (pricePrecision, volumePrecision) {
    if (!isNumber(pricePrecision) || pricePrecision < 0) {
      logWarn('setPriceVolumePrecision', 'pricePrecision', 'pricePrecision must be a number and greater than zero!!!')
      return
    }
    if (!isNumber(volumePrecision) || volumePrecision < 0) {
      logWarn('setPriceVolumePrecision', 'volumePrecision', 'volumePrecision must be a number and greater than zero!!!')
      return
    }
    this._chartPane.chartStore().setPriceVolumePrecision(pricePrecision, volumePrecision)
  }

  /**
   * 设置时区
   * @param timezone 时区
   */
  setTimezone (timezone) {
    this._chartPane.setTimezone(timezone)
  }

  /**
   * 获取当前时区
   */
  getTimezone () {
    return this._chartPane.chartStore().timeScaleStore().timezone()
  }

  /**
   * 重置尺寸，总是会填充父容器
   */
  resize () {
    this._chartPane.adjustPaneViewport(true, true, true, true, true)
  }

  /**
   * 设置右边间距
   * @param space 空间大小
   */
  setOffsetRightSpace (space) {
    if (!isNumber(space)) {
      logWarn('setOffsetRightSpace', 'space', 'space must be a number!!!')
      return
    }
    this._chartPane.chartStore().timeScaleStore().setOffsetRightSpace(space, true)
  }

  /**
   * 设置左边可见的最小bar数量
   * @param barCount bar数量
   */
  setLeftMinVisibleBarCount (barCount) {
    if (!isNumber(barCount) || barCount <= 0) {
      logWarn('setLeftMinVisibleBarCount', 'barCount', 'barCount must be a number and greater than zero!!!')
      return
    }
    this._chartPane.chartStore().timeScaleStore().setLeftMinVisibleBarCount(Math.ceil(barCount))
  }

  /**
   * 设置右边可见的最小bar数量
   * @param barCount bar数量
   */
  setRightMinVisibleBarCount (barCount) {
    if (!isNumber(barCount) || barCount <= 0) {
      logWarn('setRightMinVisibleBarCount', 'barCount', 'barCount must be a number and greater than zero!!!')
      return
    }
    this._chartPane.chartStore().timeScaleStore().setRightMinVisibleBarCount(Math.ceil(barCount))
  }

  /**
   * 设置一条数据的空间
   * @param space 空间大小
   */
  setDataSpace (space) {
    if (!isNumber(space)) {
      logWarn('setDataSpace', 'space', 'space must be a number!!!')
      return
    }
    this._chartPane.chartStore().timeScaleStore().setDataSpace(space)
  }

  /**
   * 获取单条数据的空间
   * @returns
   */
  getDataSpace () {
    return this._chartPane.chartStore().timeScaleStore().dataSpace()
  }

  /**
   * 获取单条数据绘制的空间
   * @returns
   */
  getBarSpace () {
    return this._chartPane.chartStore().timeScaleStore().barSpace()
  }

  /**
   * 清空数据
   */
  clearData () {
    this._chartPane.chartStore().clearDataList()
  }

  /**
   * 获取数据源
   */
  getDataList () {
    return this._chartPane.chartStore().dataList()
  }

  /**
   * 添加新数据
   * @param dataList k线数据数组
   * @param more 是否还有更多标识
   */
  applyNewData (dataList, more) {
    if (!isArray(dataList)) {
      logWarn('applyNewData', 'dataList', 'dataList must be an array!!!')
      return
    }
    const chartStore = this._chartPane.chartStore()
    chartStore.clearDataList()
    chartStore.addData(dataList, 0, more)
    chartStore.technicalIndicatorStore().calcInstance().finally(
      _ => {
        this._chartPane.adjustPaneViewport(false, true, true, true)
      }
    )
  }

  /**
   * 添加历史更多数据
   * @param dataList k线数据数组
   * @param more 是否还有更多标识
   */
  applyMoreData (dataList, more) {
    if (!isArray(dataList)) {
      logWarn('applyMoreData', 'dataList', 'dataList must be an array!!!')
      return
    }
    const chartStore = this._chartPane.chartStore()
    chartStore.addData(dataList, 0, more)
    chartStore.technicalIndicatorStore().calcInstance().finally(
      _ => {
        this._chartPane.adjustPaneViewport(false, true, true, true)
      }
    )
  }

  /**
   * 更新数据
   * @param data 新的k线数据
   */
  updateData (data) {
    if (!isObject(data) || isArray(data)) {
      logWarn('updateData', 'data', 'data must be an object!!!')
      return
    }
    const chartStore = this._chartPane.chartStore()
    const dataList = chartStore.dataList()
    const dataSize = dataList.length
    // 这里判断单个数据应该添加到哪个位置
    const timestamp = formatValue(data, 'timestamp', 0)
    const lastDataTimestamp = formatValue(dataList[dataSize - 1], 'timestamp', 0)
    if (timestamp >= lastDataTimestamp) {
      let pos = dataSize
      if (timestamp === lastDataTimestamp) {
        pos = dataSize - 1
      }
      chartStore.addData(data, pos)
      chartStore.technicalIndicatorStore().calcInstance().finally(
        _ => {
          this._chartPane.adjustPaneViewport(false, true, true, true)
        }
      )
    }
  }

  /**
   * 设置加载更多回调
   * @param cb 回调方法
   */
  loadMore (cb) {
    if (!isFunction(cb)) {
      logWarn('loadMore', 'cb', 'cb must be a function!!!')
      return
    }
    this._chartPane.chartStore().timeScaleStore().setLoadMoreCallback(cb)
  }

  /**
   * 创建一个技术指标
   * @param value 指标名或者指标
   * @param isStack 是否覆盖
   * @param paneOptions 窗口配置
   * @returns {string|null}
   */
  createTechnicalIndicator (value, isStack, paneOptions) {
    if (!isValid(value)) {
      logWarn('createTechnicalIndicator', 'value', 'value is invalid!!!')
      return null
    }
    const tech = isObject(value) && !isArray(value) ? value : { name: value }
    if (!this._chartPane.chartStore().technicalIndicatorStore().hasTemplate(tech.name)) {
      logWarn('createTechnicalIndicator', 'value', 'can not find the corresponding technical indicator!!!')
      return null
    }
    return this._chartPane.createTechnicalIndicator(tech, isStack, paneOptions)
  }

  /**
   * 添加技术指标模板
   * @param template 指标模板
   */
  addTechnicalIndicatorTemplate (template) {
    if (!isObject(template)) {
      logWarn('addTechnicalIndicatorTemplate', 'template', 'template must be an object or array!!!')
      return
    }
    const templates = [].concat(template)
    this._chartPane.chartStore().technicalIndicatorStore().addTemplate(templates)
  }

  /**
   * 覆盖技术指标
   * @param override 覆盖参数
   * @param paneId 窗口id
   */
  overrideTechnicalIndicator (techOverride, paneId) {
    if (!isObject(techOverride) || isArray(techOverride)) {
      logWarn('overrideTechnicalIndicator', 'overrideTech', 'overrideTech must be an object!!!')
      return
    }
    const promise = this._chartPane.chartStore().technicalIndicatorStore().override(techOverride, paneId)
    if (promise) {
      promise.then(
        _ => {
          this._chartPane.adjustPaneViewport(false, true, true, true)
        }
      )
    }
  }

  /**
   * 获取技术指标名字获取技术指标
   * @param name 指标名
   * @return {{}}
   */
  getTechnicalIndicatorTemplate (name) {
    return this._chartPane.chartStore().technicalIndicatorStore().getTemplateInfo(name)
  }

  /**
    * 获取窗口上的技术指标
    * @param paneId 窗口id
    * @param name 指标名
    * @return {{}}
    */
  getTechnicalIndicatorByPaneId (paneId, name) {
    return this._chartPane.chartStore().technicalIndicatorStore().getInstanceInfo(paneId, name)
  }

  /**
   * 移除一个技术指标
   * @param paneId 窗口id
   * @param name 指标名
   */
  removeTechnicalIndicator (paneId, name) {
    this._chartPane.removeTechnicalIndicator(paneId, name)
  }

  /**
   * 添加图形模板
   * @param template 图形模板
   */
  addShapeTemplate (template) {
    if (!isObject(template)) {
      logWarn('addShapeTemplate', 'template', 'template must be an object or array!!!')
      return
    }
    const templates = [].concat(template)
    this._chartPane.chartStore().shapeStore().addTemplate(templates)
  }

  /**
   * 创建图形
   * @param value 图形名或者图形配置
   * @param paneId 窗口id
   */
  createShape (value, paneId) {
    if (!isValid(value)) {
      logWarn('createShape', 'value', 'value is invalid!!!')
      return null
    }
    const shapeOptions = isObject(value) && !isArray(value) ? value : { name: value }
    const Shape = this._chartPane.chartStore().shapeStore().getTemplate(shapeOptions.name)
    if (!Shape) {
      logWarn('createShape', 'value', 'can not find the corresponding shape!!!')
      return null
    }
    const id = this._chartPane.createShape(Shape, shapeOptions, paneId)
    if (!id) {
      logWarn('createShape', 'options.id', 'duplicate id!!!')
    }
    return id
  }

  /**
   * 获取图形标记
   * @param shapeId 图形标记id
   * @return {{name, lock: *, styles, id, points: (*|*[])}[]|{name, lock: *, styles, id, points: (*|*[])}}
   */
  getShape (shapeId) {
    return this._chartPane.chartStore().shapeStore().getInstanceInfo(shapeId)
  }

  /**
   * 设置图形标记配置
   * @param options 图形标记配置
   */
  setShapeOptions (options) {
    if (!isObject(options) || isArray(options)) {
      logWarn('setShapeOptions', 'options', 'options must be an object!!!')
      return
    }
    this._chartPane.chartStore().shapeStore().setInstanceOptions(options)
  }

  /**
   * 移除图形
   * @param shapeId 图形id
   */
  removeShape (shapeId) {
    this._chartPane.chartStore().shapeStore().removeInstance(shapeId)
  }

  /**
   * 创建注解
   * @param annotation 单个注解或者注解数组
   * @param paneId 窗口id
   */
  createAnnotation (annotation, paneId = CANDLE_PANE_ID) {
    if (!isObject(annotation)) {
      logWarn('createAnnotation', 'annotation', 'annotation must be an object or array!!!')
      return
    }
    if (!this._chartPane.hasPane(paneId)) {
      logWarn('createAnnotation', 'paneId', 'can not find the corresponding pane!!!')
      return
    }
    const annotations = [].concat(annotation)
    this._chartPane.createAnnotation(annotations, paneId)
  }

  /**
   * 移除注解
   * @param paneId 窗口id
   * @param points 单个点或者点数组
   */
  removeAnnotation (paneId, points) {
    this._chartPane.chartStore().annotationStore().remove(paneId, points)
  }

  /**
   * 创建标签
   * @param tag 单个标签或者标签数组
   * @param paneId 窗口id
   */
  createTag (tag, paneId = CANDLE_PANE_ID) {
    if (!isObject(tag)) {
      logWarn('createTag', 'tag', 'tag must be an object or array!!!')
      return
    }
    if (!this._chartPane.hasPane(paneId)) {
      logWarn('createTag', 'paneId', 'can not find the corresponding pane!!!')
      return
    }
    const tags = [].concat(tag)
    this._chartPane.createTag(tags, paneId)
  }

  /**
   * 移除标签
   * @param paneId 窗口id
   * @param tagId 标签id
   */
  removeTag (paneId, tagId) {
    this._chartPane.chartStore().tagStore().remove(paneId, tagId)
  }

  /**
   * 创建html元素
   * @param html
   * @param paneId
   * @returns
   */
  createHtml (html, paneId = CANDLE_PANE_ID) {
    if (!isObject(html)) {
      logWarn('createHtml', 'html', 'options must be an object!!!')
      return null
    }
    if (!isString(html.content) && !(html.content instanceof HTMLElement)) {
      logWarn('createHtml', 'html.content', 'invalid html.content!!!')
      return null
    }
    const pane = this._chartPane.getPane(paneId)
    if (!pane) {
      logWarn('createHtml', 'paneId', 'can not find the corresponding pane!!!')
      return null
    }
    return pane.createHtml(html)
  }

  /**
   * 移除html元素
   * @param paneId
   * @param htmlId
   */
  removeHtml (paneId, htmlId) {
    if (paneId) {
      const pane = this._chartPane.getPane(paneId)
      pane && pane.removeHtml(htmlId)
    } else {
      this._chartPane.removeAllHtml()
    }
  }

  /**
   * 设置窗口属性
   * @param options 窗口配置
   */
  setPaneOptions (options) {
    if (!isObject(options)) {
      logWarn('setPaneOptions', 'options', 'options must be an object!!!')
      return
    }
    this._chartPane.setPaneOptions(options, false)
  }

  /**
   * 设置是否可以缩放
   * @param enabled 标识
   */
  setZoomEnabled (enabled) {
    this._chartPane.chartStore().timeScaleStore().setZoomEnabled(enabled)
  }

  /**
   * 是否可以缩放
   * @return {boolean}
   */
  isZoomEnabled () {
    return this._chartPane.chartStore().timeScaleStore().zoomEnabled()
  }

  /**
   * 设置是否可以拖拽滚动
   * @param enabled 标识
   */
  setScrollEnabled (enabled) {
    this._chartPane.chartStore().timeScaleStore().setScrollEnabled(enabled)
  }

  /**
   * 是否可以拖拽滚动
   * @return {boolean}
   */
  isScrollEnabled () {
    return this._chartPane.chartStore().timeScaleStore().scrollEnabled()
  }

  /**
   * 按距离滚动
   * @param distance 距离
   * @param animationDuration 动画持续时间
   */
  scrollByDistance (distance, animationDuration) {
    if (!isNumber(distance)) {
      logWarn('scrollByDistance', 'distance', 'distance must be a number!!!')
      return
    }
    if (isNumber(animationDuration) && animationDuration > 0) {
      this._chartPane.chartStore().timeScaleStore().startScroll()
      const startTime = new Date().getTime()
      const animation = () => {
        const progress = (new Date().getTime() - startTime) / animationDuration
        const finished = progress >= 1
        const dis = finished ? distance : distance * progress
        this._chartPane.chartStore().timeScaleStore().scroll(dis)
        if (!finished) {
          requestAnimationFrame(animation)
        }
      }
      animation()
    } else {
      this._chartPane.chartStore().timeScaleStore().startScroll()
      this._chartPane.chartStore().timeScaleStore().scroll(distance)
    }
  }

  /**
   * 滚动到实时位置
   * @param animationDuration 动画持续时间
   */
  scrollToRealTime (animationDuration) {
    const dataSpace = this._chartPane.chartStore().timeScaleStore().dataSpace()
    const difBarCount = this._chartPane.chartStore().timeScaleStore().offsetRightBarCount() - this._chartPane.chartStore().timeScaleStore().offsetRightSpace() / dataSpace
    const distance = difBarCount * dataSpace
    this.scrollByDistance(distance, animationDuration)
  }

  /**
   * 滚动到指定的数据索引
   * @param dataIndex 数据索引
   * @param animationDuration 动画持续时间
   */
  scrollToDataIndex (dataIndex, animationDuration) {
    if (!isNumber(dataIndex)) {
      logWarn('scrollToDataIndex', 'dataIndex', 'dataIndex must be a number!!!')
      return
    }
    const distance = (
      this._chartPane.chartStore().timeScaleStore().offsetRightBarCount() + (this.getDataList().length - 1 - dataIndex)
    ) * this._chartPane.chartStore().timeScaleStore().dataSpace()
    this.scrollByDistance(distance, animationDuration)
  }

  /**
   * 滚动到指定时间戳
   * @param timestamp 时间戳
   * @param animationDuration 动画持续时间
   */
  scrollToTimestamp (timestamp, animationDuration) {
    if (!isNumber(timestamp)) {
      logWarn('scrollToTimestamp', 'timestamp', 'timestamp must be a number!!!')
      return
    }
    const dataIndex = binarySearchNearest(this.getDataList(), 'timestamp', timestamp)
    this.scrollToDataIndex(dataIndex, animationDuration)
  }

  /**
   * 在某个坐标点缩放
   * @param scale 缩放比例
   * @param coordinate 坐标点
   * @param animationDuration 动画持续时间
   */
  zoomAtCoordinate (scale, coordinate, animationDuration) {
    if (!isNumber(scale)) {
      logWarn('zoomAtCoordinate', 'scale', 'scale must be a number!!!')
      return
    }
    if (isNumber(animationDuration) && animationDuration > 0) {
      const dataSpace = this._chartPane.chartStore().timeScaleStore().dataSpace()
      const scaleDataSpace = dataSpace * scale
      const difSpace = scaleDataSpace - dataSpace
      const startTime = new Date().getTime()
      const animation = () => {
        const progress = (new Date().getTime() - startTime) / animationDuration
        const finished = progress >= 1
        const progressDataSpace = finished ? difSpace : difSpace * progress
        this._chartPane.chartStore().timeScaleStore().zoom(progressDataSpace / dataSpace, coordinate)
        if (!finished) {
          requestAnimationFrame(animation)
        }
      }
      animation()
    } else {
      this._chartPane.chartStore().timeScaleStore().zoom(scale, coordinate)
    }
  }

  /**
   * 在某个数据索引缩放
   * @param scale 缩放比例
   * @param dataIndex 索引位置
   * @param animationDuration 动画持续时间
   */
  zoomAtDataIndex (scale, dataIndex, animationDuration) {
    if (!isNumber(scale)) {
      logWarn('zoomAtDataIndex', 'scale', 'scale must be a number!!!')
      return
    }
    if (!isNumber(dataIndex)) {
      logWarn('zoomAtDataIndex', 'dataIndex', 'dataIndex must be a number!!!')
      return
    }
    const x = this._chartPane.chartStore().timeScaleStore().dataIndexToCoordinate(dataIndex)
    this.zoomAtCoordinate(scale, { x }, animationDuration)
  }

  /**
   * 在某个时间戳缩放
   * @param scale 缩放比例
   * @param timestamp 时间戳
   * @param animationDuration 动画持续时间
   */
  zoomAtTimestamp (scale, timestamp, animationDuration) {
    if (!isNumber(scale)) {
      logWarn('zoomAtTimestamp', 'scale', 'scale must be a number!!!')
      return
    }
    if (!isNumber(timestamp)) {
      logWarn('zoomAtTimestamp', 'timestamp', 'timestamp must be a number!!!')
      return
    }
    const dataIndex = binarySearchNearest(this.getDataList(), 'timestamp', timestamp)
    this.zoomAtDataIndex(scale, dataIndex, animationDuration)
  }

  /**
   * 将值装换成像素
   * @param point 单个点或者点集合
   * @param finder 过滤条件
   */
  convertToPixel (point, finder) {
    return this._chartPane.convertToPixel(point, finder)
  }

  /**
   * 将像素转换成值
   * @param coordinate 单个坐标或者坐标集合
   * @param finder 过滤条件
   */
  convertFromPixel (coordinate, finder) {
    return this._chartPane.convertFromPixel(coordinate, finder)
  }

  /**
   * 订阅图表动作
   * @param type 动作类型
   * @param callback 回调方法
   */
  subscribeAction (type, callback) {
    if (!hasAction(type)) {
      logWarn('subscribeAction', 'type', 'type does not exist!!!')
      return
    }
    if (!isFunction(callback)) {
      logWarn('subscribeAction', 'callback', 'callback must be a function!!!')
      return
    }
    this._chartPane.chartStore().actionStore().subscribe(type, callback)
  }

  /**
   * 取消订阅图表动作
   * @param type 动作类型
   * @param callback 回调方法
   */
  unsubscribeAction (type, callback) {
    if (!hasAction(type)) {
      logWarn('unsubscribeAction', 'type', 'type does not exist!!!')
      return
    }
    this._chartPane.chartStore().actionStore().unsubscribe(type, callback)
  }

  /**
   * 获取将图表装换成图片后的url
   * @param includeOverlay 是否包含覆盖层
   * @param type 图片类型
   * @param backgroundColor 背景色
   */
  getConvertPictureUrl (includeOverlay, type = 'jpeg', backgroundColor = '#FFFFFF') {
    if (type !== 'png' && type !== 'jpeg' && type !== 'bmp') {
      logWarn('getConvertPictureUrl', 'type', 'type only supports jpeg, png and bmp!!!')
      return
    }
    return this._chartPane.getConvertPictureUrl(includeOverlay, type, backgroundColor)
  }

  /**
   * 销毁
   */
  destroy () {
    this._chartPane.destroy()
  }
}
