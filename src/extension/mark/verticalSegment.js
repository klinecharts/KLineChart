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
  name: 'verticalSegment',
  totalStep: 3,
  checkMousePointOn: (type, points, mousePoint) => {
    return checkPointOnSegmentLine(points[0], points[1], mousePoint)
  },
  createGraphicDataSource: (tpPoints, xyPoints) => {
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
  performMousePressedMove: (tpPoints, pressedPointIndex, { dataIndex, timestamp }) => {
    tpPoints[0].timestamp = timestamp
    tpPoints[0].dataIndex = dataIndex
    tpPoints[1].timestamp = timestamp
    tpPoints[1].dataIndex = dataIndex
  },
  performMouseMoveForDrawing: (step, tpPoints, { timestamp, dataIndex }) => {
    if (step === 2) {
      tpPoints[0].timestamp = timestamp
      tpPoints[0].dataIndex = dataIndex
    }
  }
}
