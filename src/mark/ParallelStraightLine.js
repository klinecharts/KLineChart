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

import ThreePointLineGraphicMark from './ThreePointLineGraphicMark'
import { checkPointOnStraightLine, getParallelLines } from './graphicHelper'
import { MousePointOnGraphicType } from './GraphicMark'

export default class ParallelStraightLine extends ThreePointLineGraphicMark {
  _checkMousePointOnLine (point, xyPoints) {
    const lines = this._generatedDrawLines(xyPoints)
    for (let i = 0; i < lines.length; i++) {
      const points = lines[i]
      if (checkPointOnStraightLine(points[0], points[1], point)) {
        return {
          mousePointOnGraphicType: MousePointOnGraphicType.LINE,
          mousePointOnGraphicIndex: i
        }
      }
    }
  }

  _generatedDrawLines (xyPoints) {
    return getParallelLines(
      xyPoints, { width: this._xAxis.width(), height: this._yAxis.height() }
    )
  }
}
