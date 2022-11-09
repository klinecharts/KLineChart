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

import PickRequired from '../../common/PickRequired'

import { Shape } from '../../componentl/Shape'

const priceLine: PickRequired<Partial<Shape>, 'name' | 'totalStep' | 'createFigures'> = {
  name: 'priceLine',
  totalStep: 2,
  createFigures: ({ coordinates, bounding, precision, shape }) => {
    const { value } = (shape.points)[0]
    return [
      {
        type: 'line',
        attrs: { coordinates: [coordinates[0], { x: bounding.width, y: coordinates[0].y }] }
      },
      {
        type: 'text',
        isCheck: false,
        attrs: { x: coordinates[0].x, y: coordinates[0].y, text: value.toFixed(precision.price) }
      }
    ]
  }
}

export default priceLine
