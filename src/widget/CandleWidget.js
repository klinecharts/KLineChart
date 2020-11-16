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

import CandleView from '../view/CandleView'
import CandleCrosshairView from '../view/CandleCrosshairView'
import TechnicalIndicatorWidget from './TechnicalIndicatorWidget'
import GraphicMarkView from '../view/GraphicMarkView'

export default class CandleWidget extends TechnicalIndicatorWidget {
  _createMainView (container, props) {
    return new CandleView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }

  _createExpandView (container, props) {
    return new GraphicMarkView(container, props.chartData)
  }

  _createCrosshairView (container, props) {
    return new CandleCrosshairView(container, props.chartData, props.xAxis, props.yAxis, props.additionalDataProvider)
  }
}
