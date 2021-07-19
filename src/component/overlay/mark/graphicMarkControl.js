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
import { logWarn } from '../../../utils/logger'

import extension from '../../../data/extension'

import GraphicMark from './GraphicMark'

/**
 * 创建图形标记映射
 * @return {{}}
 */
export function createGraphicMarkTemplateMapping () {
  const mapping = {}
  const extensions = extension.graphicMarkExtensions
  for (const name in extensions) {
    const TemplateClass = createGraphicMarkTemplateClass(extensions[name])
    if (TemplateClass) {
      mapping[name] = TemplateClass
    }
  }
  return mapping
}

/**
 * 创建图形标记类
 * @param name
 * @param totalStep
 * @param checkMousePointOn
 * @param createGraphicDataSource
 * @param performMousePressedMove
 * @param performMouseMoveForDrawing
 * @param drawExtend
 * @return {Mark|null}
 */
export function createGraphicMarkTemplateClass ({
  name, totalStep, checkMousePointOn, createGraphicDataSource,
  performMousePressedMove, performMouseMoveForDrawing, drawExtend
}) {
  if (
    !name ||
    !isNumber(totalStep) ||
    !isFunction(checkMousePointOn) ||
    !isFunction(createGraphicDataSource)
  ) {
    logWarn('', '', 'Required attribute "name" and "totalStep", method "checkMousePointOn" and "createGraphicDataSource", new graphic mark cannot be generated!!!')
    return null
  }
  class Mark extends GraphicMark {
    constructor ({
      id, chartData, xAxis, yAxis, points, styles, lock
    }) {
      super({
        id, name, totalStep, chartData, xAxis, yAxis, points, styles, lock
      })
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

/**
 * 获取图形标记信息
 * @param graphicMark
 * @return {{name, lock: *, styles, id, points: (*|*[])}}
 */
export function getGraphicMarkInfo (graphicMark) {
  return {
    name: graphicMark.name(),
    id: graphicMark.id(),
    totalStep: graphicMark.totalStep(),
    lock: graphicMark.lock(),
    points: graphicMark.points(),
    styles: graphicMark.styles()
  }
}
