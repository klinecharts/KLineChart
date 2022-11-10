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

import TypeOrNull from '../common/TypeOrNull'
import ExcludePickPartial from '../common/ExcludePickPartial'
import { UpdateLevel } from '../common/Updater'

import { createId } from '../common/utils/id'

import ChartStore from './ChartStore'

import AnnotationImp, { Annotation } from '../componentl/Annotation'
import { getAnnotationClass } from '../extension/annotation/index'

const ANNOTATION_ID_PREFIX = 'annotation_'

export default class AnnotationStore {
  private readonly _chartStore: ChartStore

  private readonly _instances: Map<string, Map<number, AnnotationImp[]>> = new Map()

  private readonly _instanceIds: Map<string, Map<string, number>> = new Map()

  private readonly _visibleInstances: Map<string, AnnotationImp[]> = new Map()

  private _hoverInstance: TypeOrNull<AnnotationImp> = null
  private _clickInstance: TypeOrNull<AnnotationImp> = null

  constructor (chartStore: ChartStore) {
    this._chartStore = chartStore
  }

  _overrideInstance (instance: AnnotationImp, annotation: ExcludePickPartial<Annotation, 'name' | 'point'>): boolean {
    const { id, point, extendData, styles, createPointFigures, createExtendFigures } = annotation
    let updateFlag = false
    if (id !== undefined && instance.setId(id)) {
      updateFlag = true
    }
    if (point !== undefined && instance.setPoint(point)) {
      updateFlag = true
    }
    if (extendData !== undefined && instance.setExtendData(extendData)) {
      updateFlag = true
    }
    if (styles !== undefined && instance.setStyles(styles)) {
      updateFlag = true
    }
    if (createPointFigures !== undefined && instance.setCreatePointFiguresCallback(createPointFigures)) {
      updateFlag = true
    }
    if (createExtendFigures !== undefined && instance.setCreateExtendFiguresCallback(createExtendFigures)) {
      updateFlag = true
    }
    return updateFlag
  }

  createVisibleInstances (): void {
    this._visibleInstances.clear()
    if (this._instances.size > 0) {
      this._chartStore.getVisibleDataList().forEach(({ data }) => {
        this._instances.forEach((paneInstances, paneId) => {
          if (paneInstances.size > 0) {
            const timestampInstances = paneInstances.get(data.timestamp) ?? []
            if (timestampInstances.length > 0) {
              for (const instance of timestampInstances) {
                const paneVisibleInstances = this._visibleInstances.get(paneId)
                if (paneVisibleInstances !== undefined) {
                  paneVisibleInstances.push(instance)
                } else {
                  this._visibleInstances.set(paneId, [instance])
                }
              }
            }
          }
        })
      })
    }
  }

  /**
   * 获取注解事件操作信息
   * @return {null}
   */
  getHoverInstance (): TypeOrNull<AnnotationImp> {
    return this._hoverInstance
  }

  /**
   * 设置事件操作信息
   * @param instance
   */
  setHoverInstance (instance?: AnnotationImp): void {
    if (this._hoverInstance?.id !== instance?.id) {
      this._hoverInstance = instance ?? null
    }
  }

  /**
   * 获取注解事件操作信息
   * @return {null}
   */
  getClickInstance (): TypeOrNull<AnnotationImp> {
    return this._clickInstance
  }

  /**
   * 设置事件操作信息
   * @param instance
   */
  setClickInstance (instance?: AnnotationImp): void {
    if (this._clickInstance?.id !== instance?.id) {
      this._clickInstance = instance ?? null
    }
  }

  /**
   * 创建注解
   * @param annotations
   * @param paneId
   */
  addInstances (annotations: Array<ExcludePickPartial<Annotation, 'name' | 'point'>>, paneId: string): Map<number, string[]> {
    if (!this._instances.has(paneId)) {
      this._instances.set(paneId, new Map<number, AnnotationImp[]>())
    }
    if (!this._instanceIds.has(paneId)) {
      this._instanceIds.set(paneId, new Map<string, number>())
    }
    const paneInstances = this._instances.get(paneId)
    const paneInstanceIds = this._instanceIds.get(paneId)
    let updateFlag = false
    const ids: Map<number, string[]> = new Map()
    annotations.forEach(annotation => {
      const timestamp = annotation.point.timestamp
      const timestampInstances = paneInstances?.get(timestamp)
      const AnnotationClazz = getAnnotationClass(annotation.name)
      if (AnnotationClazz !== null) {
        if (!ids.has(timestamp)) {
          ids.set(timestamp, [])
        }
        const timestampIds = ids.get(timestamp)
        updateFlag = true
        const instance = new AnnotationClazz()
        const id = annotation.id ?? createId(ANNOTATION_ID_PREFIX)
        timestampIds?.push(id)
        paneInstanceIds?.set(id, timestamp)
        annotation.id = id
        if (this._overrideInstance(instance, annotation)) {
          updateFlag = true
        }
        if (timestampInstances !== undefined) {
          timestampInstances.push(instance)
        } else {
          paneInstances?.set(timestamp, [instance])
        }
      }
    })
    if (updateFlag) {
      this.createVisibleInstances()
      this._chartStore.getChart().updatePane(UpdateLevel.OVERLAY, paneId)
    }
    return ids
  }

  /**
   * 获取注解
   * @param paneId
   * @returns
   */
  getInstances (paneId: string): AnnotationImp[] {
    return this._visibleInstances.get(paneId) ?? []
  }

  /**
   * 移除注解
   * @param paneId
   * @param ids
   */
  removeInstance (paneId?: string, ids?: string[]): void {
    let updateFlag = false
    if (paneId !== undefined) {
      const paneInstances = this._instances.get(paneId)
      const paneInstanceIds = this._instanceIds.get(paneId)
      if (paneInstances !== undefined) {
        if (ids !== undefined) {
          ids.forEach(id => {
            const timestamp = paneInstanceIds?.get(id)
            paneInstanceIds?.delete(id)
            if (timestamp !== undefined) {
              updateFlag = true
              const timestampInstances = paneInstances.get(timestamp) ?? []
              const removeIndex = timestampInstances.findIndex(instance => instance.id === id)
              timestampInstances.splice(removeIndex, 1)
              if (timestampInstances.length === 0) {
                paneInstances.delete(timestamp)
              }
            }
          })
          if (paneInstanceIds?.size === 0) {
            this._instanceIds.delete(paneId)
          }
          if (paneInstances.size === 0) {
            this._instances.delete(paneId)
          }
          if (updateFlag) {
            this.createVisibleInstances()
          }
        } else {
          updateFlag = true
          this._instances.delete(paneId)
          this._instances.delete(paneId)
          this._visibleInstances.delete(paneId)
        }
      }
    } else {
      updateFlag = true
      this._instanceIds.clear()
      this._instances.clear()
      this._visibleInstances.clear()
    }
    if (updateFlag) {
      this._chartStore.getChart().updatePane(UpdateLevel.OVERLAY, paneId)
    }
  }
}
