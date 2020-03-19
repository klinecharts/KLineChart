import Series from './Series'
import XAxisWidget from '../widget/XAxisWidget'
import XAxis from '../component/XAxis'

export default class XAxisSeries extends Series {
  constructor (container, chartData) {
    super(container, chartData)
    this._xAxis = new XAxis(chartData)
  }

  _createMainWidget (container) {
    return new XAxisWidget(container, this._chartData, this._xAxis)
  }

  xAxis () {
    return this._xAxis
  }

  _computeAxis () {
    this._xAxis.computeAxis()
  }
}
