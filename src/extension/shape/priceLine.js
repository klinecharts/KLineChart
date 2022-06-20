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

import { checkCoordinateOnRayLine } from './shapeHelper'

export default {
  name: 'priceLine',
  totalStep: 2,
  checkEventCoordinateOnShape: ({ dataSource, eventCoordinate }) => {
    return checkCoordinateOnRayLine(dataSource[0], dataSource[1], eventCoordinate)
  },
  createShapeDataSource: ({ points, coordinates, viewport, precision, yAxis }) => {
    return [
      {
        type: 'line',
        isDraw: true,
        isCheck: true,
        dataSource: [[coordinates[0], { x: viewport.width, y: coordinates[0].y }]]
      },
      {
        type: 'text',
        isDraw: true,
        isCheck: false,
        dataSource: [
          { x: coordinates[0].x, y: coordinates[0].y, text: points[0].value.toFixed(precision.price) }
        ]
      }
    ]
  }
}
