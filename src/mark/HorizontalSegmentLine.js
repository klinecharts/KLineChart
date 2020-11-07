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

import SegmentLine from './SegmentLine'
import { MousePointOnGraphicType } from './GraphicMark'

export default class HorizontalSegmentLine extends SegmentLine {
  mousePressedMove (point) {
    if (this._mousePointOnGraphicType === MousePointOnGraphicType.POINT && this._mousePointOnGraphicIndex !== -1) {
      this._points[this._mousePointOnGraphicIndex].xPos = this._xAxis.convertFromPixel(point.x)
      const price = this._yAxis.convertFromPixel(point.y)
      this._points[0].price = price
      this._points[1].price = price
    }
  }

  _mouseMoveForDrawingExtendFuc ({ xPos, price }) {
    this._points[0].price = price
  }
}
