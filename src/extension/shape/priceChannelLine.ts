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

import { getParallelLines } from './parallelStraightLine'

const priceChannelLine: PickRequired<Partial<Shape>, 'name' | 'totalStep' | 'createDataSource'> = {
  name: 'priceChannelLine',
  totalStep: 4,
  createDataSource: ({ coordinates, bounding }) => {
    return [
      {
        type: 'line',
        attrs: getParallelLines(coordinates, bounding, 1)
      }
    ]
  }
}

export default priceChannelLine
