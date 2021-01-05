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

import { checkPointOnSegmentLine } from './graphicHelper'

export default {
  name: 'horizontalSegment',
  totalStep: 3,
  checkMousePointOn: (points, mousePoint) => {
    return checkPointOnSegmentLine(points[0], points[1], mousePoint)
  },
  createGraphicOptions: (tpPoints, xyPoints) => {
    let lines = []
    if (xyPoints.length === 2) {
      lines = [xyPoints]
    }
    return [
      {
        type: 'line',
        isDraw: true,
        isCheck: true,
        dataSource: lines
      }
    ]
  },
  performMousePressedMove: (tpPoints, pressedPointIndex, { price }) => {
    tpPoints[0].price = price
    tpPoints[1].price = price
  },
  performMouseMoveForDrawing: (step, tpPoints, { price }) => {
    if (step === 2) {
      tpPoints[0].price = price
    }
  }
}
