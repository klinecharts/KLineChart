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

import PickRequired from './common/PickRequired'
import TypeOrNull from './common/TypeOrNull'
import DeepPartial from './common/DeepPartial'
import { UpdateLevel } from './common/Updater'
import KLineData from './common/KLineData'
import LoadMoreCallback from './common/LoadMoreCallback'
import { Styles } from './common/Styles'

import { getIndicatorClass } from './extension/indicator/index'
import { Indicator } from './componentl/Indicator'
import { getShapeClass } from './extension/shape/index'
import { Shape } from './componentl/Shape'
import { PaneOptions } from './pane/Pane'

import ChartInternal from './ChartInternal'
import { CANDLE_PANE_ID } from './pane/CandlePane'
import { XAXIS_PANE_ID } from './pane/XAxisPane'

import { clone, isString } from './common/utils/typeChecks'
import { logWarn } from './common/utils/logger'
import { formatValue } from './common/utils/format'

export default class Chart {
  private readonly _internal: ChartInternal

  constructor (container: HTMLElement, styleOptions?: DeepPartial<Styles>) {
    this._internal = new ChartInternal(container, styleOptions)
  }

  /**
   * 获取dom
   * @param finder
   * @returns
   */
  // getDom (finder) {
  //   if (finder) {
  //     if (!isObject(finder)) {
  //       logWarn('getDom', 'options', 'options must be an object!!!')
  //       return null
  //     }
  //     const { paneId, position } = finder
  //     const pane = this._chartPane.getPane(paneId)
  //     if (!pane) {
  //       logWarn('getDom', 'options.paneId', 'can not find the corresponding pane!!!')
  //       return null
  //     }
  //     return pane.container(position) || null
  //   }
  //   return this._chartPane.getContainer()
  // }

  /**
   * 获取宽尺寸
   * @return {*|{}}
   */
  // getWidth () {
  //   return this._chartPane.chartWidth()
  // }

  /**
   * 获取高度尺寸
   * @return {*|{}}
   */
  // getHeight () {
  //   return this._chartPane.chartHeight()
  // }

  /**
   * 设置样式配置
   * @param options 配置
   */
  setStyleOptions (options: DeepPartial<Styles>): Chart {
    this._internal.getChartStore().applyStyleOptions(options)
    this._internal.adjustPaneViewport(true, true, true, true, true)
    return this
  }

  /**
   * 获取样式配置
   * @returns {[]|*[]}
   */
  getStyleOptions (): Styles {
    return clone(this._internal.getChartStore().getStyleOptions())
  }

  /**
   * 设置价格数量精度
   * @param pricePrecision 价格精度
   * @param volumePrecision 数量精度
   */
  setPriceVolumePrecision (pricePrecision: number, volumePrecision: number): Chart {
    this._internal.getChartStore().setPrecision({ price: pricePrecision, volume: volumePrecision })
    return this
  }

  /**
   * 设置时区
   * @param timezone 时区
   */
  setTimezone (timezone: string): Chart {
    this._internal.getChartStore().getTimeScaleStore().setTimezone(timezone)
    this._internal.getPaneById(XAXIS_PANE_ID)?.getAxisComponent().buildTicks(true)
    this._internal.updatePane(UpdateLevel.DRAWER, XAXIS_PANE_ID)
    return this
  }

  /**
   * 获取当前时区
   */
  getTimezone (): string {
    return this._internal.getChartStore().getTimeScaleStore().getTimezone()
  }

  /**
   * 重置尺寸，总是会填充父容器
   */
  resize (): void {
    this._internal.adjustPaneViewport(true, true, true, true, true)
  }

  /**
   * 设置右边间距
   * @param space 空间大小
   */
  setOffsetRightDistance (space: number): Chart {
    this._internal.getChartStore().getTimeScaleStore().setOffsetRightDistance(space, true)
    return this
  }

  /**
   * 设置左边可见的最小bar数量
   * @param barCount bar数量
   */
  setLeftMinVisibleBarCount (barCount: number): Chart {
    if (barCount > 0) {
      this._internal.getChartStore().getTimeScaleStore().setLeftMinVisibleBarCount(Math.ceil(barCount))
    } else {
      logWarn('setLeftMinVisibleBarCount', 'barCount', 'barCount must greater than zero!!!')
    }
    return this
  }

  /**
   * 设置右边可见的最小bar数量
   * @param barCount bar数量
   */
  setRightMinVisibleBarCount (barCount: number): Chart {
    if (barCount > 0) {
      this._internal.getChartStore().getTimeScaleStore().setRightMinVisibleBarCount(Math.ceil(barCount))
    } else {
      logWarn('setRightMinVisibleBarCount', 'barCount', 'barCount must be a number and greater than zero!!!')
    }
    return this
  }

  /**
   * 设置一条数据的空间
   * @param space 空间大小
   */
  setBarSpace (space: number): Chart {
    this._internal.getChartStore().getTimeScaleStore().setBarSpace(space)
    return this
  }

  /**
   * 获取单条数据的空间
   * @returns
   */
  getBarSpace (): number {
    return this._internal.getChartStore().getTimeScaleStore().getBarSpace().bar
  }

  /**
   * 清空数据
   */
  clearData (): void {
    this._internal.getChartStore().clearDataList()
  }

  /**
   * 获取数据源
   */
  getDataList (): KLineData[] {
    return this._internal.getChartStore().getDataList()
  }

  /**
   * 添加新数据
   * @param dataList k线数据数组
   * @param more 是否还有更多标识
   */
  applyNewData (dataList: KLineData[], more?: boolean): void {
    this._internal.getChartStore().clearDataList()
    this.applyMoreData(dataList, more)
  }

  /**
   * 添加历史更多数据
   * @param dataList k线数据数组
   * @param more 是否还有更多标识
   */
  applyMoreData (dataList: KLineData[], more?: boolean): void {
    const chartStore = this._internal.getChartStore()
    chartStore.addData(dataList, 0, more)
    chartStore.getIndicatorStore().calcInstance().finally(
      () => {
        this._internal.adjustPaneViewport(false, true, true, true)
      }
    )
  }

  /**
   * 更新数据
   * @param data 新的k线数据
   */
  updateData (data: KLineData): void {
    const chartStore = this._internal.getChartStore()
    const dataList = chartStore.getDataList()
    const dataCount = dataList.length
    // 这里判断单个数据应该添加到哪个位置
    const timestamp = data.timestamp
    const lastDataTimestamp = formatValue(dataList[dataCount - 1], 'timestamp', 0) as number
    if (timestamp >= lastDataTimestamp) {
      let pos = dataCount
      if (timestamp === lastDataTimestamp) {
        pos = dataCount - 1
      }
      chartStore.addData(data, pos)
      chartStore.getIndicatorStore().calcInstance().finally(
        () => {
          this._internal.adjustPaneViewport(false, true, true, true)
        }
      )
    }
  }

  /**
   * 设置加载更多回调
   * @param cb 回调方法
   */
  loadMore (cb: LoadMoreCallback): void {
    this._internal.getChartStore().getTimeScaleStore().setLoadMoreCallback(cb)
  }

  /**
   * 创建一个技术指标
   * @param value 指标名或者指标
   * @param isStack 是否覆盖
   * @param paneOptions 窗口配置
   * @returns {string|null}
   */
  createIndicator (value: string | PickRequired<Partial<Indicator>, 'name'>, isStack?: boolean, paneOptions?: PaneOptions): TypeOrNull<string> {
    const indicator: PickRequired<Partial<Indicator>, 'name'> = isString(value) ? { name: value as string } : value as Omit<Indicator, 'result'>
    if (getIndicatorClass(indicator.name) === null) {
      logWarn('createIndicator', 'value', 'indicator not supported, you may need to use registerIndicator to add one!!!')
      return null
    }
    return this._internal.createIndicator(indicator, isStack ?? false, paneOptions)
  }

  /**
   * 覆盖技术指标
   * @param override 覆盖参数
   * @param paneId 窗口id
   */
  overrideIndicator (override: PickRequired<Partial<Indicator>, 'name'>, paneId?: string): void {
    this._internal.getChartStore().getIndicatorStore().override(override, paneId).then(
      result => {
        if (result.length > 0) {
          this._internal.adjustPaneViewport(false, true, true, true)
        }
      }
    ).catch(() => {})
  }

  /**
    * 获取窗口上的技术指标
    * @param paneId 窗口id
    * @param name 指标名
    * @return {{}}
    */
  getIndicatorByPaneId (paneId?: string, name?: string): TypeOrNull<Indicator> | TypeOrNull<Map<string, Indicator>> | Map<string, Map<string, Indicator>> {
    return this._internal.getChartStore().getIndicatorStore().getInstanceByPaneId(paneId, name)
  }

  /**
   * 移除一个技术指标
   * @param paneId 窗口id
   * @param name 指标名
   */
  removeIndicator (paneId: string, name?: string): void {
    this._internal.removeIndicator(paneId, name)
  }

  /**
   * 创建图形
   * @param value 图形名或者图形配置
   * @param paneId 窗口id
   */
  createShape (value: string | PickRequired<Partial<Shape>, 'name'>, paneId?: string): TypeOrNull<string> {
    const shape: PickRequired<Partial<Shape>, 'name'> = isString(value) ? { name: value as string } : value as PickRequired<Partial<Shape>, 'name'>
    if (getShapeClass(shape.name) === null) {
      logWarn('createShape', 'value', 'can not find the corresponding shape!!!')
      return null
    }
    let appointPaneFlag = true
    if (paneId === undefined || this._internal.getPaneById(paneId) === null) {
      paneId = CANDLE_PANE_ID
      appointPaneFlag = false
    }
    const id = this._internal.getChartStore().getShapeStore().addInstance(shape, paneId, appointPaneFlag)
    if (id === null) {
      logWarn('createShape', 'options.id', 'duplicate id!!!')
    }
    return id
  }

  /**
   * 获取图形标记
   * @param shapeId 图形标记id
   * @return {{name, lock: *, styles, id, points: (*|*[])}[]|{name, lock: *, styles, id, points: (*|*[])}}
   */
  getShapeById (shapeId: string): TypeOrNull<Shape> {
    return this._internal.getChartStore().getShapeStore().getInstanceById(shapeId)
  }

  /**
   * 设置图形标记配置
   * @param override 图形标记配置
   */
  overrideShape (override: Partial<Shape>): void {
    this._internal.getChartStore().getShapeStore().override(override)
  }

  /**
   * 移除图形
   * @param shapeId 图形id
   */
  removeShape (shapeId?: string): void {
    this._internal.getChartStore().getShapeStore().removeInstance(shapeId)
  }

  // /**
  //  * 创建注解
  //  * @param annotation 单个注解或者注解数组
  //  * @param paneId 窗口id
  //  */
  // createAnnotation (annotation, paneId = CANDLE_PANE_ID) {
  //   if (!isObject(annotation)) {
  //     logWarn('createAnnotation', 'annotation', 'annotation must be an object or array!!!')
  //     return
  //   }
  //   if (!this._chartPane.hasPane(paneId)) {
  //     logWarn('createAnnotation', 'paneId', 'can not find the corresponding pane!!!')
  //     return
  //   }
  //   const annotations = [].concat(annotation)
  //   this._chartPane.createAnnotation(annotations, paneId)
  // }

  // /**
  //  * 移除注解
  //  * @param paneId 窗口id
  //  * @param points 单个点或者点数组
  //  */
  // removeAnnotation (paneId, points) {
  //   this._chartPane.chartStore().annotationStore().remove(paneId, points)
  // }

  // /**
  //  * 创建标签
  //  * @param tag 单个标签或者标签数组
  //  * @param paneId 窗口id
  //  */
  // createTag (tag, paneId = CANDLE_PANE_ID) {
  //   if (!isObject(tag)) {
  //     logWarn('createTag', 'tag', 'tag must be an object or array!!!')
  //     return
  //   }
  //   if (!this._chartPane.hasPane(paneId)) {
  //     logWarn('createTag', 'paneId', 'can not find the corresponding pane!!!')
  //     return
  //   }
  //   const tags = [].concat(tag)
  //   this._chartPane.createTag(tags, paneId)
  // }

  // /**
  //  * 移除标签
  //  * @param paneId 窗口id
  //  * @param tagId 标签id
  //  */
  // removeTag (paneId, tagId) {
  //   this._chartPane.chartStore().tagStore().remove(paneId, tagId)
  // }

  // /**
  //  * 创建html元素
  //  * @param html
  //  * @param paneId
  //  * @returns
  //  */
  // createHtml (html, paneId = CANDLE_PANE_ID) {
  //   if (!isObject(html)) {
  //     logWarn('createHtml', 'html', 'options must be an object!!!')
  //     return null
  //   }
  //   if (!isString(html.content) && !(html.content instanceof HTMLElement)) {
  //     logWarn('createHtml', 'html.content', 'invalid html.content!!!')
  //     return null
  //   }
  //   const pane = this._chartPane.getPane(paneId)
  //   if (!pane) {
  //     logWarn('createHtml', 'paneId', 'can not find the corresponding pane!!!')
  //     return null
  //   }
  //   return pane.createHtml(html)
  // }

  // /**
  //  * 移除html元素
  //  * @param paneId
  //  * @param htmlId
  //  */
  // removeHtml (paneId, htmlId) {
  //   if (paneId) {
  //     const pane = this._chartPane.getPane(paneId)
  //     pane && pane.removeHtml(htmlId)
  //   } else {
  //     this._chartPane.removeAllHtml()
  //   }
  // }

  // /**
  //  * 设置窗口属性
  //  * @param options 窗口配置
  //  */
  // setPaneOptions (options) {
  //   if (!isObject(options)) {
  //     logWarn('setPaneOptions', 'options', 'options must be an object!!!')
  //     return
  //   }
  //   this._chartPane.setPaneOptions(options, false)
  // }

  // /**
  //  * 设置是否可以缩放
  //  * @param enabled 标识
  //  */
  // setZoomEnabled (enabled) {
  //   this._chartPane.chartStore().timeScaleStore().setZoomEnabled(enabled)
  // }

  // /**
  //  * 是否可以缩放
  //  * @return {boolean}
  //  */
  // isZoomEnabled () {
  //   return this._chartPane.chartStore().timeScaleStore().zoomEnabled()
  // }

  // /**
  //  * 设置是否可以拖拽滚动
  //  * @param enabled 标识
  //  */
  // setScrollEnabled (enabled) {
  //   this._chartPane.chartStore().timeScaleStore().setScrollEnabled(enabled)
  // }

  // /**
  //  * 是否可以拖拽滚动
  //  * @return {boolean}
  //  */
  // isScrollEnabled () {
  //   return this._chartPane.chartStore().timeScaleStore().scrollEnabled()
  // }

  // /**
  //  * 按距离滚动
  //  * @param distance 距离
  //  * @param animationDuration 动画持续时间
  //  */
  // scrollByDistance (distance, animationDuration) {
  //   if (!isNumber(distance)) {
  //     logWarn('scrollByDistance', 'distance', 'distance must be a number!!!')
  //     return
  //   }
  //   if (isNumber(animationDuration) && animationDuration > 0) {
  //     this._chartPane.chartStore().timeScaleStore().startScroll()
  //     const startTime = new Date().getTime()
  //     const animation = () => {
  //       const progress = (new Date().getTime() - startTime) / animationDuration
  //       const finished = progress >= 1
  //       const dis = finished ? distance : distance * progress
  //       this._chartPane.chartStore().timeScaleStore().scroll(dis)
  //       if (!finished) {
  //         requestAnimationFrame(animation)
  //       }
  //     }
  //     animation()
  //   } else {
  //     this._chartPane.chartStore().timeScaleStore().startScroll()
  //     this._chartPane.chartStore().timeScaleStore().scroll(distance)
  //   }
  // }

  // /**
  //  * 滚动到实时位置
  //  * @param animationDuration 动画持续时间
  //  */
  // scrollToRealTime (animationDuration) {
  //   const dataSpace = this._chartPane.chartStore().timeScaleStore().dataSpace()
  //   const difBarCount = this._chartPane.chartStore().timeScaleStore().offsetRightBarCount() - this._chartPane.chartStore().timeScaleStore().offsetRightSpace() / dataSpace
  //   const distance = difBarCount * dataSpace
  //   this.scrollByDistance(distance, animationDuration)
  // }

  // /**
  //  * 滚动到指定的数据索引
  //  * @param dataIndex 数据索引
  //  * @param animationDuration 动画持续时间
  //  */
  // scrollToDataIndex (dataIndex, animationDuration) {
  //   if (!isNumber(dataIndex)) {
  //     logWarn('scrollToDataIndex', 'dataIndex', 'dataIndex must be a number!!!')
  //     return
  //   }
  //   const distance = (
  //     this._chartPane.chartStore().timeScaleStore().offsetRightBarCount() + (this.getDataList().length - 1 - dataIndex)
  //   ) * this._chartPane.chartStore().timeScaleStore().dataSpace()
  //   this.scrollByDistance(distance, animationDuration)
  // }

  // /**
  //  * 滚动到指定时间戳
  //  * @param timestamp 时间戳
  //  * @param animationDuration 动画持续时间
  //  */
  // scrollToTimestamp (timestamp, animationDuration) {
  //   if (!isNumber(timestamp)) {
  //     logWarn('scrollToTimestamp', 'timestamp', 'timestamp must be a number!!!')
  //     return
  //   }
  //   const dataIndex = binarySearchNearest(this.getDataList(), 'timestamp', timestamp)
  //   this.scrollToDataIndex(dataIndex, animationDuration)
  // }

  // /**
  //  * 在某个坐标点缩放
  //  * @param scale 缩放比例
  //  * @param coordinate 坐标点
  //  * @param animationDuration 动画持续时间
  //  */
  // zoomAtCoordinate (scale, coordinate, animationDuration) {
  //   if (!isNumber(scale)) {
  //     logWarn('zoomAtCoordinate', 'scale', 'scale must be a number!!!')
  //     return
  //   }
  //   if (isNumber(animationDuration) && animationDuration > 0) {
  //     const dataSpace = this._chartPane.chartStore().timeScaleStore().dataSpace()
  //     const scaleDataSpace = dataSpace * scale
  //     const difSpace = scaleDataSpace - dataSpace
  //     const startTime = new Date().getTime()
  //     const animation = () => {
  //       const progress = (new Date().getTime() - startTime) / animationDuration
  //       const finished = progress >= 1
  //       const progressDataSpace = finished ? difSpace : difSpace * progress
  //       this._chartPane.chartStore().timeScaleStore().zoom(progressDataSpace / dataSpace, coordinate)
  //       if (!finished) {
  //         requestAnimationFrame(animation)
  //       }
  //     }
  //     animation()
  //   } else {
  //     this._chartPane.chartStore().timeScaleStore().zoom(scale, coordinate)
  //   }
  // }

  // /**
  //  * 在某个数据索引缩放
  //  * @param scale 缩放比例
  //  * @param dataIndex 索引位置
  //  * @param animationDuration 动画持续时间
  //  */
  // zoomAtDataIndex (scale, dataIndex, animationDuration) {
  //   if (!isNumber(scale)) {
  //     logWarn('zoomAtDataIndex', 'scale', 'scale must be a number!!!')
  //     return
  //   }
  //   if (!isNumber(dataIndex)) {
  //     logWarn('zoomAtDataIndex', 'dataIndex', 'dataIndex must be a number!!!')
  //     return
  //   }
  //   const x = this._chartPane.chartStore().timeScaleStore().dataIndexToCoordinate(dataIndex)
  //   this.zoomAtCoordinate(scale, { x }, animationDuration)
  // }

  // /**
  //  * 在某个时间戳缩放
  //  * @param scale 缩放比例
  //  * @param timestamp 时间戳
  //  * @param animationDuration 动画持续时间
  //  */
  // zoomAtTimestamp (scale, timestamp, animationDuration) {
  //   if (!isNumber(scale)) {
  //     logWarn('zoomAtTimestamp', 'scale', 'scale must be a number!!!')
  //     return
  //   }
  //   if (!isNumber(timestamp)) {
  //     logWarn('zoomAtTimestamp', 'timestamp', 'timestamp must be a number!!!')
  //     return
  //   }
  //   const dataIndex = binarySearchNearest(this.getDataList(), 'timestamp', timestamp)
  //   this.zoomAtDataIndex(scale, dataIndex, animationDuration)
  // }

  // /**
  //  * 将值装换成像素
  //  * @param point 单个点或者点集合
  //  * @param finder 过滤条件
  //  */
  // convertToPixel (point, finder) {
  //   return this._chartPane.convertToPixel(point, finder)
  // }

  // /**
  //  * 将像素转换成值
  //  * @param coordinate 单个坐标或者坐标集合
  //  * @param finder 过滤条件
  //  */
  // convertFromPixel (coordinate, finder) {
  //   return this._chartPane.convertFromPixel(coordinate, finder)
  // }

  // /**
  //  * 订阅图表动作
  //  * @param type 动作类型
  //  * @param callback 回调方法
  //  */
  // subscribeAction (type, callback) {
  //   if (!hasAction(type)) {
  //     logWarn('subscribeAction', 'type', 'type does not exist!!!')
  //     return
  //   }
  //   if (!isFunction(callback)) {
  //     logWarn('subscribeAction', 'callback', 'callback must be a function!!!')
  //     return
  //   }
  //   this._chartPane.chartStore().actionStore().subscribe(type, callback)
  // }

  // /**
  //  * 取消订阅图表动作
  //  * @param type 动作类型
  //  * @param callback 回调方法
  //  */
  // unsubscribeAction (type, callback) {
  //   if (!hasAction(type)) {
  //     logWarn('unsubscribeAction', 'type', 'type does not exist!!!')
  //     return
  //   }
  //   this._chartPane.chartStore().actionStore().unsubscribe(type, callback)
  // }

  // /**
  //  * 获取将图表装换成图片后的url
  //  * @param includeOverlay 是否包含覆盖层
  //  * @param type 图片类型
  //  * @param backgroundColor 背景色
  //  */
  // getConvertPictureUrl (includeOverlay, type = 'jpeg', backgroundColor = '#FFFFFF') {
  //   if (type !== 'png' && type !== 'jpeg' && type !== 'bmp') {
  //     logWarn('getConvertPictureUrl', 'type', 'type only supports jpeg, png and bmp!!!')
  //     return
  //   }
  //   return this._chartPane.getConvertPictureUrl(includeOverlay, type, backgroundColor)
  // }

  /**
   * 销毁
   */
  destroy (): void {
    this._internal.destroy()
  }
}
