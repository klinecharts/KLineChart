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

/**
 * brush overlay - freehand drawing with click and drag
 * Uses continuous drawing mode for smooth path creation
 */
const brush: OverlayTemplate = {
  name: 'brush',
  totalStep: 2,
  drawingMode: 'continuous',
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: false,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length < 2) {
      return []
    }
    return [
      {
        type: 'line',
        attrs: { coordinates },
        styles: {
          smooth: false,
          lineCap: 'round',
          lineJoin: 'round'
        }
      }
    ]
  }
}

export default brush
