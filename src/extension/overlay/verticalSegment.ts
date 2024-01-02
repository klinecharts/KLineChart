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

import { type OverlayTemplate } from '../../component/Overlay'

const verticalSegment: OverlayTemplate = {
  name: 'verticalSegment',
  totalStep: 3,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length === 2) {
      return [
        {
          type: 'line',
          attrs: { coordinates }
        }
      ]
    }
    return []
  },
  performEventPressedMove: ({ points, performPoint }) => {
    points[0].timestamp = performPoint.timestamp
    points[0].dataIndex = performPoint.dataIndex
    points[1].timestamp = performPoint.timestamp
    points[1].dataIndex = performPoint.dataIndex
  },
  performEventMoveForDrawing: ({ currentStep, points, performPoint }) => {
    if (currentStep === 2) {
      points[0].timestamp = performPoint.timestamp
      points[0].dataIndex = performPoint.dataIndex
    }
  }
}

export default verticalSegment
