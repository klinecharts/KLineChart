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

import { version, init, dispose, extension, utils } from './index.blank'

import horizontalRayLine from './extension/shape/horizontalRayLine'
import horizontalSegment from './extension/shape/horizontalSegment'
import horizontalStraightLine from './extension/shape/horizontalStraightLine'

import verticalRayLine from './extension/shape/verticalRayLine'
import verticalSegment from './extension/shape/verticalSegment'
import verticalStraightLine from './extension/shape/verticalStraightLine'

import rayLine from './extension/shape/rayLine'
import segment from './extension/shape/segment'
import straightLine from './extension/shape/straightLine'

import parallelStraightLine from './extension/shape/parallelStraightLine'
import priceChannelLine from './extension/shape/priceChannelLine'
import priceLine from './extension/shape/priceLine'
import fibonacciLine from './extension/shape/fibonacciLine'

extension.addShapeTemplate([
  horizontalRayLine, horizontalSegment, horizontalStraightLine,
  verticalRayLine, verticalSegment, verticalStraightLine,
  rayLine, segment, straightLine,
  parallelStraightLine, priceChannelLine, priceLine, fibonacciLine
])

export { version, init, dispose, extension, utils }
