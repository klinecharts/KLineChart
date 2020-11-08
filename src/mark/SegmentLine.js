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

import TwoPointLineGraphicMark from './TwoPointLineGraphicMark'
import { checkPointOnSegmentLine } from './graphicHelper'
import { HoverType } from './GraphicMark'

export default class SegmentLine extends TwoPointLineGraphicMark {
  _checkMousePointOnLine (point, xyPoints) {
    if (checkPointOnSegmentLine(xyPoints[0], xyPoints[1], point)) {
      return {
        hoverType: HoverType.LINE,
        hoverIndex: 0
      }
    }
  }

  _generatedDrawLines (xyPoints) {
    if (xyPoints.length === 2) {
      return [xyPoints]
    }
    return []
  }
}
