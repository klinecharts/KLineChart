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

import { formatThousands, formatFoldDecimal } from '../../common/utils/format'
import { isNumber } from '../../common/utils/typeChecks'

import { type OverlayTemplate } from '../../component/Overlay'

import { type LineAttrs } from '../figure/line'
import { type TextAttrs } from '../figure/text'

const fibonacciLine: OverlayTemplate = {
  name: 'fibonacciLine',
  totalStep: 3,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ coordinates, bounding, overlay, precision, thousandsSeparator, decimalFoldThreshold, yAxis }) => {
    const points = overlay.points
    if (coordinates.length > 0) {
      const currentPrecision = (yAxis?.isInCandle() ?? true) ? precision.price : precision.excludePriceVolumeMax
      const lines: LineAttrs[] = []
      const texts: TextAttrs[] = []
      const startX = 0
      const endX = bounding.width
      if (coordinates.length > 1 && isNumber(points[0].value) && isNumber(points[1].value)) {
        const percents = [1, 0.786, 0.618, 0.5, 0.382, 0.236, 0]
        const yDif = coordinates[0].y - coordinates[1].y
        const valueDif = points[0].value - points[1].value
        percents.forEach(percent => {
          const y = coordinates[1].y + yDif * percent
          const value = formatFoldDecimal(formatThousands(((points[1].value ?? 0) + valueDif * percent).toFixed(currentPrecision), thousandsSeparator), decimalFoldThreshold)
          lines.push({ coordinates: [{ x: startX, y }, { x: endX, y }] })
          texts.push({
            x: startX,
            y,
            text: `${value} (${(percent * 100).toFixed(1)}%)`,
            baseline: 'bottom'
          })
        })
      }
      return [
        {
          type: 'line',
          attrs: lines
        }, {
          type: 'text',
          isCheckEvent: false,
          attrs: texts
        }
      ]
    }
    return []
  }
}

export default fibonacciLine
