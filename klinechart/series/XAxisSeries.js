import Series from './Series'
import XAxisWidget from '../widget/XAxisWidget'

export default class XAxisSeries extends Series {
  _createMainWidget (container) {
    return new XAxisWidget(container, this._chartData)
  }
}
