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

import { checkPointOnSegment } from './graphicHelper'

export default {
  name: 'horizontalSegment',
  totalStep: 3,
  checkMousePointOn: (key, type, coordinates, mouseCoordinate) => {
    return checkPointOnSegment(coordinates[0], coordinates[1], mouseCoordinate)
  },
  createGraphicDataSource: (step, points, coordinates) => {
    let lines = []
    if (coordinates.length === 2) {
      lines = [coordinates]
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
  performMousePressedMove: (points, pressedPointIndex, { value }) => {
    points[0].value = value
    points[1].value = value
  },
  performMouseMoveForDrawing: (step, points, { value }) => {
    if (step === 2) {
      points[0].value = value
    }
  }
}
