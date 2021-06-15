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

 import { isArray, isObject, merge, clone, isFunction, isBoolean, isValid } from '../utils/typeChecks'
 import { defaultStyleOptions } from './options/styleOptions'
 import { defaultLocales } from './options/locales'
 
 import { formatValue } from '../utils/format'
 import { createNewTechnicalIndicator, createTechnicalIndicatorMapping } from './technicalindicator/technicalIndicatorControl'
 import { DEV } from '../utils/env'
 import { TechnicalIndicatorSeries } from './technicalindicator/TechnicalIndicator'
 import Delegate from './delegate/Delegate'
 import { createGraphicMarkMapping } from '../mark/graphicMarkControl'
 import { binarySearchNearest } from '../utils/number'
 
 export const InvalidateLevel = {
   NONE: 0,
   GRAPHIC_MARK: 1,
   FLOAT_LAYER: 2,
   MAIN: 3,
   FULL: 4,
   ANIMATED_LAYER: 5,
 }
 
 export const DrawActionType = {
   DRAW_CANDLE: 'drawCandle',
   DRAW_TECHNICAL_INDICATOR: 'drawTechnicalIndicator'
 }
 
 const MIN_DATA_SPACE = 1
 const MAX_DATA_SPACE = 50
 
 export default class ChartData {
   constructor (styleOptions, invalidateHandler) {
     // 刷新持有者
     this._invalidateHandler = invalidateHandler
     // 样式配置
     this._styleOptions = clone(defaultStyleOptions)
     merge(this._styleOptions, styleOptions)
     // locales
     this._locales = clone(defaultLocales)
     // 所有技术指标映射
     this._technicalIndicatorMapping = createTechnicalIndicatorMapping()
 
     // 是否可以缩放
     this._zoomEnabled = true
     // 是否可以拖拽滑动
     this._scrollEnabled = true
 
     // 价格精度
     this._pricePrecision = 2
     // 数量精度
     this._volumePrecision = 0
 
     this._dateTimeFormat = new Intl.DateTimeFormat(
       'en', {
         hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
       }
     )
 
     // 数据源
     this._dataList = []
     this._timeframe = 0
     this._tradeDuration = 0
     this._trades = []
     this._lastOnline = 0
     this._isOnline = true
     this._isMobile = false
     this._userCurrency = {}
     this._onZoomCallback = null
 
     // 是否在加载中
     this._loading = true
     // 加载更多回调
     this._loadMoreCallback = null
     this._loadMoreCount = 0
     // 还有更多
     this._more = true
 
     // 可见区域数据占用的空间
     this._totalDataSpace = 0
     // 每一条数据的空间
     this._dataSpace = 6
     // bar的空间
     this._barSpace = this._calcBarSpace()
     // 向右偏移的空间
     this._offsetRightSpace = 50
     // 向右偏移的数量
     this._offsetRightBarCount = this._offsetRightSpace / this._dataSpace
     // 左边最小可见bar的个数
     this._leftMinVisibleBarCount = 2
     // 右边最小可见bar的个数
     this._rightMinVisibleBarCount = 2
     // 开始绘制的索引
     this._from = 0
     // 结束的索引
     this._to = 0
 
     // 十字光标信息
     this._crosshair = {}
     // 用来记录开始拖拽时向右偏移的数量
     this._preOffsetRightBarCount = 0
 
     // 拖拽标记图形标记
     this._dragGraphicMarkFlag = false
     // 图形标记映射
     this._graphicMarkMapping = createGraphicMarkMapping()
     // 绘图标记数据
     this._graphicMarks = []
 
     // 调整pane标记
     this._dragPaneFlag = false
 
     // 绘制事件代理
     this._drawActionDelegate = {
       [DrawActionType.DRAW_CANDLE]: new Delegate(),
       [DrawActionType.DRAW_TECHNICAL_INDICATOR]: new Delegate()
     }
 
     this._minDataSpace = MIN_DATA_SPACE
     this._maxDataSpace = MAX_DATA_SPACE
   }
 
   /**
    * 计算一条柱子的空间
    * @returns {number}
    * @private
    */
   _calcBarSpace () {
     const rateBarSpace = Math.floor(this._dataSpace * 0.8)
     const floorBarSpace = Math.floor(this._dataSpace)
     const optimalBarSpace = Math.min(rateBarSpace, floorBarSpace - 1)
     return Math.max(1, optimalBarSpace)
   }
 
   /**
    * 内部用来设置一条数据的空间
    * @param dataSpace
    * @returns {boolean}
    * @private
    */
   _innerSetDataSpace (dataSpace) {
     if (!dataSpace || dataSpace < this._minDataSpace || dataSpace > this._maxDataSpace || this._dataSpace === dataSpace) {
       return false
     }
     this._dataSpace = dataSpace
     this._barSpace = this._calcBarSpace()
     return true
   }
 
   /**
    * 调整绘制起点终点位置
    * @private
    */
   _adjustFromTo () {
     const dataSize = this._dataList.length
     const barLength = this._totalDataSpace / this._dataSpace
     const halfBarCount = this._barSpace / 2 / this._dataSpace
     const maxRightOffsetBarCount = barLength - Math.min(this._leftMinVisibleBarCount, dataSize) + (1 - halfBarCount)
     if (this._offsetRightBarCount > maxRightOffsetBarCount) {
       this._offsetRightBarCount = maxRightOffsetBarCount
     }
 
     const minRightOffsetBarCount = -dataSize + Math.min(this._rightMinVisibleBarCount, dataSize) + halfBarCount
 
     if (this._offsetRightBarCount < minRightOffsetBarCount) {
       this._offsetRightBarCount = minRightOffsetBarCount
     }
     this._to = Math.round(this._offsetRightBarCount + dataSize)
     this._from = Math.floor(this._to - barLength) - 1
     if (this._to > dataSize) {
       this._to = dataSize
     }
     if (this._from < 0) {
       this._from = 0
     }
     // 有更多并且没有在加载则去加载更多
     if (this._from === 0 && this._more && !this._loading && this._loadMoreCallback && isFunction(this._loadMoreCallback)) {
       this._loading = true
       this._loadMoreCallback(formatValue(this._dataList[0], 'timestamp'), this._loadMoreCount)
     }
   }
 
   /**
    * 获取样式配置
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
 
   getLocales () {
     return this._locales
   }

   setLocales (locales) {
    merge(this._locales, locales)
   }
 
   /**
    * 获取技术指标计算参数结合
    * @param technicalIndicatorType
    * @returns {function(Array<string>, string, string): Promise}
    */
   technicalIndicatorCalcParams (technicalIndicatorType) {
     const technical = this.technicalIndicator(technicalIndicatorType)
     if (technical) {
       return clone(technical.calcParams)
     }
     const calcParams = {}
     for (const name in this._technicalIndicatorMapping) {
       calcParams[name] = clone(this._technicalIndicatorMapping[name].calcParams)
     }
     return calcParams
   }
 
   /**
    * 根据指标类型获取指标类
    * @param technicalIndicatorType
    */
   technicalIndicator (technicalIndicatorType) {
     return this._technicalIndicatorMapping[technicalIndicatorType]
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
    * 获取时间格式化
    * @returns {Intl.DateTimeFormat | Intl.DateTimeFormat}
    */
   dateTimeFormat () {
     return this._dateTimeFormat
   }
 
   /**
    * 设置时区
    * @param timezone
    */
   setTimezone (timezone) {
     let dateTimeFormat
     try {
       dateTimeFormat = new Intl.DateTimeFormat(
         'en', {
           hour12: false, timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
         }
       )
     } catch (e) {
       if (DEV) {
         console.warn(e.message)
       }
     }
     if (dateTimeFormat) {
       this._dateTimeFormat = dateTimeFormat
     }
   }
 
   /**
    * 获取时区
    * @returns {null}
    */
   timezone () {
     return this._dateTimeFormat.resolvedOptions().timeZone
   }
 
   /**
    * 加载价格和数量精度
    * @param pricePrecision
    * @param volumePrecision
    */
   applyPriceVolumePrecision (pricePrecision, volumePrecision) {
     this._pricePrecision = pricePrecision
     this._volumePrecision = volumePrecision
     for (const name in this._technicalIndicatorMapping) {
       const series = this._technicalIndicatorMapping[name].series
       switch (series) {
         case TechnicalIndicatorSeries.PRICE: {
           this._technicalIndicatorMapping[name].setPrecision(pricePrecision)
           break
         }
         case TechnicalIndicatorSeries.VOLUME: {
           this._technicalIndicatorMapping[name].setPrecision(volumePrecision)
           break
         }
         default: { break }
       }
     }
   }
 
   /**
    * 加载技术指标精度
    * @param precision
    * @param technicalIndicatorType
    */
   applyTechnicalIndicatorPrecision (precision, technicalIndicatorType) {
     const technicalIndicator = this.technicalIndicator(technicalIndicatorType)
     if (technicalIndicator) {
       technicalIndicator.setPrecision(precision)
     } else {
       for (const name in this._technicalIndicatorMapping) {
         this._technicalIndicatorMapping[name].setPrecision(precision)
       }
     }
   }
 
   /**
    * 获取数据源
    * @returns {[]|*[]}
    */
   dataList () {
     return this._dataList
   }
 
   /**
    * 清空数据源
    */
   clearDataList () {
     this._more = true
     this._loading = true
     this._dataList = []
     this._from = 0
     this._to = 0
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
         this._loading = false
         this._more = isBoolean(more) ? more : true
         const isFirstAdd = this._dataList.length === 0
         this._dataList = data.concat(this._dataList)
         if (isFirstAdd) {
           this.setOffsetRightSpace(this._offsetRightSpace)
         } else {
           this._adjustFromTo()
         }
       } else {
         const dataSize = this._dataList.length
         if (pos >= dataSize) {
           this._dataList.push(data)
           if (this._offsetRightBarCount < 0) {
             this._offsetRightBarCount -= 1
           }
           this._adjustFromTo()
         } else {
           this._dataList[pos] = data
         }
       }
     }
   }
 
   setData (data) {
     if (isArray(data)) {
       this._loading = false
       const isFirstAdd = this._dataList.length === 0
 
       this._dataList = data
 
       if (isFirstAdd) {
         this.setOffsetRightSpace(this._offsetRightSpace)
       } else {
         this._adjustFromTo()
       }
 
       // detect necessary precision by last candles on the screen
       let necessaryPrecision = 2;
 
       for (let i = 0; i < 10 || i >= data.length; i++) {
         const currentCandle = data[i];
         const v = currentCandle.open || currentCandle.close || currentCandle.high || currentCandle.low;
         const numStr = v && v.toString() || "";
         const pos = numStr.indexOf('.') + 1;
         const numbersAfterDecimal = pos && numStr.length - pos;
 
         if (numbersAfterDecimal > necessaryPrecision) {
           necessaryPrecision = numbersAfterDecimal;
         }
       }
 
       this.applyPriceVolumePrecision(necessaryPrecision, necessaryPrecision);
     }
   }
 
   setLastOnline (timestamp) {
     this._lastOnline = timestamp
   }
 
   setOnlineStatus (bool) {
     this._isOnline = bool
   }
 
   isStatusOnline () {
     return this._isOnline
   }
 
   setMobileView (bool) {
     this._isMobile = bool
   }
 
   isMobileView () {
     return this._isMobile
   }
 
   setUserCurrency (obj) {
     this._userCurrency = obj
   }
 
   setTimeFrame (timeframe) {
     this._timeframe = timeframe
   }
 
   setTradeDuration (duration) {
     this._tradeDuration = duration
   }
 
   setTrades (trades) {
     this._trades = trades
   }
 
   setDataSpaceRange (min, max) {
     this._minDataSpace = min || 1
     this._maxDataSpace = max || 50
   }
 
   /**
    * 获取一条数据的空间
    * @returns {number}
    */
   dataSpace () {
     return this._dataSpace
   }
 
   /**
    * 获取绘制一条数据的空间（不包括bar之间的间隙）
    * @returns {*}
    */
   barSpace () {
     return this._barSpace
   }
 
   /**
    * 获取向右偏移的bar的数量
    * @returns {number}
    */
   offsetRightBarCount () {
     return this._offsetRightBarCount
   }
 
   /**
    * 设置一条数据的空间
    * @param dataSpace
    */
   setDataSpace (dataSpace) {
     if (this._innerSetDataSpace(dataSpace)) {
       this._adjustFromTo()
       this.invalidate()
     }

     if (isFunction(this._onZoomCallback)) {
      this._onZoomCallback(dataSpace)
     }
   }
 
   /**
    * 设置可见区域数据占用的总空间
    * @param totalSpace
    */
   setTotalDataSpace (totalSpace) {
     if (this._totalDataSpace === totalSpace) {
       return
     }
     this._totalDataSpace = totalSpace
     this._adjustFromTo()
   }
 
   /**
    * 设置右边可以偏移的空间
    * @param space
    */
   setOffsetRightSpace (space) {
     this._offsetRightSpace = space
     this._offsetRightBarCount = space / this._dataSpace
     this._adjustFromTo()
   }
 
   /**
    * 设置左边可见的最小bar数量
    * @param barCount
    */
   setLeftMinVisibleBarCount (barCount) {
     this._leftMinVisibleBarCount = barCount
   }
 
   /**
    * 设置右边可见的最小bar数量
    * @param barCount
    */
   setRightMinVisibleBarCount (barCount) {
     this._rightMinVisibleBarCount = barCount
   }
 
   /**
    * 获取数据绘制起点
    * @returns {number}
    */
   from () {
     return this._from
   }
 
   /**
    * 获取数据绘制终点
    * @returns {number}
    */
   to () {
     return this._to
   }
 
   /**
    * 获取十字光标信息
    * @returns {{}}
    */
   crosshair () {
     return this._crosshair
   }
 
   /**
    * 设置十字光标点所在的pane的标识
    * @param point
    * @param paneId
    */
   setCrosshairPointPaneId (point, paneId) {
     const p = point || {}
     if (
       this._crosshair.x !== p.x ||
       this._crosshair.y !== p.y ||
       this._crosshair.paneId !== paneId
     ) {
       this._crosshair = { ...point, paneId }
       this.invalidate(InvalidateLevel.FLOAT_LAYER)
     }
   }
 
   /**
    * 开始滚动
    */
   startScroll () {
     this._preOffsetRightBarCount = this._offsetRightBarCount
   }
 
   /**
    * 滚动
    * @param distance
    */
   scroll (distance) {
     if (!this._scrollEnabled) {
       return
     }
     const distanceBarCount = distance / this._dataSpace
     this._offsetRightBarCount = this._preOffsetRightBarCount - distanceBarCount
     this._adjustFromTo()
     this.invalidate()
   }
 
   /**
    * x转换成浮点数的位置
    * @param x
    * @returns {number}
    */
   coordinateToFloatIndex (x) {
     const dataSize = this._dataList.length
     const deltaFromRight = (this._totalDataSpace - x) / this._dataSpace
     const index = dataSize + this._offsetRightBarCount - deltaFromRight
     return Math.round(index * 1000000) / 1000000
   }
 
   /**
    * 数据索引转换成时间戳
    * @param dataIndex
    * @return {*}
    */
   dataIndexToTimestamp (dataIndex) {
     const data = this._dataList[dataIndex]
     if (data) {
       return data.timestamp
     }
   }
 
   /**
    * 将时间戳转换成数据索引位置
    * @param timestamp
    * @return {number}
    */
   timestampToDataIndex (timestamp) {
     if (this._dataList.length === 0) {
       return 0
     }
     return binarySearchNearest(this._dataList, 'timestamp', timestamp)
   }
 
   setOnZoomCallback (callback) {
     this._onZoomCallback = callback
   }

   /**
    * 缩放
    * @param scale
    * @param point
    */
   zoom (scale, point) {
     if (!this._zoomEnabled) {
       return
     }
     if (!point || isValid(point.x)) {
       point = { x: isValid(this._crosshair.x) ? this._crosshair.x : this._totalDataSpace / 2 }
     }
     const floatIndexAtZoomPoint = this.coordinateToFloatIndex(point.x)
     const dataSpace = this._dataSpace + scale * (this._dataSpace / 10)

     
     if (this._innerSetDataSpace(dataSpace)) {
       this._offsetRightBarCount += (floatIndexAtZoomPoint - this.coordinateToFloatIndex(point.x))
       this._adjustFromTo()
       this.invalidate()
      }

     if (isFunction(this._onZoomCallback)) {
      this._onZoomCallback(dataSpace)
     }
   }

   setZoom (dataSpace) {
    const pointX = this._totalDataSpace / 2
    const floatIndexAtZoomPoint = this.coordinateToFloatIndex(pointX)
    this.setDataSpace(dataSpace)
    this._offsetRightBarCount += (floatIndexAtZoomPoint - this.coordinateToFloatIndex(pointX))
    this._adjustFromTo()
    this.invalidate()
   }
 
  //  dataSpaceToZoomRatio (dataSpace) {
  //    return Math.round(Math.min(Math.max((dataSpace - this._minDataSpace) / (this._maxDataSpace - this._minDataSpace), 0), 1) * 100) / 100
  //  }

   zoomRatioToDataSpace (zoomRatio) {
    return Math.max(Math.min(Math.round((zoomRatio * (this._maxDataSpace - this._minDataSpace) + this._minDataSpace) * 100) / 100, this._maxDataSpace), this._minDataSpace)
   }

   /**
    * 刷新
    * @param invalidateLevel
    */
   invalidate (invalidateLevel) {
     this._invalidateHandler(invalidateLevel)
   }
 
   /**
    * 设置是否可以缩放
    * @param enabled
    */
   setZoomEnabled (enabled) {
     this._zoomEnabled = enabled
   }
 
   /**
    * 获取是否可以缩放
    * @return {boolean}
    */
   zoomEnabled () {
     return this._zoomEnabled
   }
 
   /**
    * 设置是否可以拖拽滚动
    * @param enabled
    */
   setScrollEnabled (enabled) {
     this._scrollEnabled = enabled
   }
 
   /**
    * 获取是否可以拖拽滚动
    * @return {boolean}
    */
   scrollEnabled () {
     return this._scrollEnabled
   }
 
   /**
    * 设置加载更多
    * @param callback
    */
   loadMore (callback, count) {
     this._loadMoreCount = count
     this._loadMoreCallback = callback
   }
 
   /**
    * 清空图形标记
    */
   clearGraphicMark () {
     if (this._graphicMarks.length > 0) {
       this._graphicMarks = []
       this.invalidate(InvalidateLevel.GRAPHIC_MARK)
     }
   }
 
   /**
    * 添加标记类型
    * @param graphicMark
    */
   addGraphicMark (graphicMark) {
     const lastGraphicMark = this._graphicMarks.last()
     if (lastGraphicMark && lastGraphicMark.isDrawing()) {
       this._graphicMarks[this._graphicMarks.length - 1] = graphicMark
     } else {
       this._graphicMarks.push(graphicMark)
     }
     this.invalidate(InvalidateLevel.GRAPHIC_MARK)
   }
 
   /**
    * 获取图形标记拖拽标记
    * @returns {boolean}
    */
   dragGraphicMarkFlag () {
     return this._dragGraphicMarkFlag
   }
 
   /**
    * 设置图形标记拖拽标记
    * @param flag
    */
   setDragGraphicMarkFlag (flag) {
     this._dragGraphicMarkFlag = flag
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
 
   /**
    * 获取图形标记映射
    * @returns {{}}
    */
   graphicMarkMapping () {
     return this._graphicMarkMapping
   }
 
   /**
    * 获取图形标记的数据
    * @returns {{}}
    */
   graphicMarks () {
     return this._graphicMarks
   }

   isGraphicMarkDrawing () {
    const graphicMarks = this.graphicMarks()
    const lastGraphicMark = graphicMarks.last()

    return lastGraphicMark && lastGraphicMark.isDrawing()
  }
 
   /**
    * 添加一个自定义指标
    * @param technicalIndicatorInfo
    */
   addCustomTechnicalIndicator (technicalIndicatorInfo) {
     const technicalIndicator = createNewTechnicalIndicator(technicalIndicatorInfo || {})
     if (technicalIndicator) {
       // 将生成的新的指标类放入集合
       this._technicalIndicatorMapping[technicalIndicatorInfo.name] = technicalIndicator
     }
   }
 
   /**
    * 获取绘制事件代理
    * @param type
    * @returns {Delegate}
    */
   drawActionDelegate (type) {
     return this._drawActionDelegate[type]
   }
 }
 