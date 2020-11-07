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

import OnePointLineGraphicMark from './OnePointLineGraphicMark'
import { checkPointOnStraightLine } from './graphicHelper'
import { MousePointOnGraphicType } from './GraphicMark'

export default class VerticalStraightLine extends OnePointLineGraphicMark {
  _checkMousePointOnLine (point, xyPoints) {
    if (checkPointOnStraightLine(
      xyPoints[0], { x: xyPoints[0].x, y: this._yAxis.height() }, point
    )) {
      return {
        mousePointOnGraphicType: MousePointOnGraphicType.LINE,
        mousePointOnGraphicIndex: 0
      }
    }
  }

  _generatedDrawLines (xyPoints) {
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
}
