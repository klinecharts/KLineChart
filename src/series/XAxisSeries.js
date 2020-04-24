/**
 * Copyright (c) 2019 lihu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
    this._xAxis.setSize(mainWidgetSize.width, mainWidgetSize.height)
    this._computeAxis()
    super.setSize(mainWidgetSize, yAxisWidgetSize)
  }
}
