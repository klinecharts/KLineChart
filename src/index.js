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

import { version, init, dispose, extension } from './index.blank'

import horizontalRayLine from './extension/mark/horizontalRayLine'
import horizontalSegment from './extension/mark/horizontalSegment'
import horizontalStraightLine from './extension/mark/horizontalStraightLine'

import verticalRayLine from './extension/mark/verticalRayLine'
import verticalSegment from './extension/mark/verticalSegment'
import verticalStraightLine from './extension/mark/verticalStraightLine'

import rayLine from './extension/mark/rayLine'
import segment from './extension/mark/segment'
import straightLine from './extension/mark/straightLine'

import parallelStraightLine from './extension/mark/parallelStraightLine'
import priceChannelLine from './extension/mark/priceChannelLine'
import priceLine from './extension/mark/priceLine'
import fibonacciLine from './extension/mark/fibonacciLine'

extension.addShapeTemplate([
  horizontalRayLine, horizontalSegment, horizontalStraightLine,
  verticalRayLine, verticalSegment, verticalStraightLine,
  rayLine, segment, straightLine,
  parallelStraightLine, priceChannelLine, priceLine, fibonacciLine
])

export { version, init, dispose, extension }
