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

import type Coordinate from '../../common/Coordinate'
import type Bounding from '../../common/Bounding'

import { type OverlayTemplate } from '../../component/Overlay'

import { type LineAttrs, getLinearSlopeIntercept } from '../figure/line'

/**
 * 获取平行线
 * @param coordinates
 * @param bounding
 * @param extendParallelLineCount
 * @returns {Array}
 */
export function getParallelLines (coordinates: Coordinate[], bounding: Bounding, extendParallelLineCount?: number): LineAttrs[] {
  const count = extendParallelLineCount ?? 0
  const lines: LineAttrs[] = []
  if (coordinates.length > 1) {
    if (coordinates[0].x === coordinates[1].x) {
      const startY = 0
      const endY = bounding.height
      lines.push({ coordinates: [{ x: coordinates[0].x, y: startY }, { x: coordinates[0].x, y: endY }] })
      if (coordinates.length > 2) {
        lines.push({ coordinates: [{ x: coordinates[2].x, y: startY }, { x: coordinates[2].x, y: endY }] })
        const distance = coordinates[0].x - coordinates[2].x
        for (let i = 0; i < count; i++) {
          const d = distance * (i + 1)
          lines.push({ coordinates: [{ x: coordinates[0].x + d, y: startY }, { x: coordinates[0].x + d, y: endY }] })
        }
      }
    } else {
      const startX = 0
      const endX = bounding.width
      const kb = getLinearSlopeIntercept(coordinates[0], coordinates[1])!
      const k = kb[0]
      const b = kb[1]
      lines.push({ coordinates: [{ x: startX, y: startX * k + b }, { x: endX, y: endX * k + b }] })
      if (coordinates.length > 2) {
        const b1 = coordinates[2].y - k * coordinates[2].x
        lines.push({ coordinates: [{ x: startX, y: startX * k + b1 }, { x: endX, y: endX * k + b1 }] })
        const distance = b - b1
        for (let i = 0; i < count; i++) {
          const b2 = b + distance * (i + 1)
          lines.push({ coordinates: [{ x: startX, y: startX * k + b2 }, { x: endX, y: endX * k + b2 }] })
        }
      }
    }
  }
  return lines
}

const parallelStraightLine: OverlayTemplate = {
  name: 'parallelStraightLine',
  totalStep: 4,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ coordinates, bounding }) => {
    return [
      {
        type: 'line',
        attrs: getParallelLines(coordinates, bounding)
      }
    ]
  }
}

export default parallelStraightLine
