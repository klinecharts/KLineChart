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

import {
  HORIZONTAL_STRAIGHT_LINE,
  VERTICAL_STRAIGHT_LINE,
  STRAIGHT_LINE,
  HORIZONTAL_RAY_LINE,
  VERTICAL_RAY_LINE,
  RAY_LINE,
  HORIZONTAL_SEGMENT_LINE,
  VERTICAL_SEGMENT_LINE,
  SEGMENT_LINE,
  PRICE_LINE,
  PRICE_CHANNEL_LINE,
  PARALLEL_STRAIGHT_LINE,
  FIBONACCI_LINE
} from './defaultGraphicMarkType'

import HorizontalStraightLine from './HorizontalStraightLine'
import HorizontalSegmentLine from './HorizontalSegmentLine'
import HorizontalRayLine from './HorizontalRayLine'
import VerticalStraightLine from './VerticalStraightLine'
import VerticalSegmentLine from './VerticalSegmentLine'
import VerticalRayLine from './VerticalRayLine'
import StraightLine from './StraightLine'
import RayLine from './RayLine'
import SegmentLine from './SegmentLine'
import PriceLine from './PriceLine'
import ParallelStraightLine from './ParallelStraightLine'
import PriceChannelLine from './PriceChannelLine'
import FibonacciLine from './FibonacciLine'

export function createGraphicMarkMapping () {
  return {
    [HORIZONTAL_STRAIGHT_LINE]: HorizontalStraightLine,
    [VERTICAL_STRAIGHT_LINE]: VerticalStraightLine,
    [STRAIGHT_LINE]: StraightLine,
    [HORIZONTAL_RAY_LINE]: HorizontalRayLine,
    [VERTICAL_RAY_LINE]: VerticalRayLine,
    [RAY_LINE]: RayLine,
    [HORIZONTAL_SEGMENT_LINE]: HorizontalSegmentLine,
    [VERTICAL_SEGMENT_LINE]: VerticalSegmentLine,
    [SEGMENT_LINE]: SegmentLine,
    [PRICE_LINE]: PriceLine,
    [PRICE_CHANNEL_LINE]: PriceChannelLine,
    [PARALLEL_STRAIGHT_LINE]: ParallelStraightLine,
    [FIBONACCI_LINE]: FibonacciLine
  }
}
