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

import AnnotationImp, { Annotation, AnnotationCreate } from '../componentl/Annotation'
import { getAnnotationClass } from '../extension/annotation/index'

export interface EventAnnotationInfo {
  paneId: string
  instance: TypeOrNull<AnnotationImp>
}

const ANNOTATION_ID_PREFIX = 'annotation_'

export default class AnnotationStore {
  private readonly _chartStore: ChartStore

  private readonly _instances: Map<string, Map<number, AnnotationImp[]>> = new Map()

  private readonly _instanceIds: Map<string, Map<string, number>> = new Map()

  private readonly _visibleInstances: Map<string, AnnotationImp[]> = new Map()

  private _hoverInstanceInfo: EventAnnotationInfo = { paneId: '', instance: null }

  private _clickInstanceInfo: EventAnnotationInfo = { paneId: '', instance: null }

  constructor (chartStore: ChartStore) {
    this._chartStore = chartStore
  }

  _overrideInstance (instance: AnnotationImp, annotation: ExcludePickPartial<Annotation, 'name' | 'point'>): boolean {
    const {
      id, point, extendData, styles, createPointFigures, createExtendFigures,
      onClick, onRightClick, onMouseEnter, onMouseLeave
    } = annotation
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
    if (onClick !== undefined) {
      instance.setOnClickCallback(onClick)
    }
    if (onRightClick !== undefined) {
      instance.setOnRightClickCallback(onRightClick)
    }
    if (onMouseEnter !== undefined) {
      instance.setOnMouseEnterCallback(onMouseEnter)
    }
    if (onMouseLeave !== undefined) {
      instance.setOnMouseLeaveCallback(onMouseLeave)
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
  getHoverInstanceInfo (): EventAnnotationInfo {
    return this._hoverInstanceInfo
  }

  /**
   * 设置事件操作信息
   * @param info
   */
  setHoverInstanceInfo (info: EventAnnotationInfo): void {
    const { instance } = this._hoverInstanceInfo
    if (instance?.id !== info.instance?.id) {
      this._hoverInstanceInfo = info
      instance?.onMouseLeave?.(instance)
      info.instance?.onMouseEnter?.(info.instance)
    }
  }

  /**
   * 获取注解事件操作信息
   * @return {null}
   */
  getClickInstanceInfo (): EventAnnotationInfo {
    return this._clickInstanceInfo
  }

  /**
   * 设置事件操作信息
   * @param info
   */
  setClickInstanceInfo (info: EventAnnotationInfo): void {
    const { paneId, instance } = this._clickInstanceInfo
    if (instance?.id !== info.instance?.id) {
      this._clickInstanceInfo = info
      info.instance?.onClick?.(info.instance)
      this._chartStore.getChart().updatePane(UpdateLevel.OVERLAY, info.paneId)
      if (paneId !== info.paneId) {
        this._chartStore.getChart().updatePane(UpdateLevel.OVERLAY, paneId)
      }
    }
  }

  /**
   * 创建注解
   * @param annotations
   * @param paneId
   */
  addInstances (annotations: AnnotationCreate[], paneId: string): Map<number, string[]> {
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
