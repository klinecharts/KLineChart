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
import { GraphicMarkDrawStep } from './GraphicMark'

export default class ThreePointLineGraphicMark extends LineGraphicMark {
  mouseMoveForDrawing (point) {
    const dataIndex = this._xAxis.convertFromPixel(point.x)
    const timestamp = this._chartData.dataIndexToTimestamp(dataIndex)
    const price = this._yAxis.convertFromPixel(point.y)
    switch (this._drawStep) {
      case GraphicMarkDrawStep.STEP_1: {
        this._tpPoints = [{ timestamp, price, dataIndex }]
        break
      }
      case GraphicMarkDrawStep.STEP_2: {
        this._tpPoints[1] = { timestamp, price, dataIndex }
        break
      }
      case GraphicMarkDrawStep.STEP_3: {
        this._tpPoints[2] = { timestamp, price, dataIndex }
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
        this._drawStep = GraphicMarkDrawStep.FINISHED
        break
      }
    }
  }
}
