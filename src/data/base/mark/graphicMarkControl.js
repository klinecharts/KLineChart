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

import { isFunction } from '../../../utils/typeChecks'
import extension from '../../../extension/extension'

import { GraphicMarkSeries } from './GraphicMark'
import OnePointLineGraphicMark from './OnePointLineGraphicMark'
import TwoPointLineGraphicMark from './TwoPointLineGraphicMark'
import ThreePointLineGraphicMark from './ThreePointLineGraphicMark'

import { DEV } from '../../../utils/env'

/**
 * 创建图形标记映射
 * @return {{}}
 */
export function createGraphicMarkMapping () {
  const mapping = {}
  const markExtensions = extension.markExtensions
  for (const name in markExtensions) {
    const markClass = createMarkClass(markExtensions[name])
    if (markClass) {
      mapping[name] = markClass
    }
  }
  return mapping
}

/**
 * 创建图形标记类
 * @param name
 * @param series
 * @param checkMousePointOnLine
 * @param generatedLines
 * @param performMarkPoints
 * @param onMouseMoveForDrawingExtend
 * @param drawExtend
 * @return {Mark|null}
 */
export function createMarkClass ({
  name, series, checkMousePointOnLine, generatedLines,
  performMarkPoints, onMouseMoveForDrawingExtend, drawExtend
}) {
  if (
    !name ||
    !series ||
    !isFunction(checkMousePointOnLine) ||
    !isFunction(generatedLines)
  ) {
    if (DEV) {
      console.warn(
        'Required attribute "name" and "series", method "checkMousePointOnLine" and "generatedLines", new graphic mark cannot be generated!!!'
      )
    }
    return null
  }
  let ExtendClass
  switch (series) {
    case GraphicMarkSeries.ONE_POINT_LINE: {
      ExtendClass = OnePointLineGraphicMark
      break
    }
    case GraphicMarkSeries.TWO_POINT_LINE: {
      ExtendClass = TwoPointLineGraphicMark
      break
    }
    case GraphicMarkSeries.THREE_ONE_POINT_LINE: {
      ExtendClass = ThreePointLineGraphicMark
      break
    }
    default: { break }
  }
  if (ExtendClass) {
    class Mark extends ExtendClass {}
    Mark.prototype.checkMousePointOnLine = checkMousePointOnLine
    Mark.prototype.generatedLines = generatedLines
    if (isFunction(performMarkPoints)) {
      Mark.prototype.performMarkPoints = performMarkPoints
    }
    if (isFunction(onMouseMoveForDrawingExtend)) {
      Mark.prototype.onMouseMoveForDrawingExtend = onMouseMoveForDrawingExtend
    }
    if (isFunction(drawExtend)) {
      Mark.prototype.drawExtend = drawExtend
    }
    return Mark
  }
  return null
}
