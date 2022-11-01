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

import DeepPartial from '../common/DeepPartial'
import KLineData from '../common/KLineData'
import Precision from '../common/Precision'

import { isArray, isObject, merge, clone } from '../common/utils/typeChecks'
import { defaultStyles, Styles } from './styles'

import TimeScaleStore from './TimeScaleStore'
import IndicatorStore from './IndicatorStore'
import CrosshairStore from './CrosshairStore'
// import ShapeStore from './ShapeStore'
// import AnnotationStore from './AnnotationStore'
// import TagStore from './TagStore'
// import ActionStore from './ActionStore'

import ChartInternal from '../ChartInternal'

export interface VisibleData {
  dataIndex: number
  x: number
  data: KLineData
}

export default class ChartStore {
  //
  private readonly _chart: ChartInternal
  // 样式配置
  private readonly _styleOptions: Styles

  private _precision = { price: 2, volume: 0 }

  // 数据源
  private _dataList: KLineData[] = []

  // 调整pane标记
  private _dragPaneFlag = false

  // 时间轴缩放数据存储
  private readonly _timeScaleStore = new TimeScaleStore(this)
  // 技术指标数据存储
  private readonly _indicatorStore = new IndicatorStore(this)
  // 图形数据存储
  // private readonly _shapeStore = new ShapeStore(this)
  // // 注解数据存储
  // private readonly _annotationStore = new AnnotationStore(this)
  // 标签数据存储
  // private readonly _tagStore = new TagStore(this)
  // 十字光标数据存储
  private readonly _crosshairStore = new CrosshairStore(this)
  // 事件存储
  // private readonly _actionStore = new ActionStore()

  private _visibleDataList: VisibleData[] = []

  constructor (chart: ChartInternal, styleOptions?: DeepPartial<Styles>) {
    this._chart = chart
    this._styleOptions = clone(defaultStyles)
    merge(this._styleOptions, styleOptions)
  }

  /**
   * 调整可见数据
   */
  adjustVisibleDataList (): void {
    // 处理需要绘制的数据
    this._visibleDataList = []
    const { from, to } = this._timeScaleStore.getVisibleRange()
    for (let i = from; i < to; i++) {
      const kLineData = this._dataList[i]
      const x = this._timeScaleStore.dataIndexToCoordinate(i)
      this._visibleDataList.push({
        dataIndex: i,
        x,
        data: kLineData
      })
    }
    // this._annotationStore.createVisibleAnnotations()
  }

  /**
   * 获取样式配置
   * @return {{}}
   */
  getStyleOptions (): Styles {
    return this._styleOptions
  }

  /**
   * 设置样式配置
   * @param options
   */
  applyStyleOptions (options: DeepPartial<Styles>): ChartStore {
    merge(this._styleOptions, options)
    return this
  }

  /**
   * 价格精度
   * @returns {number}
   */
  getPrecision (): Precision {
    return this._precision
  }

  /**
   * 设置价格和数量精度
   * @param precision
   */
  setPrecision (precision: Precision): ChartStore {
    this._precision = precision
    this._indicatorStore.setSeriesPrecision(precision)
    return this
  }

  /**
   * 获取数据源
   * @returns {[]|*[]}
   */
  getDataList (): KLineData[] {
    return this._dataList
  }

  /**
   * 获取可见数据源
   * @returns {[]|*[]}
   */
  getVisibleDataList (): VisibleData[] {
    return this._visibleDataList
  }

  /**
   * 添加数据
   * @param data
   * @param pos
   * @param more
   */
  addData (data: KLineData | KLineData[], pos: number, more?: boolean): void {
    if (isObject(data)) {
      if (isArray(data)) {
        this._timeScaleStore.setLoading(false)
        this._timeScaleStore.setMore(more ?? true)
        const isFirstAdd = this._dataList.length === 0
        this._dataList = (data as KLineData[]).concat(this._dataList)
        if (isFirstAdd) {
          this._timeScaleStore.resetOffsetRightDistance()
        }
        this._timeScaleStore.adjustVisibleRange()
      } else {
        const dataSize = this._dataList.length
        if (pos >= dataSize) {
          this._dataList.push(data as KLineData)
          let offsetRightBarCount = this._timeScaleStore.getOffsetRightBarCount()
          if (offsetRightBarCount < 0) {
            this._timeScaleStore.setOffsetRightBarCount(--offsetRightBarCount)
          }
          this._timeScaleStore.adjustVisibleRange()
        } else {
          this._dataList[pos] = data as KLineData
          this.adjustVisibleDataList()
        }
      }
      this._crosshairStore.recalculate(true)
    }
  }

  /**
   * 清空数据源
   */
  clearDataList (): void {
    this._dataList = []
    this._visibleDataList = []
    this._timeScaleStore.clear()
  }

  /**
   * 获取时间缩放存储
   * @returns
   */
  getTimeScaleStore (): TimeScaleStore {
    return this._timeScaleStore
  }

  /**
   * 获取技术指标存储
   * @returns
   */
  getIndicatorStore (): IndicatorStore {
    return this._indicatorStore
  }

  // /**
  //  * 获取图形存储
  //  * @returns
  //  */
  // getShapeStore (): ShapeStore {
  //   return this._shapeStore
  // }

  // /**
  //  * 获取注解存储
  //  * @returns
  //  */
  // getAnnotationStore (): AnnotationStore {
  //   return this._annotationStore
  // }

  // /**
  //  * 获取标签数据存储
  //  * @returns
  //  */
  // getTagStore (): TagStore {
  //   return this._tagStore
  // }

  /**
   * 获取十字光标数据存储
   * @returns
   */
  getCrosshairStore (): CrosshairStore {
    return this._crosshairStore
  }

  // /**
  //  * 获取事件数据存储
  //  * @returns
  //  */
  // getActionStore (): ActionStore {
  //   return this._actionStore
  // }

  getChart (): ChartInternal {
    return this._chart
  }

  /**
   * 十字光标变化
   * @param data
   */
  // crosshairChange (data: any): void {
  //   this._handler.crosshair(data)
  // }

  /**
   * 获取拖拽Pane标记
   * @return {boolean}
   */
  getDragPaneFlag (): boolean {
    return this._dragPaneFlag
  }

  /**
   * 设置拖拽Pane标记
   * @param flag
   */
  setDragPaneFlag (flag: boolean): ChartStore {
    this._dragPaneFlag = flag
    return this
  }
}
