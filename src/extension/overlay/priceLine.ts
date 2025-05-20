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

import type { OverlayTemplate } from '../../component/Overlay'

const priceLine: OverlayTemplate = {
  name: 'priceLine',
  totalStep: 2,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ chart, coordinates, bounding, overlay, yAxis }) => {
    let precision = 0
    if (yAxis?.isInCandle() ?? true) {
      precision = chart.getSymbol()?.pricePrecision ?? 2
    } else {
      const indicators = chart.getIndicators({ paneId: overlay.paneId })
      indicators.forEach(indicator => {
        precision = Math.max(precision, indicator.precision)
      })
    }
    const { value = 0 } = (overlay.points)[0]
    return [
      {
        type: 'line',
        attrs: { coordinates: [coordinates[0], { x: bounding.width, y: coordinates[0].y }] }
      },
      {
        type: 'text',
        ignoreEvent: true,
        attrs: {
          x: coordinates[0].x,
          y: coordinates[0].y,
          text: chart.getDecimalFold().format(chart.getThousandsSeparator().format(value.toFixed(precision))),
          baseline: 'bottom'
        }
      }
    ]
  }
}

export default priceLine
