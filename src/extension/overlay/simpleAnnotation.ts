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

import { OverlayTemplate } from '../../component/Overlay'

const simpleAnnotation: OverlayTemplate = {
  name: 'simpleAnnotation',
  createPointFigures: ({ overlay, coordinates }) => {
    const text = overlay.extendData(overlay) as string
    const startX = coordinates[0].x
    const startY = coordinates[0].y - 6
    const lineEndY = startY - 50
    const arrowEndY = lineEndY - 5
    return [
      {
        type: 'line',
        attrs: { coordinates: [{ x: startX, y: startY }, { x: startX, y: lineEndY }] },
        ignoreEvent: true
      },
      {
        type: 'polygon',
        attrs: { coordinates: [{ x: startX, y: lineEndY }, { x: startX - 4, y: arrowEndY }, { x: startX + 4, y: arrowEndY }] },
        ignoreEvent: true
      },
      {
        type: 'rectText',
        attrs: { x: startX, y: arrowEndY, text, align: 'center', baseline: 'bottom' },
        ignoreEvent: true
      }
    ]
  }
}

export default simpleAnnotation
