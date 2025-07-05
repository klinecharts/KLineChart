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

import { formatPrecision } from '../../common/utils/format'
import { SymbolDefaultPrecisionConstants } from '../../common/SymbolInfo'
import { isFunction, isNumber, isValid } from '../../common/utils/typeChecks'

import type { OverlayTemplate } from '../../component/Overlay'

const simpleTag: OverlayTemplate = {
  name: 'simpleTag',
  totalStep: 2,
  styles: {
    line: { style: 'dashed' }
  },
  createPointFigures: ({ bounding, coordinates }) => ({
    type: 'line',
    attrs: {
      coordinates: [
        { x: 0, y: coordinates[0].y },
        { x: bounding.width, y: coordinates[0].y }
      ]
    },
    ignoreEvent: true
  }),
  createYAxisFigures: ({ chart, overlay, coordinates, bounding, yAxis }) => {
    const isFromZero = yAxis?.isFromZero() ?? false
    let textAlign: CanvasTextAlign = 'left'
    let x = 0
    if (isFromZero) {
      textAlign = 'left'
      x = 0
    } else {
      textAlign = 'right'
      x = bounding.width
    }
    let text = ''
    if (isValid(overlay.extendData)) {
      if (!isFunction(overlay.extendData)) {
        text = (overlay.extendData ?? '') as string
      } else {
        text = overlay.extendData(overlay) as string
      }
    }
    if (!isValid(text) && isNumber(overlay.points[0].value)) {
      text = formatPrecision(overlay.points[0].value, chart.getSymbol()?.pricePrecision ?? SymbolDefaultPrecisionConstants.PRICE)
    }
    return { type: 'text', attrs: { x, y: coordinates[0].y, text, align: textAlign, baseline: 'middle' } }
  }
}

export default simpleTag
