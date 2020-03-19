import ChartSeries, { CANDLE_STICK_SERIES_TAG } from './series/ChartSeries'

export default class Chart {
  constructor (container, styleOptions) {
    this._chartSeries = new ChartSeries(container, styleOptions)
  }

  resize () {
    this._chartSeries.measureSeriesSize()
  }

  clearData () {
    this._chartSeries.chartData().clearDataList()
  }

  applyStyleOptions (options) {
    this._chartSeries.applyStyleOptions(options)
  }

  applyNewData (dataList) {
    this._chartSeries.applyNewData(dataList)
  }

  applyMoreData (dataList) {
    this._chartSeries.applyMoreData(dataList)
  }

  updateData (data) {
    this._chartSeries.updateData(data)
  }

  setCandleStickTechnicalIndicatorType (technicalIndicatorType) {
    this._chartSeries.setTechnicalIndicatorType(CANDLE_STICK_SERIES_TAG, technicalIndicatorType)
  }

  setTechnicalIndicatorType (tag, technicalIndicatorType) {
    this._chartSeries.setTechnicalIndicatorType(tag, technicalIndicatorType)
  }

  addTechnicalIndicator (technicalIndicatorType) {
    return this._chartSeries.createTechnicalIndicator(technicalIndicatorType)
  }

  removeTechnicalIndicator (tag) {
    this._chartSeries.removeTechnicalIndicator(tag)
  }
}
