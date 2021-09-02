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

import Shape, { ShapeMouseOperateElement } from '../../component/overlay/Shape'

import { InvalidateLevel } from '../constants'

export default class ShapeStore {
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
        element: ShapeMouseOperateElement.NONE,
        elementIndex: -1
      },
      hover: {
        id: '',
        element: ShapeMouseOperateElement.NONE,
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
    const extensions = extension.shapeExtensions
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
   * @param checkEventCoordinateOnShape
   * @param createShapeDataSource
   * @param performEventPressedMove
   * @param performEventMoveForDrawing
   * @param drawExtend
   * @return
   */
  _createTemplateClass ({
    name, totalStep,
    checkEventCoordinateOnShape,
    createShapeDataSource,
    performEventPressedMove,
    performEventMoveForDrawing,
    drawExtend
  }) {
    if (
      !name ||
      !isNumber(totalStep) ||
      !isFunction(checkEventCoordinateOnShape) ||
      !isFunction(createShapeDataSource)
    ) {
      logWarn('', '', 'Required attribute "name" and "totalStep", method "checkEventCoordinateOnShape" and "createShapeDataSource", new shape cannot be generated!!!')
      return null
    }
    class Template extends Shape {
      constructor ({
        id, chartData, xAxis, yAxis, points, styles, lock, data
      }) {
        super({
          id, name, totalStep, chartData, xAxis, yAxis, points, styles, lock, data
        })
      }
    }
    Template.prototype.checkEventCoordinateOnShape = checkEventCoordinateOnShape
    Template.prototype.createShapeDataSource = createShapeDataSource
    if (isFunction(performEventPressedMove)) {
      Template.prototype.performEventPressedMove = performEventPressedMove
    }
    if (isFunction(performEventMoveForDrawing)) {
      Template.prototype.performEventMoveForDrawing = performEventMoveForDrawing
    }
    if (isFunction(drawExtend)) {
      Template.prototype.drawExtend = drawExtend
    }
    return Template
  }

  /**
   * 添加自定义标记图形
   * @param templates
   */
  addTemplate (templates) {
    templates.forEach(tmp => {
      const Template = this._createTemplateClass(tmp)
      if (Template) {
        this._templates[tmp.name] = Template
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
    const { id, styles, lock, mode, data } = options
    const defaultStyles = this._chartData.styleOptions().shape
    if (isValid(id)) {
      const instance = this._instances.find(gm => gm.id() === id)
      if (instance) {
        instance.setLock(lock)
        instance.setMode(mode)
        if (instance.setStyles(styles, defaultStyles) || instance.setData(data)) {
          this._chartData.invalidate(InvalidateLevel.OVERLAY)
        }
      }
    } else {
      let shouldInvalidate = false
      this._instances.forEach(instance => {
        instance.setLock(lock)
        instance.setMode(mode)
        if (instance.setStyles(styles, defaultStyles) || instance.setData(data)) {
          shouldInvalidate = true
        }
      })
      if (shouldInvalidate) {
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
    const create = (instance) => {
      return {
        name: instance.name(),
        id: instance.id(),
        totalStep: instance.totalStep(),
        lock: instance.lock(),
        mode: instance.mode(),
        points: instance.points(),
        styles: instance.styles(),
        data: instance.data()
      }
    }
    if (id) {
      const instance = this._instances.find(gm => gm.id() === id)
      if (instance) {
        return create(instance)
      }
    } else {
      return this._instances.map(instance => {
        return create(instance)
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
