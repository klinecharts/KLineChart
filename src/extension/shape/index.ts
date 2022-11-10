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

import ExcludePickPartial from '../../common/ExcludePickPartial'
import TypeOrNull from '../../common/TypeOrNull'

import ShapeImp, { Shape, ShapeConstructor } from '../../componentl/Shape'

import fibonacciLine from './fibonacciLine'
import horizontalRayLine from './horizontalRayLine'
import horizontalSegment from './horizontalSegment'
import horizontalStraightLine from './horizontalStraightLine'
import parallelStraightLine from './parallelStraightLine'
import priceChannelLine from './priceChannelLine'
import priceLine from './priceLine'
import rayLine from './rayLine'
import segment from './segment'
import straightLine from './straightLine'
import verticalRayLine from './verticalRayLine'
import verticalSegment from './verticalSegment'
import verticalStraightLine from './verticalStraightLine'

const shapes: { [key: string]: ShapeConstructor } = {}

const extensions = [
  fibonacciLine, horizontalRayLine, horizontalSegment, horizontalStraightLine,
  parallelStraightLine, priceChannelLine, priceLine, rayLine, segment,
  straightLine, verticalRayLine, verticalSegment, verticalStraightLine
]

extensions.forEach((shape: ExcludePickPartial<Shape, 'name' | 'totalStep' | 'createFigures'>) => {
  shapes[shape.name] = ShapeImp.extend(shape)
})

function registerShape (shape: ExcludePickPartial<Shape, 'name' | 'totalStep' | 'createFigures'>): void {
  shapes[shape.name] = ShapeImp.extend(shape)
}

function getShapeClass (name: string): TypeOrNull<ShapeConstructor> {
  return shapes[name] ?? null
}

export { registerShape, getShapeClass }
