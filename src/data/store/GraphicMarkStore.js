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

import extension from '../extension'

import { isNumber, isFunction, isValid } from '../../utils/typeChecks'
import { logWarn } from '../../utils/logger'

import GraphicMark, { GraphicMarkMouseOperateElement } from '../../component/overlay/GraphicMark'

import { InvalidateLevel } from '../constants'

export default class GraphicMarkStore {
  constructor (chartData) {
    this._chartData = chartData
    // 拖拽标记图形标记
    this._dragFlag = false
    // 图形标记映射
    this._templates = this._createTemplates()
    // 图形标记鼠标操作信息
    this._mouseOperate = {
      click: {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      },
      hover: {
        id: '',
        element: GraphicMarkMouseOperateElement.NONE,
        elementIndex: -1
      }
    }
    // 绘图标记实例
    this._instances = []
  }

  /**
   * 创建模板
   * @returns
   */
  _createTemplates () {
    const templates = {}
    const extensions = extension.graphicMarkExtensions
    for (const name in extensions) {
      const TemplateClass = this._createTemplateClass(extensions[name])
      if (TemplateClass) {
        templates[name] = TemplateClass
      }
    }
    return templates
  }

  /**
   * 创建模板类
   * @param name
   * @param totalStep
   * @param checkMousePointOn
   * @param createGraphicDataSource
   * @param performMousePressedMove
   * @param performMouseMoveForDrawing
   * @param drawExtend
   * @return
   */
  _createTemplateClass ({
    name, totalStep,
    checkEventCoordinateOnGraphic,
    createGraphicDataSource,
    performEventPressedMove,
    performEventMoveForDrawing,
    drawExtend
  }) {
    if (
      !name ||
      !isNumber(totalStep) ||
      !isFunction(checkEventCoordinateOnGraphic) ||
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
    Mark.prototype.checkEventCoordinateOnGraphic = checkEventCoordinateOnGraphic
    Mark.prototype.createGraphicDataSource = createGraphicDataSource
    if (isFunction(performEventPressedMove)) {
      Mark.prototype.performEventPressedMove = performEventPressedMove
    }
    if (isFunction(performEventMoveForDrawing)) {
      Mark.prototype.performEventMoveForDrawing = performEventMoveForDrawing
    }
    if (isFunction(drawExtend)) {
      Mark.prototype.drawExtend = drawExtend
    }
    return Mark
  }

  /**
   * 创建实例信息
   * @param instance 实例
   */
  _createInstanceInfo (instance) {
    return {
      name: instance.name(),
      id: instance.id(),
      totalStep: instance.totalStep(),
      lock: instance.lock(),
      points: instance.points(),
      styles: instance.styles()
    }
  }

  /**
   * 添加自定义标记图形
   * @param graphicMarks
   */
  addTemplate (graphicMarks) {
    graphicMarks.forEach(mark => {
      const GraphicMarkClass = this._createTemplateClass(mark)
      if (GraphicMarkClass) {
        this._templates[mark.name] = GraphicMarkClass
      }
    })
  }

  /**
   * 获取图形标记模板类
   * @param name
   * @return {*}
   */
  getTemplate (name) {
    return this._templates[name]
  }

  /**
    * 是否有模板
    * @param name
    * @return
    */
  hasTemplate (name) {
    return !!this._templates[name]
  }

  /**
   * 添加标记实例
   * @param instacne
   */
  addInstance (instacne) {
    if (this._instances.find(gm => gm.id() === instacne.id())) {
      return false
    }
    if (this.isDrawing()) {
      this._instances[this._instances.length - 1] = instacne
    } else {
      this._instances.push(instacne)
    }
    this._chartData.invalidate(InvalidateLevel.OVERLAY)
    return true
  }

  /**
   * 获取图形标记的数据
   * @returns {{}}
   */
  instances () {
    return this._instances
  }

  /**
   * 设置图形标记实例配置
   * @param options
   */
  setInstanceOptions (options = {}) {
    const { id, styles, lock } = options
    const graphicMark = this._graphicMarks.find(gm => gm.id() === id)
    if (graphicMark) {
      graphicMark.setLock(lock)
      if (graphicMark.setStyles(styles, this._chartData.styleOptions().graphicMark)) {
        this._chartData.invalidate(InvalidateLevel.OVERLAY)
      }
    }
  }

  /**
   * 获取图形标记信息
   * @param id
   * @return {{name, lock: *, styles, id, points: (*|*[])}[]|{name, lock: *, styles, id, points: (*|*[])}}
   */
  getInstanceInfo (id) {
    if (id) {
      const graphicMark = this._instances.find(gm => gm.id() === id)
      if (graphicMark) {
        return this._createInstanceInfo(graphicMark)
      }
    } else {
      return this._instances.map(graphicMark => {
        return this._createInstanceInfo(graphicMark)
      })
    }
    return null
  }

  /**
   * 移除图形实例
   * @param id 参数
   */
  removeInstance (id) {
    const instances = this._instances
    if (isValid(id)) {
      const removeIndex = instances.findIndex(gm => gm.id() === id)
      if (removeIndex > -1) {
        instances[removeIndex].onRemove({ id: instances[removeIndex].id() })
        instances.splice(removeIndex, 1)
        this._chartData.invalidate(InvalidateLevel.OVERLAY)
      }
    } else {
      if (instances.length > 0) {
        instances.forEach(gm => {
          gm.onRemove({ id: gm.id() })
        })
        this._instances = []
        this._chartData.invalidate(InvalidateLevel.OVERLAY)
      }
    }
  }

  /**
   * 获取图形标记拖拽标记
   * @returns {boolean}
   */
  dragFlag () {
    return this._dragFlag
  }

  /**
   * 设置图形标记拖拽标记
   * @param flag
   */
  setDragFlag (flag) {
    this._dragFlag = flag
  }

  /**
   * 获取图形标记鼠标操作信息
   * @return {{hover: {id: string, elementIndex: number, element: string}, click: {id: string, elementIndex: number, element: string}}}
   */
  mouseOperate () {
    return this._mouseOperate
  }

  /**
   * 设置鼠标操作信息
   * @param mouseOperate
   * @return
   */
  setMouseOperate (mouseOperate) {
    const { hover, click } = this._mouseOperate
    let shouldInvalidate = false
    if (mouseOperate.hover &&
      (hover.id !== mouseOperate.hover.id || hover.element !== mouseOperate.hover.element || hover.elementIndex !== mouseOperate.hover.elementIndex)
    ) {
      this._mouseOperate.hover = { ...mouseOperate.hover }
      shouldInvalidate = true
    }
    if (mouseOperate.click &&
      (click.id !== mouseOperate.click.id || click.element !== mouseOperate.click.element || click.elementIndex !== mouseOperate.click.elementIndex)
    ) {
      this._mouseOperate.click = { ...mouseOperate.click }
      shouldInvalidate = true
    }
    return shouldInvalidate
  }

  /**
   * 是否为空
   * @returns
   */
  isEmpty () {
    return this._instances.length === 0
  }

  /**
   * 是否正在绘制
   * @return
   */
  isDrawing () {
    const last = this._instances[this._instances.length - 1]
    return last && last.isDrawing()
  }
}
