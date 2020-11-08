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
import { HoverType } from './GraphicMark'

export default class VerticalSegmentLine extends SegmentLine {
  mousePressedMove (point) {
    if (this._hoverType === HoverType.POINT && this._hoverIndex !== -1) {
      const dataIndex = this._xAxis.convertFromPixel(point.x)
      const timestamp = this._chartData.dataIndexToTimestamp(dataIndex)
      this._tpPoints[0].timestamp = timestamp
      this._tpPoints[0].dataIndex = dataIndex
      this._tpPoints[1].timestamp = timestamp
      this._tpPoints[1].dataIndex = dataIndex
      this._tpPoints[this._hoverIndex].price = this._yAxis.convertFromPixel(point.y)
    }
  }

  _mouseMoveForDrawingExtendFuc ({ timestamp, dataIndex }) {
    this._tpPoints[0].timestamp = timestamp
    this._tpPoints[0].dataIndex = dataIndex
  }
}
