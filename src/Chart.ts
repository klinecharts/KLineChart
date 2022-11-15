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

import TypeOrNull from './common/TypeOrNull'
import DeepPartial from './common/DeepPartial'
import Coordinate from './common/Coordinate'
import Point from './common/Point'
import Bounding from './common/Bounding'
import { UpdateLevel } from './common/Updater'
import KLineData from './common/KLineData'
import LoadMoreCallback from './common/LoadMoreCallback'
import { Styles } from './common/Styles'

import { Indicator, IndicatorCreate } from './component/Indicator'
import { Overlay, OverlayCreate } from './component/Overlay'

import { getIndicatorClass } from './extension/indicator/index'
import { getOverlayClass } from './extension/overlay/index'

import { PaneOptions, PaneIdConstants } from './pane/Pane'

import ChartInternal from './ChartInternal'

import { clone, isString, isArray } from './common/utils/typeChecks'
import { logWarn } from './common/utils/logger'
import { formatValue } from './common/utils/format'
import { binarySearchNearest } from './common/utils/number'

export const enum DomPosition {
  ROOT,
  MAIN,
  YAXIS
}

export interface ConvertFinder {
  paneId?: string
  absolute?: boolean
}

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
  getDom (paneId?: string, position?: DomPosition): TypeOrNull<HTMLElement> {
    if (paneId !== undefined) {
      const pane = this._internal.getPaneById(paneId)
      if (pane !== null) {
        const pos = position ?? DomPosition.ROOT
        switch (pos) {
          case DomPosition.ROOT: {
            return pane.getContainer()
          }
          case DomPosition.MAIN: {
            return pane.getMainWidget().getContainer()
          }
          case DomPosition.YAXIS: {
            return pane.getYAxisWidget()?.getContainer() ?? null
          }
        }
      }
    } else {
      return this._internal.getChartContainer()
    }
    return null
  }

  getSize (paneId?: string, position?: DomPosition): TypeOrNull<Bounding> {
    if (paneId !== undefined) {
      const pane = this._internal.getPaneById(paneId)
      if (pane !== null) {
        const pos = position ?? DomPosition.ROOT
        switch (pos) {
          case DomPosition.ROOT: {
            return pane.getBounding()
          }
          case DomPosition.MAIN: {
            return pane.getMainWidget().getBounding()
          }
          case DomPosition.YAXIS: {
            return pane.getYAxisWidget()?.getBounding() ?? null
          }
        }
      }
    } else {
      const container = this._internal.getChartContainer()
      return {
        width: container.offsetWidth,
        height: container.offsetHeight,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    }
    return null
  }

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
    this._internal.getPaneById(PaneIdConstants.XAXIS)?.getAxisComponent().buildTicks(true)
    this._internal.updatePane(UpdateLevel.DRAWER, PaneIdConstants.XAXIS)
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
  createIndicator (value: string | IndicatorCreate, isStack?: boolean, paneOptions?: PaneOptions): TypeOrNull<string> {
    const indicator: IndicatorCreate = isString(value) ? { name: value as string } : value as IndicatorCreate
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
  overrideIndicator (override: IndicatorCreate, paneId?: string): void {
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
  createOverlay (value: string | OverlayCreate, paneId?: string): TypeOrNull<string> {
    const overlay: OverlayCreate = isString(value) ? { name: value as string } : value as OverlayCreate
    if (getOverlayClass(overlay.name) === null) {
      logWarn('createOverlay', 'value', 'overlay not supported, you may need to use registerOverlay to add one!!!')
      return null
    }
    let appointPaneFlag = true
    if (paneId === undefined || this._internal.getPaneById(paneId) === null) {
      paneId = PaneIdConstants.CANDLE
      appointPaneFlag = false
    }
    const id = this._internal.getChartStore().getOverlayStore().addInstance(overlay, paneId, appointPaneFlag)
    if (id === null) {
      logWarn('createOverlay', 'options.id', 'duplicate id!!!')
    }
    return id
  }

  /**
   * overlay
   * @param id overlay id
   * @return {{name, lock: *, styles, id, points: (*|*[])}[]|{name, lock: *, styles, id, points: (*|*[])}}
   */
  getOverlayById (id: string): TypeOrNull<Overlay> {
    return this._internal.getChartStore().getOverlayStore().getInstanceById(id)
  }

  /**
   * 设置图形标记配置
   * @param override 图形标记配置
   */
  overrideOverlay (override: Partial<OverlayCreate>): void {
    this._internal.getChartStore().getOverlayStore().override(override)
  }

  /**
   * 移除图形
   * @param id 图形id
   */
  removeOverlay (id?: string): void {
    this._internal.getChartStore().getOverlayStore().removeInstance(id)
  }

  /**
   * 设置窗口属性
   * @param options 窗口配置
   */
  setPaneOptions (options: PaneOptions): void {
    this._internal.setPaneOptions(options, false)
  }

  /**
   * 设置是否可以缩放
   * @param enabled 标识
   */
  setZoomEnabled (enabled: boolean): void {
    this._internal.getChartStore().getTimeScaleStore().setZoomEnabled(enabled)
  }

  /**
   * 是否可以缩放
   * @return {boolean}
   */
  isZoomEnabled (): boolean {
    return this._internal.getChartStore().getTimeScaleStore().getZoomEnabled()
  }

  /**
   * 设置是否可以拖拽滚动
   * @param enabled 标识
   */
  setScrollEnabled (enabled: boolean): void {
    this._internal.getChartStore().getTimeScaleStore().setScrollEnabled(enabled)
  }

  /**
   * 是否可以拖拽滚动
   * @return {boolean}
   */
  isScrollEnabled (): boolean {
    return this._internal.getChartStore().getTimeScaleStore().getScrollEnabled()
  }

  /**
   * 按距离滚动
   * @param distance 距离
   * @param animationDuration 动画持续时间
   */
  scrollByDistance (distance: number, animationDuration?: number): void {
    const duration = animationDuration === undefined || animationDuration < 0 ? 0 : animationDuration
    const timeScaleStore = this._internal.getChartStore().getTimeScaleStore()
    if (duration > 0) {
      timeScaleStore.startScroll()
      const startTime = new Date().getTime()
      const animation: (() => void) = () => {
        const progress = (new Date().getTime() - startTime) / duration
        const finished = progress >= 1
        const dis = finished ? distance : distance * progress
        timeScaleStore.scroll(dis)
        if (!finished) {
          requestAnimationFrame(animation)
        }
      }
      animation()
    } else {
      timeScaleStore.startScroll()
      timeScaleStore.scroll(distance)
    }
  }

  /**
   * 滚动到实时位置
   * @param animationDuration 动画持续时间
   */
  scrollToRealTime (animationDuration?: number): void {
    const timeScaleStore = this._internal.getChartStore().getTimeScaleStore()
    const { bar: barSpace } = timeScaleStore.getBarSpace()
    const difBarCount = timeScaleStore.getOffsetRightBarCount() - timeScaleStore.getOffsetRightDistance() / barSpace
    const distance = difBarCount * barSpace
    this.scrollByDistance(distance, animationDuration)
  }

  /**
   * 滚动到指定的数据索引
   * @param dataIndex 数据索引
   * @param animationDuration 动画持续时间
   */
  scrollToDataIndex (dataIndex: number, animationDuration?: number): void {
    const timeScaleStore = this._internal.getChartStore().getTimeScaleStore()
    const distance = (
      timeScaleStore.getOffsetRightBarCount() + (this.getDataList().length - 1 - dataIndex)
    ) * timeScaleStore.getBarSpace().bar
    this.scrollByDistance(distance, animationDuration)
  }

  /**
   * 滚动到指定时间戳
   * @param timestamp 时间戳
   * @param animationDuration 动画持续时间
   */
  scrollToTimestamp (timestamp: number, animationDuration?: number): void {
    const dataIndex = binarySearchNearest(this.getDataList(), 'timestamp', timestamp)
    this.scrollToDataIndex(dataIndex, animationDuration)
  }

  /**
   * 在某个坐标点缩放
   * @param scale 缩放比例
   * @param coordinate 坐标点
   * @param animationDuration 动画持续时间
   */
  zoomAtCoordinate (scale: number, coordinate: Coordinate, animationDuration?: number): void {
    const duration = animationDuration === undefined || animationDuration < 0 ? 0 : animationDuration
    const timeScaleStore = this._internal.getChartStore().getTimeScaleStore()
    if (duration > 0) {
      const { bar: barSpace } = timeScaleStore.getBarSpace()
      const scaleDataSpace = barSpace * scale
      const difSpace = scaleDataSpace - barSpace
      const startTime = new Date().getTime()
      const animation: (() => void) = () => {
        const progress = (new Date().getTime() - startTime) / duration
        const finished = progress >= 1
        const progressDataSpace = finished ? difSpace : difSpace * progress
        timeScaleStore.zoom(progressDataSpace / barSpace, coordinate)
        if (!finished) {
          requestAnimationFrame(animation)
        }
      }
      animation()
    } else {
      timeScaleStore.zoom(scale, coordinate)
    }
  }

  /**
   * 在某个数据索引缩放
   * @param scale 缩放比例
   * @param dataIndex 索引位置
   * @param animationDuration 动画持续时间
   */
  zoomAtDataIndex (scale: number, dataIndex: number, animationDuration?: number): void {
    const x = this._internal.getChartStore().getTimeScaleStore().dataIndexToCoordinate(dataIndex)
    this.zoomAtCoordinate(scale, { x, y: 0 }, animationDuration)
  }

  /**
   * 在某个时间戳缩放
   * @param scale 缩放比例
   * @param timestamp 时间戳
   * @param animationDuration 动画持续时间
   */
  zoomAtTimestamp (scale: number, timestamp: number, animationDuration?: number): void {
    const dataIndex = binarySearchNearest(this.getDataList(), 'timestamp', timestamp)
    this.zoomAtDataIndex(scale, dataIndex, animationDuration)
  }

  /**
   * 将值装换成像素
   * @param points 单个点或者点集合
   * @param finder 过滤条件
   */
  convertToPixel (points: Partial<Point> | Array<Partial<Point>>, finder: ConvertFinder): Partial<Coordinate> | Array<Partial<Coordinate>> {
    const { paneId = PaneIdConstants.CANDLE, absolute = false } = finder
    let coordinates: Array<Partial<Coordinate>> = []
    if (paneId !== PaneIdConstants.XAXIS) {
      const pane = this._internal.getPaneById(paneId)
      if (pane !== null) {
        const timeScaleStore = this._internal.getChartStore().getTimeScaleStore()
        const bounding = pane.getBounding()
        const ps = new Array<Partial<Point>>().concat(points)
        const xAxis = this._internal.getPaneById(PaneIdConstants.XAXIS)?.getAxisComponent()
        const yAxis = pane.getAxisComponent()
        coordinates = ps.map(point => {
          const coordinate: Partial<Coordinate> = {}
          let dataIndex = point.dataIndex
          if (point.timestamp !== undefined) {
            dataIndex = timeScaleStore.timestampToDataIndex(point.timestamp)
          }
          if (dataIndex !== undefined) {
            coordinate.x = xAxis?.convertToPixel(dataIndex)
          }
          if (point.value !== undefined) {
            const y = yAxis?.convertToPixel(point.value)
            coordinate.y = absolute ? bounding.top + y : y
          }
          return coordinate
        })
      }
    }
    return isArray(points) ? coordinates : (coordinates[0] ?? {})
  }

  /**
   * 将像素转换成值
   * @param coordinates 单个坐标或者坐标集合
   * @param finder 过滤条件
   */
  convertFromPixel (coordinates: Array<Partial<Coordinate>>, finder: ConvertFinder): Partial<Point> | Array<Partial<Point>> {
    const { paneId = PaneIdConstants.CANDLE, absolute = false } = finder
    let points: Array<Partial<Point>> = []
    if (paneId !== PaneIdConstants.XAXIS) {
      const pane = this._internal.getPaneById(paneId)
      if (pane !== null) {
        const timeScaleStore = this._internal.getChartStore().getTimeScaleStore()
        const bounding = pane.getBounding()
        const cs = new Array<Partial<Coordinate>>().concat(coordinates)
        const xAxis = this._internal.getPaneById(PaneIdConstants.XAXIS)?.getAxisComponent()
        const yAxis = pane.getAxisComponent()
        points = cs.map(coordinate => {
          const point: Partial<Point> = {}
          if (coordinate.x !== undefined) {
            const dataIndex = xAxis?.convertFromPixel(coordinate.x) as number
            point.dataIndex = dataIndex
            point.timestamp = timeScaleStore.dataIndexToTimestamp(dataIndex) ?? undefined
          }
          if (coordinate.y !== undefined) {
            const y = absolute ? coordinate.y - bounding.top : coordinate.y
            point.value = yAxis.convertFromPixel(y)
          }
          return point
        })
      }
    }
    return isArray(coordinates) ? points : (points[0] ?? {})
  }

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
