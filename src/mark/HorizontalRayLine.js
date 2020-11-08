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

import RayLine from './RayLine'
import { HoverType } from './GraphicMark'

export default class HorizontalRayLine extends RayLine {
  mousePressedMove (point) {
    if (this._hoverType === HoverType.POINT && this._hoverIndex !== -1) {
      this._points[this._hoverIndex].xPos = this._xAxis.convertFromPixel(point.x)
      const price = this._yAxis.convertFromPixel(point.y)
      this._points[0].price = price
      this._points[1].price = price
    }
  }

  _mouseMoveForDrawingExtendFuc ({ xPos, price }) {
    this._points[0].price = price
  }

  _generatedDrawLines (xyPoints) {
    const point = { x: 0, y: xyPoints[0].y }
    if (xyPoints[1] && xyPoints[0].x < xyPoints[1].x) {
      point.x = this._xAxis.width()
    }
    return [[xyPoints[0], point]]
  }
}
