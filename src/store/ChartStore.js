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

import { isArray, isObject, isBoolean, merge, clone } from '../utils/typeChecks'
import { defaultStyleOptions } from '../options/styleOptions'

import TimeScaleStore from './TimeScaleStore'
import TechnicalIndicatorStore from './TechnicalIndicatorStore'
import ShapeStore from './ShapeStore'
import AnnotationStore from './AnnotationStore'
import TagStore from './TagStore'
import CrosshairStore from './CrosshairStore'
import ActionStore from './ActionStore'

export default class ChartStore {
  constructor (styleOptions, handler) {
    // 持有者
    this._handler = handler
    // 样式配置
    this._styleOptions = clone(defaultStyleOptions)
    merge(this._styleOptions, styleOptions)

    // 价格精度
    this._pricePrecision = 2
    // 数量精度
    this._volumePrecision = 0

    // 数据源
    this._dataList = []
    // 可见的数据(需要绘制的数据)
    this._visibleDataList = []

    // 调整pane标记
    this._dragPaneFlag = false

    // 时间轴缩放数据存储
    this._timeScaleStore = new TimeScaleStore(this)
    // 技术指标数据存储
    this._technicalIndicatorStore = new TechnicalIndicatorStore(this)
    // 图形数据存储
    this._shapeStore = new ShapeStore(this)
    // 注解数据存储
    this._annotationStore = new AnnotationStore(this)
    // 标签数据存储
    this._tagStore = new TagStore(this)
    // 十字光标数据存储
    this._crosshairStore = new CrosshairStore(this)
    // 事件存储
    this._actionStore = new ActionStore()
  }

  /**
   * 调整可见数据
   */
  adjustVisibleDataList () {
    // 处理需要绘制的数据
    this._visibleDataList = []
    const from = this._timeScaleStore.from()
    const to = this._timeScaleStore.to()
    for (let i = from; i < to; i++) {
      const kLineData = this._dataList[i]
      const x = this._timeScaleStore.dataIndexToCoordinate(i)
      this._visibleDataList.push({
        index: i,
        x,
        data: kLineData
      })
    }
    this._annotationStore.createVisibleAnnotations()
  }

  /**
   * 获取样式配置
   * @return {{}}
   */
  styleOptions () {
    return this._styleOptions
  }

  /**
   * 设置样式配置
   * @param options
   */
  applyStyleOptions (options) {
    merge(this._styleOptions, options)
  }

  /**
   * 价格精度
   * @returns {number}
   */
  pricePrecision () {
    return this._pricePrecision
  }

  /**
   * 数量精度
   * @returns {number}
   */
  volumePrecision () {
    return this._volumePrecision
  }

  /**
   * 设置价格和数量精度
   * @param pricePrecision
   * @param volumePrecision
   */
  setPriceVolumePrecision (pricePrecision, volumePrecision) {
    this._pricePrecision = pricePrecision
    this._volumePrecision = volumePrecision
    this._technicalIndicatorStore.setSeriesPrecision(pricePrecision, volumePrecision)
  }

  /**
   * 获取数据源
   * @returns {[]|*[]}
   */
  dataList () {
    return this._dataList
  }

  /**
   * 获取可见数据源
   * @returns {[]|*[]}
   */
  visibleDataList () {
    return this._visibleDataList
  }

  /**
   * 添加数据
   * @param data
   * @param pos
   * @param more
   */
  addData (data, pos, more) {
    if (isObject(data)) {
      if (isArray(data)) {
        this._timeScaleStore.setLoading(false)
        this._timeScaleStore.setMore(isBoolean(more) ? more : true)
        const isFirstAdd = this._dataList.length === 0
        this._dataList = data.concat(this._dataList)
        if (isFirstAdd) {
          this._timeScaleStore.resetOffsetRightSpace()
        }
        this._timeScaleStore.adjustFromTo()
      } else {
        const dataSize = this._dataList.length
        if (pos >= dataSize) {
          this._dataList.push(data)
          let offsetRightBarCount = this._timeScaleStore.offsetRightBarCount()
          if (offsetRightBarCount < 0) {
            this._timeScaleStore.setOffsetRightBarCount(--offsetRightBarCount)
          }
          this._timeScaleStore.adjustFromTo()
        } else {
          this._dataList[pos] = data
          this.adjustVisibleDataList()
        }
      }
      this._crosshairStore.recalculate(true)
    }
  }

  /**
   * 清空数据源
   */
  clearDataList () {
    this._dataList = []
    this._visibleDataList = []
    this._timeScaleStore.clear()
  }

  /**
   * 获取时间缩放存储
   * @returns
   */
  timeScaleStore () {
    return this._timeScaleStore
  }

  /**
   * 获取技术指标存储
   * @returns
   */
  technicalIndicatorStore () {
    return this._technicalIndicatorStore
  }

  /**
   * 获取图形存储
   * @returns
   */
  shapeStore () {
    return this._shapeStore
  }

  /**
   * 获取注解存储
   * @returns
   */
  annotationStore () {
    return this._annotationStore
  }

  /**
   * 获取标签数据存储
   * @returns
   */
  tagStore () {
    return this._tagStore
  }

  /**
   * 获取十字光标数据存储
   * @returns
   */
  crosshairStore () {
    return this._crosshairStore
  }

  /**
   * 获取事件数据存储
   * @returns
   */
  actionStore () {
    return this._actionStore
  }

  /**
   * 刷新
   * @param invalidateLevel
   */
  invalidate (invalidateLevel) {
    this._handler.invalidate(invalidateLevel)
  }

  /**
   * 十字光标变化
   * @param data
   */
  crosshairChange (data) {
    this._handler.crosshair(data)
  }

  /**
   * 获取拖拽Pane标记
   * @return {boolean}
   */
  dragPaneFlag () {
    return this._dragPaneFlag
  }

  /**
   * 设置拖拽Pane标记
   * @param flag
   */
  setDragPaneFlag (flag) {
    this._dragPaneFlag = flag
  }
}
