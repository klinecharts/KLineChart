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
import { checkPointOnRayLine, getLinearY } from './graphicHelper'
import { MousePointOnGraphicType } from './GraphicMark'

export default class RayLine extends TwoPointLineGraphicMark {
  _checkMousePointOnLine (point, xyPoints) {
    if (checkPointOnRayLine(xyPoints[0], xyPoints[1], point)) {
      return {
        mousePointOnGraphicType: MousePointOnGraphicType.LINE,
        mousePointOnGraphicIndex: 0
      }
    }
  }

  _generatedDrawLines (xyPoints) {
    let point
    if (xyPoints[0].x === xyPoints[1].x && xyPoints[0].y !== xyPoints[1].y) {
      if (xyPoints[0].y < xyPoints[1].y) {
        point = {
          x: xyPoints[0].x,
          y: this._yAxis.height()
        }
      } else {
        point = {
          x: xyPoints[0].x,
          y: 0
        }
      }
    } else if (xyPoints[0].x > xyPoints[1].x) {
      point = {
        x: 0,
        y: getLinearY(xyPoints[0], xyPoints[1], [{ x: 0, y: xyPoints[0].y }])[0]
      }
    } else {
      point = {
        x: this._xAxis.width(),
        y: getLinearY(xyPoints[0], xyPoints[1], [{ x: this._xAxis.width(), y: xyPoints[0].y }])[0]
      }
    }
    return [[xyPoints[0], point]]
  }
}
