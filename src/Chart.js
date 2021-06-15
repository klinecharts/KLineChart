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

 import ChartPane from './pane/ChartPane'
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

   setLocales (locales) {
     if (locales) {
      this._chartPane.chartData().setLocales(locales)
      this._chartPane.adjustPaneViewport(true, true, true, true, true)
     }
   }
 
   /**
    * 加载技术指标参数
    * @param technicalIndicatorType
    * @param params
    */
   setTechnicalIndicatorParams (technicalIndicatorType, params) {
     if (technicalIndicatorType) {
       this._chartPane.applyTechnicalIndicatorParams(technicalIndicatorType, params)
     }
   }
 
   /**
    * 获取技术指标参数配置
    * @param technicalIndicatorType
    * @returns {function(Array<string>, string, string): Promise}
    */
   getTechnicalIndicatorParams (technicalIndicatorType) {
     return this._chartPane.chartData().technicalIndicatorCalcParams(technicalIndicatorType)
   }
 
   /**
    * 设置价格数量精度
    * @param pricePrecision
    * @param volumePrecision
    */
   setPriceVolumePrecision (pricePrecision, volumePrecision) {
     if (!isValid(pricePrecision) || !isNumber(pricePrecision) || pricePrecision < 0) {
       if (DEV) {
         console.warn('Invalid parameter: pricePrecision!!!')
       }
       return
     }
     if (!isValid(volumePrecision) || !isNumber(volumePrecision) || volumePrecision < 0) {
       if (DEV) {
         console.warn('Invalid parameter: volumePrecision!!!')
       }
       return
     }
     this._chartPane.chartData().applyPriceVolumePrecision(pricePrecision, volumePrecision)
   }
 
   /**
    * 设置技术指标精度
    * @param precision
    * @param technicalIndicatorType
    */
   setTechnicalIndicatorPrecision (precision, technicalIndicatorType) {
     if (!isValid(precision) || !isNumber(precision) || precision < 0) {
       if (DEV) {
         console.warn('Invalid parameter: precision!!!')
       }
       return
     }
     this._chartPane.chartData().applyTechnicalIndicatorPrecision(precision, technicalIndicatorType)
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
         console.warn('Invalid parameter: barCount!!!')
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
         console.warn('Invalid parameter: barCount!!!')
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
         console.warn('Invalid parameter: dataList, dataList be an array!!!')
       }
       return
     }
     this._chartPane.applyNewData(dataList, more)
   }
 
   setChartType (type) {
     const isMobile = this.isMobileView()
     this.setStyleOptions({ candle: { type } })
     const onZoomCallback = this._chartPane.chartData()._onZoomCallback
     const zoomSettings = this._chartPane.chartData().styleOptions().zoomSettings
     const deviceType = isMobile ? 'mobile' : 'desktop'

     switch (type) {
       case"area":
         this._chartPane.setDataSpaceRange(zoomSettings.area.min, zoomSettings.area.max)
         this.setDataSpace(zoomSettings.area.initial[deviceType])
         onZoomCallback && onZoomCallback(zoomSettings.area.initial[deviceType])
         break;
       case "ohlc":
         this._chartPane.setDataSpaceRange(zoomSettings.ohlc.min, zoomSettings.ohlc.max)
         this.setDataSpace(zoomSettings.ohlc.initial[deviceType])
         onZoomCallback && onZoomCallback(zoomSettings.ohlc.initial[deviceType])
         break;
       case "candle_solid":
         this._chartPane.setDataSpaceRange(zoomSettings.candle_solid.min, zoomSettings.candle_solid.max)
         this.setDataSpace(zoomSettings.candle_solid.initial[deviceType])
         onZoomCallback && onZoomCallback(zoomSettings.candle_solid.initial[deviceType])
         break;
     }
   }

   setZoom (zoomRatio) {
    this._chartPane.chartData().setZoom(zoomRatio)
   }

   setOnZoomCallback (callback) {
    this._chartPane.chartData().setOnZoomCallback(callback)
   }

   setZoomSettings (zoomSettings) {
    this.setStyleOptions({ zoomSettings })
   }
 
   setLastOnline (timestamp) {
     this._chartPane.setLastOnline(timestamp)
   }
 
   setMobileView (bool) {
     this._chartPane.setMobileView(bool)
     this.setStyleOptions({
       crosshair: { show: !bool },
       binany: { tradeDuration: { text: { show: !bool } } }
     })
   }
 
   isMobileView () {
     return this._chartPane.isMobileView()
   }
 
   setUserCurrency (obj) {
     this._chartPane.setUserCurrency(obj)
   }
 
   setTimeFrame (timeframe) {
     this._chartPane.setTimeFrame(timeframe)
   }
 
   setTradeDuration (duration) {
     this._chartPane.setTradeDuration(duration)
   }
 
   setTrades (trades) {
     this._chartPane.setTrades(trades)
   }
 
   setData (dataList) {
     if (!isArray(dataList)) {
       if (DEV) {
         console.warn('Invalid parameter: dataList, dataList be an array!!!')
       }
       return
     }

     this._chartPane.setData(dataList)
   }
 
   /**
    * 添加历史更多数据
    * @param dataList
    * @param more
    */
   applyMoreData (dataList, more) {
     if (!isArray(dataList)) {
       if (DEV) {
         console.warn('Invalid parameter: dataList, dataList be an array!!!')
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
     const count = Math.round(this._chartPane._container.offsetWidth / this._chartPane.chartData()._dataSpace)
     this._chartPane.chartData().loadMore(cb, count)
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
   createPane (type, options) {
     return this._chartPane.createPane(type, options)
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
    * @param technicalIndicator
    * @param paneId
    */
   removeTechnicalIndicator (technicalIndicator, paneId) {
     this._chartPane.removeTechnicalIndicator(technicalIndicator, paneId)
   }
 
   /**
    * 添加图形标记
    * @param type
    */
   addGraphicMark (type) {
     const graphicMarkMapping = this._chartPane.chartData().graphicMarkMapping()
     if (!(type in graphicMarkMapping)) {
       if (DEV) {
         console.warn('Graphic mark type not found!!!')
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
         console.warn('Draw action type does not exist!!!')
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
         console.warn('Draw action type does not exist!!!')
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
 