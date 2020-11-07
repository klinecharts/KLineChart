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

import LineGraphicMark from './LineGraphicMark'
import { GraphicMarkDrawStep } from '../event/GraphicMarkEventHandler'
import { GraphicMarkType } from '../data/ChartData'

export default class ThreePointLineGraphicMark extends LineGraphicMark {
  mousePressedMove (point) {
    const xPos = this._xAxis.convertFromPixel(point.x)
    const price = this._yAxis.convertFromPixel(point.y)
    switch (this._drawStep) {
      case GraphicMarkDrawStep.STEP_DONE: {
        this._points = [{ xPos, price }, { xPos, price }]
        this._drawStep = GraphicMarkDrawStep.STEP_1
        break
      }
      case GraphicMarkDrawStep.STEP_1: {
        this._points[0] = { xPos, price }
        this._points[1] = { xPos, price }
        break
      }
      case GraphicMarkDrawStep.STEP_2: {
        this._points[1] = { xPos, price }
        break
      }
      case GraphicMarkDrawStep.STEP_3: {
        this._points[2] = { xPos, price }
        break
      }
    }
  }

  mouseLeftButtonDownForDrawing () {
    switch (this._drawStep) {
      case GraphicMarkDrawStep.STEP_1: {
        this._drawStep = GraphicMarkDrawStep.STEP_2
        break
      }
      case GraphicMarkDrawStep.STEP_2: {
        this._drawStep = GraphicMarkDrawStep.STEP_3
        break
      }
      case GraphicMarkDrawStep.STEP_3: {
        this._drawStep = GraphicMarkDrawStep.STEP_DONE
        this._chartData.setGraphicMarkType(GraphicMarkType.NONE)
        break
      }
    }
  }
}
