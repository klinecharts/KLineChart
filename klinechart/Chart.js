import ChartSeries, { CANDLE_STICK_SERIES_TAG } from './series/ChartSeries'

export default class Chart {
  constructor (container, styleOptions) {
    this._chartSeries = new ChartSeries(container, styleOptions)
  }

  resize () {
    this._chartSeries.chartData().adjustFromTo()
    this._chartSeries.measureSeriesSize()
  }

  setOffsetRightSpace (space) {
    this._chartSeries.chartData().setOffsetRightSpace(space)
  }

  setBarSpace (space) {
    this._chartSeries.chartData().setDataSpace(space)
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

  addTechnicalIndicator (technicalIndicatorType, height) {
    return this._chartSeries.createTechnicalIndicator(technicalIndicatorType, height)
  }

  removeTechnicalIndicator (tag) {
    this._chartSeries.removeTechnicalIndicator(tag)
  }
}
