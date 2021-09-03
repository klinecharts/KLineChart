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
    // 进行中的实例
    this._progressInstance = {}
    // 图形实例
    this._instances = new Map()
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
   * @param instance
   * @param paneId
   */
  addInstance (instance, paneId) {
    const paneInstances = this.instances(paneId)
    if (paneInstances.find(shape => shape.id() === instance.id())) {
      return false
    }
    if (instance.isDrawing()) {
      this._progressInstance = { paneId, instance, fixed: isValid(paneId) }
    } else {
      if (!this._instances.has(paneId)) {
        this._instances.set(paneId, [])
      }
      this._instances.get(paneId).push(instance)
    }
    this._chartData.invalidate(InvalidateLevel.OVERLAY)
    return true
  }

  /**
   * 获取进行中的实例
   * @returns
   */
  progressInstance () {
    return this._progressInstance
  }

  /**
   * 进行中的实例完成
   */
  progressInstanceComplete () {
    const instance = this._progressInstance.instance
    if (instance && !instance.isDrawing()) {
      if (!this._instances.has(this._progressInstance.paneId)) {
        this._instances.set(this._progressInstance.paneId, [])
      }
      this._instances.get(this._progressInstance.paneId).push(instance)
      this._progressInstance = {}
    }
  }

  /**
   * 更新进行中的实例
   * @param yAxis
   * @param paneId
   */
  updateProgressInstance (yAxis, paneId) {
    const { instance, fixed } = this._progressInstance
    if (instance && !fixed) {
      instance.setYAxis(yAxis)
      this._progressInstance.paneId = paneId
    }
  }

  /**
   * 获取图形标记的数据
   * @param paneId
   * @returns {{}}
   */
  instances (paneId) {
    return this._instances.get(paneId) || []
  }

  /**
   * 设置图形标记实例配置
   * @param options
   * @param paneId
   */
  setInstanceOptions (options = {}, paneId) {
    const { id, styles, lock, mode, data } = options
    const defaultStyles = this._chartData.styleOptions().shape
    let shouldInvalidate = false
    if (isValid(id)) {
      const update = (shapes) => {
        const instance = shapes.find(s => s.id() === id)
        instance.setLock(lock)
        instance.setMode(mode)
        if (instance.setStyles(styles, defaultStyles) || instance.setData(data)) {
          shouldInvalidate = true
        }
      }
      if (isValid(paneId)) {
        const shapes = this.instances(paneId)
        update(shapes)
      } else {
        this._instances.forEach(shapes => {
          update(shapes)
        })
      }
    } else {
      this._instances.forEach(shapes => {
        shapes.forEach(instance => {
          instance.setLock(lock)
          instance.setMode(mode)
          if (instance.setStyles(styles, defaultStyles) || instance.setData(data)) {
            shouldInvalidate = true
          }
        })
      })
    }
    if (shouldInvalidate) {
      this._chartData.invalidate(InvalidateLevel.OVERLAY)
    }
  }

  /**
   * 获取图形标记信息
   * @param id
   * @return {{name, lock: *, styles, id, points: (*|*[])}[]|{name, lock: *, styles, id, points: (*|*[])}}
   */
  getInstanceInfo (paneId, shapeId) {
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
    if (isValid(paneId)) {
      const shapes = this.instances(paneId)
      if (isValid(shapeId)) {
        const shape = shapes.find(s => s.id() === shapeId)
        if (shape) {
          return create(shape)
        }
      } else {
        return shapes.map(shape => create(shape))
      }
    } else {
      const infos = {}
      this._instances.forEach((shapes, paneId) => {
        infos[paneId] = shapes.map(shape => create(shape))
      })
      return infos
    }
    return null
  }

  /**
   * 移除图形实例
   * @param shapeId 参数
   * @param isProgress
   */
  removeInstance (paneId, shapeId) {
    let shouldInvalidate = false
    const progressInstance = this._progressInstance.instance
    if (progressInstance && progressInstance.id() === shapeId) {
      progressInstance.onRemove({ id: progressInstance.id() })
      this._progressInstance = {}
      shouldInvalidate = true
    } else {
      if (isValid(paneId)) {
        const shapes = this.instances(paneId)
        if (isValid(shapeId)) {
          const removeIndex = shapes.findIndex(shape => shape.id() === shapeId)
          if (removeIndex > -1) {
            shapes[removeIndex].onRemove({ id: shapes[removeIndex].id() })
            shapes.splice(removeIndex, 1)
            if (shapes.length === 0) {
              this._instances.delete(paneId)
            }
            shouldInvalidate = true
          }
        } else {
          if (shapes.length > 0) {
            shapes.forEach(shape => {
              shape.onRemove({ id: shape.id() })
            })
            this._instances.delete(paneId)
            shouldInvalidate = true
          }
        }
      } else {
        this._instances.forEach(shapes => {
          shapes.forEach(shape => {
            shape.onRemove({ id: shape.id() })
          })
        })
        this._instances.clear()
        shouldInvalidate = true
      }
    }
    if (shouldInvalidate) {
      this._chartData.invalidate(InvalidateLevel.OVERLAY)
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
    return this._progressInstance && this._progressInstance.instacne.isDrawing()
  }
}
