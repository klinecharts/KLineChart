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
import { checkPointOnStraightLine } from '../utils/graphic'
import { MousePointOnGraphicType } from './GraphicMark'

export default class FibonacciLine extends TwoPointLineGraphicMark {
  _checkMousePointOnLine (point, xyPoints) {
    const lines = this._generatedDrawLines(xyPoints)
    lines.forEach((points, index) => {
      if (checkPointOnStraightLine(points[0], points[1], point)) {
        return {
          mousePointOnGraphicType: MousePointOnGraphicType.LINE,
          mousePointOnGraphicIndex: index
        }
      }
    })
  }

  _generatedDrawLines (xyPoints) {
    const lines = []
    if (xyPoints.length > 0) {
      const startX = 0
      const endX = this._xAxis.width()
      lines.push([{ x: startX, y: xyPoints[0].y }, { x: endX, y: xyPoints[0].y }])
      if (xyPoints.length > 1) {
        const yDistance = xyPoints[0].y - xyPoints[1].y
        lines.push([{ x: startX, y: xyPoints[1].y + yDistance * 0.786 }, { x: endX, y: xyPoints[1].y + yDistance * 0.786 }])
        lines.push([{ x: startX, y: xyPoints[1].y + yDistance * 0.618 }, { x: endX, y: xyPoints[1].y + yDistance * 0.618 }])
        lines.push([{ x: startX, y: xyPoints[1].y + yDistance * 0.5 }, { x: endX, y: xyPoints[1].y + yDistance * 0.5 }])
        lines.push([{ x: startX, y: xyPoints[1].y + yDistance * 0.382 }, { x: endX, y: xyPoints[1].y + yDistance * 0.382 }])
        lines.push([{ x: startX, y: xyPoints[1].y + yDistance * 0.236 }, { x: endX, y: xyPoints[1].y + yDistance * 0.236 }])
        lines.push([{ x: startX, y: xyPoints[1].y }, { x: endX, y: xyPoints[1].y }])
      }
    }
    return lines
  }
}
