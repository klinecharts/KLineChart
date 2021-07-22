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

import { checkCoordinateOnRayLine } from './graphicHelper'

export default {
  name: 'verticalRayLine',
  totalStep: 3,
  checkEventCoordinateOnGraphic: ({ dataSource, eventCoordinate }) => {
    return checkCoordinateOnRayLine(dataSource[0], dataSource[1], eventCoordinate)
  },
  createGraphicDataSource: ({ coordinates, viewport }) => {
    const point = { x: coordinates[0].x, y: 0 }
    if (coordinates[1] && coordinates[0].y < coordinates[1].y) {
      point.y = viewport.height
    }
    return [
      {
        type: 'line',
        isDraw: true,
        isCheck: true,
        dataSource: [[coordinates[0], point]]
      }
    ]
  },
  performEventPressedMove: ({ points, pressPoint }) => {
    points[0].timestamp = pressPoint.timestamp
    points[0].dataIndex = pressPoint.dataIndex
    points[1].timestamp = pressPoint.timestamp
    points[1].dataIndex = pressPoint.dataIndex
  },
  performEventMoveForDrawing: ({ step, points, movePoint }) => {
    if (step === 2) {
      points[0].timestamp = movePoint.timestamp
      points[0].dataIndex = movePoint.dataIndex
    }
  }
}
