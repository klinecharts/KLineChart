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

import { isFunction, isNumber } from '../../../utils/typeChecks'
import extension from '../../extension'

import GraphicMark from './GraphicMark'

import { DEV } from '../../../utils/env'

/**
 * 创建图形标记映射
 * @return {{}}
 */
export function createGraphicMarkMapping () {
  const mapping = {}
  const graphicMarkExtensions = extension.graphicMarkExtensions
  for (const name in graphicMarkExtensions) {
    const graphicMarkClass = createGraphicMarkClass(graphicMarkExtensions[name])
    if (graphicMarkClass) {
      mapping[name] = graphicMarkClass
    }
  }
  return mapping
}

/**
 * 创建图形标记类
 * @param name
 * @param series
 * @param checkMousePointOn
 * @param createGraphicDataSource
 * @param performMousePressedMove
 * @param performMouseMoveForDrawing
 * @param drawExtend
 * @return {Mark|null}
 */
export function createGraphicMarkClass ({
  name, totalStep, checkMousePointOn, createGraphicDataSource,
  performMousePressedMove, performMouseMoveForDrawing, drawExtend
}) {
  if (
    !name ||
    !isNumber(totalStep) ||
    !isFunction(checkMousePointOn) ||
    !isFunction(createGraphicDataSource)
  ) {
    if (DEV) {
      console.warn(
        'Required attribute "name" and "series", method "checkMousePointOn" and "createGraphicDataSource", new graphic mark cannot be generated!!!'
      )
    }
    return null
  }
  class Mark extends GraphicMark {
    constructor (id, chartData, xAxis, yAxis) {
      super(id, name, totalStep, chartData, xAxis, yAxis)
    }
  }
  Mark.prototype.checkMousePointOn = checkMousePointOn
  Mark.prototype.createGraphicDataSource = createGraphicDataSource
  if (isFunction(performMousePressedMove)) {
    Mark.prototype.performMousePressedMove = performMousePressedMove
  }
  if (isFunction(performMouseMoveForDrawing)) {
    Mark.prototype.performMouseMoveForDrawing = performMouseMoveForDrawing
  }
  if (isFunction(drawExtend)) {
    Mark.prototype.drawExtend = drawExtend
  }
  return Mark
}
