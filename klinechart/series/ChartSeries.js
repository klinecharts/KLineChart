import ChartData from '../data/ChartData'

export default class ChartSeries {
  constructor (container, styleOptions) {
    this._chartData = new ChartData(styleOptions)
  }
}
