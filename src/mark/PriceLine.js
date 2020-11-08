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

import OnePointLineGraphicMark from './OnePointLineGraphicMark'
import { checkPointOnRayLine } from './graphicHelper'
import { HoverType } from './GraphicMark'
import { formatPrecision } from '../utils/format'
import { getFont } from '../utils/canvas'

export default class PriceLine extends OnePointLineGraphicMark {
  _checkMousePointOnLine (point, xyPoints) {
    if (checkPointOnRayLine(xyPoints[0], { x: this._xAxis.width(), y: xyPoints[0].y }, point)) {
      return {
        hoverType: HoverType.LINE,
        hoverIndex: 0
      }
    }
  }

  _generatedDrawLines (xyPoints) {
    return [
      [xyPoints[0], { x: this._xAxis.width(), y: xyPoints[0].y }]
    ]
  }

  _drawGraphicExtend (ctx, lines, graphicMark) {
    const pricePrecision = this._chartData.pricePrecision()
    const point = lines[0][0]
    const price = this._yAxis.convertFromPixel(point.y)
    const priceText = formatPrecision(price, pricePrecision)
    ctx.font = getFont(graphicMark.text.size, graphicMark.text.weight, graphicMark.text.family)
    ctx.fillStyle = graphicMark.text.color
    ctx.fillText(priceText, point.x + graphicMark.text.marginLeft, point.y - graphicMark.text.marginBottom)
  }
}
