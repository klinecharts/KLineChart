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

import TechnicalIndicatorPane from './TechnicalIndicatorPane'
import CandleWidget from '../widget/CandleWidget'
import YAxis from '../component/axis/YAxis'

export default class CandlePane extends TechnicalIndicatorPane {
  _createYAxis (props) {
    return new YAxis(props.chartStore, true, props.id)
  }

  _createMainWidget (container, props) {
    return new CandleWidget({
      container,
      chartStore: props.chartStore,
      xAxis: props.xAxis,
      yAxis: this._yAxis,
      paneId: props.id
    })
  }
}
