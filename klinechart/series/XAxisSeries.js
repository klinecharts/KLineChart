import Series from './Series'
import XAxisWidget from '../widget/XAxisWidget'
import XAxis from '../component/XAxis'

export default class XAxisSeries extends Series {
  _initBefore () {
    this._xAxis = new XAxis(this._chartData)
  }

  _createMainWidget (container, props) {
    return new XAxisWidget({ container, chartData: props.chartData, xAxis: this._xAxis })
  }

  _computeAxis () {
    this._xAxis.computeAxis()
  }

  xAxis () {
    return this._xAxis
  }

  setSize (mainWidgetSize, yAxisWidgetSize) {
    super.setSize(mainWidgetSize, yAxisWidgetSize)
    this._xAxis.setSize(mainWidgetSize.width, mainWidgetSize.height)
  }
}
