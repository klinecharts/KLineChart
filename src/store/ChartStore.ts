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

import type Nullable from '../common/Nullable'
import type KLineData from '../common/KLineData'
import type Precision from '../common/Precision'
import type VisibleData from '../common/VisibleData'
import { getDefaultStyles, type Styles } from '../common/Styles'
import { isArray, isBoolean, isNumber, isString, isValid, merge } from '../common/utils/typeChecks'
import { formatValue } from '../common/utils/format'
import type LoadDataCallback from '../common/LoadDataCallback'
import { type LoadDataParams, LoadDataType } from '../common/LoadDataCallback'
import type LoadMoreCallback from '../common/LoadMoreCallback'
import { ActionType } from '../common/Action'

import { getDefaultCustomApi, type CustomApi, defaultLocale, type Options } from '../Options'

import TimeScaleStore from './TimeScaleStore'
import IndicatorStore from './IndicatorStore'
import TooltipStore from './TooltipStore'
import OverlayStore from './OverlayStore'
import ActionStore from './ActionStore'

import { getStyles } from '../extension/styles/index'

import type Chart from '../Chart'

export default class ChartStore {
  /**
   * Internal chart
   */
  private readonly _chart: Chart

  /**
   * Style config
   */
  private readonly _styles = getDefaultStyles()

  /**
   * Custom api
   */
  private readonly _customApi = getDefaultCustomApi()

  /**
   * language
   */
  private _locale = defaultLocale

  /**
   * Price and volume precision
   */
  private _precision = { price: 2, volume: 0 }

  /**
   * Thousands separator
   */
  private _thousandsSeparator = ','

  // Decimal fold threshold
  private _decimalFoldThreshold = 3

  /**
   * Data source
   */
  private _dataList: KLineData[] = []

  /**
   * Load more data callback
   * Since v9.8.0 deprecated, since v10 removed
   * @deprecated
   */
  private _loadMoreCallback: Nullable<LoadMoreCallback> = null

  /**
   * Load data callback
   */
  private _loadDataCallback: Nullable<LoadDataCallback> = null

  /**
   * Is loading data flag
   */
  private _loading = true

  /**
   * Whether there are forward more flag
   */
  private _forwardMore = true

  /**
   * Whether there are forward more flag
   */
  private _backwardMore = true

  /**
   * Time scale store
   */
  private readonly _timeScaleStore = new TimeScaleStore(this)

  /**
   * Indicator store
   */
  private readonly _indicatorStore = new IndicatorStore(this)

  /**
   * Overlay store
   */
  private readonly _overlayStore = new OverlayStore(this)

  /**
   * Tooltip store
   */
  private readonly _tooltipStore = new TooltipStore(this)

  /**
   * Chart action store
   */
  private readonly _actionStore = new ActionStore()

  /**
   * Visible data array
   */
  private _visibleDataList: VisibleData[] = []

  constructor (chart: Chart, options?: Options) {
    this._chart = chart
    this.setOptions(options)
  }

  /**
   * @description Adjust visible data
   * @return {*}
   */
  adjustVisibleDataList (): void {
    this._visibleDataList = []
    const { realFrom, realTo } = this._timeScaleStore.getVisibleRange()
    for (let i = realFrom; i < realTo; i++) {
      const kLineData = this._dataList[i]
      const x = this._timeScaleStore.dataIndexToCoordinate(i)
      this._visibleDataList.push({
        dataIndex: i,
        x,
        data: kLineData
      })
    }
  }

  setOptions (options?: Options): this {
    if (isValid(options)) {
      const { locale, timezone, styles, customApi, thousandsSeparator, decimalFoldThreshold } = options
      if (isString(locale)) {
        this._locale = locale
      }
      if (isString(timezone)) {
        this._timeScaleStore.setTimezone(timezone)
      }
      if (isValid(styles)) {
        if (isString(styles)) {
          merge(this._styles, getStyles(styles))
        } else {
          merge(this._styles, styles)
        }
      }
      if (isValid(customApi)) {
        merge(this._customApi, customApi)
      }
      if (isString(thousandsSeparator)) {
        this._thousandsSeparator = thousandsSeparator
      }
      if (isNumber(decimalFoldThreshold)) {
        this._decimalFoldThreshold = decimalFoldThreshold
      }
    }
    return this
  }

  getStyles (): Styles {
    return this._styles
  }

  getLocale (): string {
    return this._locale
  }

  getCustomApi (): CustomApi {
    return this._customApi
  }

  getThousandsSeparator (): string {
    return this._thousandsSeparator
  }

  getDecimalFoldThreshold (): number {
    return this._decimalFoldThreshold
  }

  getPrecision (): Precision {
    return this._precision
  }

  setPrecision (precision: Precision): this {
    this._precision = precision
    this._indicatorStore.setSeriesPrecision(precision)
    return this
  }

  getDataList (): KLineData[] {
    return this._dataList
  }

  getVisibleDataList (): VisibleData[] {
    return this._visibleDataList
  }

  async addData (data: KLineData | KLineData[], isFirstAdd: boolean, more?: boolean): Promise<void> {
    let success = false
    if (isArray<KLineData>(data)) {
      if (isFirstAdd) {
        this.clear()
        this._dataList = data
        this._forwardMore = more ?? true
        this._timeScaleStore.resetOffsetRightDistance()
      } else {
        this._dataList = data
        if (isBoolean(more)) {
          this._forwardMore = more
        }
      }
      this._loading = false
      success = true
    } else {
      const dataCount = this._dataList.length
      // Determine where individual data should be added
      const timestamp = data.timestamp
      const lastDataTimestamp = formatValue(this._dataList[dataCount - 1], 'timestamp', 0) as number
      if (timestamp > lastDataTimestamp) {
        this._dataList.push(data)
        let lastBarRightSideDiffBarCount = this._timeScaleStore.getLastBarRightSideDiffBarCount()
        if (lastBarRightSideDiffBarCount < 0) {
          this._timeScaleStore.setLastBarRightSideDiffBarCount(--lastBarRightSideDiffBarCount)
        }
        success = true
      } else if (timestamp === lastDataTimestamp) {
        this._dataList[dataCount - 1] = data
        success = true
      }
    }
    if (success) {
      this._timeScaleStore.adjustVisibleRange()
      this._tooltipStore.recalculateCrosshair(true)
      try {
        await this._indicatorStore.calcInstance()
        this._chart.adjustPaneViewport(false, true, true, true)
        this._actionStore.execute(ActionType.OnDataReady)
      } catch {}
    }
  }

  setLoadMoreCallback (callback: LoadMoreCallback): void {
    this._loadMoreCallback = callback
  }

  executeLoadMoreCallback (timestamp: Nullable<number>): void {
    if (this._forwardMore && !this._loading && isValid(this._loadMoreCallback)) {
      this._loading = true
      this._loadMoreCallback(timestamp)
    }
  }

  setLoadDataCallback (callback: LoadDataCallback): void {
    this._loadDataCallback = callback
  }

  executeLoadDataCallback (params: Omit<LoadDataParams, 'callback'>): void {
    if (
      !this._loading &&
      isValid(this._loadDataCallback) &&
      (
        (this._forwardMore && params.type === LoadDataType.Forward) ||
        (this._backwardMore && params.type === LoadDataType.Backward)
      )
    ) {
      const cb: ((data: KLineData[], more?: boolean) => void) = (data: KLineData[], more?: boolean) => {
        let dataList: KLineData[] = []
        if (params.type === LoadDataType.Backward) {
          dataList = this._dataList.concat(data)
          this._backwardMore = more ?? false
        } else {
          dataList = data.concat(this._dataList)
          this._forwardMore = more ?? false
        }
        this.addData(dataList, false).then(() => {}).catch(() => {})
      }
      this._loading = true
      this._loadDataCallback({ ...params, callback: cb })
    }
  }

  clear (): void {
    this._forwardMore = true
    this._backwardMore = true
    this._loading = true
    this._dataList = []
    this._visibleDataList = []
    this._timeScaleStore.clear()
    this._tooltipStore.clear()
  }

  getTimeScaleStore (): TimeScaleStore {
    return this._timeScaleStore
  }

  getIndicatorStore (): IndicatorStore {
    return this._indicatorStore
  }

  getOverlayStore (): OverlayStore {
    return this._overlayStore
  }

  getTooltipStore (): TooltipStore {
    return this._tooltipStore
  }

  getActionStore (): ActionStore {
    return this._actionStore
  }

  getChart (): Chart {
    return this._chart
  }
}
