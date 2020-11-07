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

import TwoPointLineGraphicMark from './TwoPointLineGraphicMark'
import { checkPointOnStraightLine, getLinearY } from './graphicHelper'
import { MousePointOnGraphicType } from './GraphicMark'

export default class StraightLine extends TwoPointLineGraphicMark {
  _checkMousePointOnLine (point, xyPoints) {
    if (checkPointOnStraightLine(xyPoints[0], xyPoints[1], point)) {
      return {
        mousePointOnGraphicType: MousePointOnGraphicType.LINE,
        mousePointOnGraphicIndex: 0
      }
    }
  }

  _generatedDrawLines (xyPoints) {
    if (xyPoints[0].x === xyPoints[1].x) {
      return [[
        {
          x: xyPoints[0].x,
          y: 0
        }, {
          x: xyPoints[0].x,
          y: this._yAxis.height()
        }
      ]]
    }
    const y = getLinearY(
      xyPoints[0], xyPoints[1],
      [
        {
          x: 0,
          y: xyPoints[0].y
        }, {
          x: this._xAxis.width(),
          y: xyPoints[0].y
        }
      ]
    )
    return [[
      {
        x: 0,
        y: y[0]
      }, {
        x: this._xAxis.width(),
        y: y[1]
      }
    ]]
  }
}
