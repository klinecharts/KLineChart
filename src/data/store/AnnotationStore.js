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

import { isValid } from '../../utils/typeChecks'

import { InvalidateLevel } from '../constants'

export default class AnnotationStore {
  constructor (chartData) {
    this._chartData = chartData
    // 注解标记
    this._annotations = new Map()
    // 注解标记
    this._visibleAnnotations = new Map()
    // 注解鼠标操作信息
    this._mouseOperate = { id: '' }
  }

  /**
   * 获取注解鼠标操作信息
   * @return {null}
   */
  mouseOperate () {
    return this._mouseOperate
  }

  /**
   * 设置鼠标操作
   * @param operate
   */
  setMouseOperate (operate) {
    const { id } = this._mouseOperate
    if (operate && id !== operate.id) {
      this._mouseOperate = { ...operate }
      return true
    }
    return false
  }

  /**
   * 创建可见的注解数据
   */
  createVisibleAnnotations () {
    this._visibleAnnotations.clear()
    if (this._annotations.size > 0) {
      this._chartData.visibleDataList().forEach(({ data, x }) => {
        this._annotations.forEach((annotations, paneId) => {
          if (annotations.size > 0) {
            const annotation = annotations.get(data.timestamp) || []
            if (annotation.length > 0) {
              for (const an of annotation) {
                an.createSymbolCoordinate(x)
                if (this._visibleAnnotations.has(paneId)) {
                  this._visibleAnnotations.get(paneId).push(an)
                } else {
                  this._visibleAnnotations.set(paneId, [an])
                }
              }
            }
          }
        })
      })
    }
  }

  /**
   * 创建注解
   * @param annotations
   * @param paneId
   */
  add (annotations, paneId) {
    if (!this._annotations.has(paneId)) {
      this._annotations.set(paneId, new Map())
    }
    annotations.forEach(annotation => {
      const idAnnotations = this._annotations.get(paneId)
      if (idAnnotations.has(annotation.id())) {
        idAnnotations.get(annotation.id()).push(annotation)
      } else {
        idAnnotations.set(annotation.id(), [annotation])
      }
    })
    this.createVisibleAnnotations()
    this._chartData.invalidate(InvalidateLevel.OVERLAY)
  }

  /**
   * 获取注解
   * @param paneId
   * @returns
   */
  get (paneId) {
    return this._visibleAnnotations.get(paneId)
  }

  /**
   * 移除注解
   * @param paneId
   * @param point
   */
  remove (paneId, point) {
    let shouldAdjust = false
    if (isValid(paneId)) {
      if (this._annotations.has(paneId)) {
        if (isValid(point)) {
          const idAnnotations = this._annotations.get(paneId)
          const points = [].concat(point)
          points.forEach(({ timestamp }) => {
            if (idAnnotations.has(timestamp)) {
              shouldAdjust = true
              idAnnotations.delete(timestamp)
            }
          })
          if (shouldAdjust) {
            this.createVisibleAnnotations()
          }
        } else {
          shouldAdjust = true
          this._annotations.delete(paneId)
          this._visibleAnnotations.delete(paneId)
        }
      }
    } else {
      shouldAdjust = true
      this._annotations.clear()
      this._visibleAnnotations.clear()
    }
    if (shouldAdjust) {
      this._chartData.invalidate(InvalidateLevel.OVERLAY)
    }
  }

  /**
   * 是否为空
   * @returns
   */
  isEmpty () {
    return this._visibleAnnotations.size === 0
  }
}
