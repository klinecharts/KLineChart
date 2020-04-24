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

import CandleStickView from '../view/CandleStickView'
import CandleStickFloatLayerView from '../view/CandleStickFloatLayerView'
import TechnicalIndicatorWidget from './TechnicalIndicatorWidget'
import { InvalidateLevel } from '../data/ChartData'
import GraphicMarkView from '../view/GraphicMarkView'

export default class CandleStickWidget extends TechnicalIndicatorWidget {
  _createMainView (container, props) {
    return new CandleStickView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }

  _createExpandView (container, props) {
    return new GraphicMarkView(container, props.chartData, props.xAxis, props.yAxis)
  }

  _createFloatLayerView (container, props) {
    return new CandleStickFloatLayerView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }

  invalidate (level) {
    if (level !== InvalidateLevel.GRAPHIC_MARK) {
      super.invalidate(level)
    }
    this._expandView.flush()
  }

  setSize (width, height) {
    super.setSize(width, height)
    this._expandView.setSize(width, height)
  }
}
