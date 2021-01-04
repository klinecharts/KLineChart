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

import { checkPointOnRayLine } from './graphicHelper'

export default {
  name: 'horizontalRayLine',
  series: 'twoPointLine',
  checkMousePointOnLine: (point1, point2, mousePoint) => {
    return checkPointOnRayLine(point1, point2, mousePoint)
  },
  generatedLines: (xyPoints, viewport) => {
    const point = { x: 0, y: xyPoints[0].y }
    if (xyPoints[1] && xyPoints[0].x < xyPoints[1].x) {
      point.x = viewport.width
    }
    return [[xyPoints[0], point]]
  },
  performMarkPoints: (tpPoints, pressedPointIndex, { dataIndex, timestamp, price }) => {
    tpPoints[pressedPointIndex].timestamp = timestamp
    tpPoints[pressedPointIndex].dataIndex = dataIndex
    tpPoints[0].price = price
    tpPoints[1].price = price
  },
  onMouseMoveForDrawingExtend: (tpPoints, { price }) => {
    tpPoints[0].price = price
  }
}
