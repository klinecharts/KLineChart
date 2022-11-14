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
import { UpdateLevel } from '../common/Updater'

import { createId } from '../common/utils/id'

import OverlayImp, { OverlayConstructor, OverlayCreate } from '../component/Overlay'

import { getOverlayClass } from '../extension/overlay/index'

import ChartStore from './ChartStore'

import { PaneIdConstants } from '../pane/Pane'

const OVERLAY_ID_PREFIX = 'overlay_'

export interface ProgressOverlayInfo {
  paneId: string
  instance: OverlayImp
  appointPaneFlag: boolean
}

export const enum EventOverlayInfoElementType {
  NONE = 'none',
  POINT = 'point',
  OTHER = 'other'
}

export interface EventOverlayInfo {
  paneId: string
  instance: TypeOrNull<OverlayImp>
  elementType: EventOverlayInfoElementType
  elementIndex: number
}

export default class OverlayStore {
  private readonly _chartStore: ChartStore

  private readonly _instances = new Map<string, OverlayImp[]>()
  private _progressInstanceInfo: TypeOrNull<ProgressOverlayInfo> = null

  private _pressedInstanceInfo: EventOverlayInfo = {
    paneId: '',
    instance: null,
    elementType: EventOverlayInfoElementType.NONE,
    elementIndex: -1
  }

  private _hoverInstanceInfo: EventOverlayInfo = {
    paneId: '',
    instance: null,
    elementType: EventOverlayInfoElementType.NONE,
    elementIndex: -1
  }

  private _clickInstanceInfo: EventOverlayInfo = {
    paneId: '',
    instance: null,
    elementType: EventOverlayInfoElementType.NONE,
    elementIndex: -1
  }

  constructor (chartStore: ChartStore) {
    this._chartStore = chartStore
  }

  private _overrideInstance (instance: OverlayImp, overlay: Partial<OverlayCreate>): boolean {
    const {
      id, points, styles, lock, mode, extendData,
      onDrawStart, onDrawing,
      onDrawEnd, onClick,
      onRightClick, onPressedMove,
      onMouseEnter, onMouseLeave,
      onRemoved, onSelected, onDeselected
    } = overlay
    let updateFlag = false
    if (id !== undefined) {
      instance.setId(id)
    }
    if (points !== undefined && instance.setPoints(points)) {
      updateFlag = true
    }
    if (styles !== undefined && instance.setStyles(styles)) {
      updateFlag = true
    }
    if (lock !== undefined) {
      instance.setLock(lock)
    }
    if (mode !== undefined) {
      instance.setMode(mode)
    }
    if (extendData !== undefined && instance.setExtendData(extendData)) {
      updateFlag = true
    }
    if (onDrawStart !== undefined) {
      instance.setOnDrawStartCallback(onDrawStart)
    }
    if (onDrawing !== undefined) {
      instance.setOnDrawingCallback(onDrawing)
    }
    if (onDrawEnd !== undefined) {
      instance.setOnDrawEndCallback(onDrawEnd)
    }
    if (onClick !== undefined) {
      instance.setOnClickCallback(onClick)
    }
    if (onRightClick !== undefined) {
      instance.setOnRightClickCallback(onRightClick)
    }
    if (onPressedMove !== undefined) {
      instance.setOnPressedMoveCallback(onPressedMove)
    }
    if (onMouseEnter !== undefined) {
      instance.setOnMouseEnterCallback(onMouseEnter)
    }
    if (onMouseLeave !== undefined) {
      instance.setOnMouseLeaveCallback(onMouseLeave)
    }
    if (onRemoved !== undefined) {
      instance.setOnRemovedCallback(onRemoved)
    }
    if (onSelected !== undefined) {
      instance.setOnSelectedCallback(onSelected)
    }
    if (onDeselected !== undefined) {
      instance.setOnDeselectedCallback(onDeselected)
    }
    return updateFlag
  }

  /**
   * 获取实例
   * @param id
   * @returns
   */
  getInstanceById (id: string): TypeOrNull<OverlayImp> {
    for (const entry of this._instances) {
      const paneShapes = entry[1]
      const shape = paneShapes.find(s => s.id === id)
      if (shape !== undefined) {
        return shape
      }
    }
    if (this._progressInstanceInfo !== null) {
      if (this._progressInstanceInfo.instance.id === id) {
        return this._progressInstanceInfo.instance
      }
    }
    return null
  }

  /**
   * 添加标记实例
   * @param overlay
   * @param paneId
   */
  addInstance (overlay: OverlayCreate, paneId: string, appointPaneFlag: boolean): TypeOrNull<string> {
    const id = overlay.id ?? createId(OVERLAY_ID_PREFIX)
    if (this.getInstanceById(id) === null) {
      const OverlayClazz = getOverlayClass(overlay.name) as OverlayConstructor
      const instance = new OverlayClazz()
      overlay.id = id
      this._overrideInstance(instance, overlay)
      if (instance.isDrawing()) {
        this._progressInstanceInfo = { paneId, instance, appointPaneFlag }
      } else {
        if (!this._instances.has(paneId)) {
          this._instances.set(paneId, [])
        }
        this._instances.get(paneId)?.push(instance)
      }
      this._chartStore.getChart().updatePane(UpdateLevel.OVERLAY, paneId)
      return id
    }
    return null
  }

  /**
   * 获取进行中的实例
   * @returns
   */
  getProgressInstanceInfo (): TypeOrNull<ProgressOverlayInfo> {
    return this._progressInstanceInfo
  }

  /**
   * 进行中的实例完成
   */
  progressInstanceComplete (): void {
    if (this._progressInstanceInfo !== null) {
      const { instance, paneId } = this._progressInstanceInfo
      if (!instance.isDrawing()) {
        if (!this._instances.has(paneId)) {
          this._instances.set(paneId, [])
        }
        this._instances.get(paneId)?.push(instance)
        this._progressInstanceInfo = null
      }
    }
  }

  /**
   * 更新进行中的实例
   * @param paneId
   */
  updateProgressInstanceInfo (paneId: string, appointPaneFlag?: boolean): void {
    if (this._progressInstanceInfo !== null) {
      if (appointPaneFlag !== undefined && appointPaneFlag) {
        this._progressInstanceInfo.appointPaneFlag = appointPaneFlag
      }
      if (!this._progressInstanceInfo.appointPaneFlag) {
        this._progressInstanceInfo.paneId = paneId
      }
    }
  }

  /**
   * 获取图形标记的数据
   * @param paneId
   * @returns {{}}
   */
  getInstances (paneId?: string): OverlayImp[] {
    if (paneId === undefined) {
      let instances: OverlayImp[] = []
      this._instances.forEach(paneInstances => {
        instances = instances.concat(paneInstances)
      })
      return instances
    }
    return this._instances.get(paneId) ?? []
  }

  /**
   * 设置图形标记实例配置
   * @param overlay
   */
  override (overlay: Partial<OverlayCreate>): void {
    const { id, name } = overlay
    let updateFlag = false
    if (id !== undefined) {
      const instance = this.getInstanceById(id)
      if (instance !== null && this._overrideInstance(instance, overlay)) {
        updateFlag = true
      }
    } else {
      this._instances.forEach(paneInstances => {
        paneInstances.forEach(instance => {
          if ((name === undefined || instance.name === name) && this._overrideInstance(instance, overlay)) {
            updateFlag = true
          }
        })
      })
      if (this._progressInstanceInfo !== null) {
        if ((name === undefined || this._progressInstanceInfo.instance.name === name) && this._overrideInstance(this._progressInstanceInfo.instance, overlay)) {
          updateFlag = true
        }
      }
    }
    if (updateFlag) {
      this._chartStore.getChart().updatePane(UpdateLevel.OVERLAY)
    }
  }

  /**
   * 移除图形实例
   * @param id
   */
  removeInstance (id?: string): void {
    const updatePaneIds: string[] = []
    if (this._progressInstanceInfo !== null) {
      const instance = this._progressInstanceInfo.instance
      if ((id === undefined || instance.id === id)) {
        updatePaneIds.push(this._progressInstanceInfo.paneId)
        instance.onRemoved?.(instance)
        this._progressInstanceInfo = null
      }
    }
    if (id !== undefined) {
      for (const entry of this._instances) {
        const paneInstances = entry[1]
        const removeIndex = paneInstances.findIndex(instance => instance.id === id)
        if (removeIndex > -1) {
          updatePaneIds.push(entry[0])
          paneInstances[removeIndex].onRemoved?.(paneInstances[removeIndex])
          paneInstances.splice(removeIndex, 1)
          if (paneInstances.length === 0) {
            this._instances.delete(entry[0])
          }
          break
        }
      }
    } else {
      this._instances.forEach((paneInstances, paneId) => {
        updatePaneIds.push(paneId)
        paneInstances.forEach(instance => {
          instance.onRemoved?.(instance)
        })
      })
      this._instances.clear()
    }
    if (updatePaneIds.length > 0) {
      const update = this._chartStore.getChart().updatePane
      updatePaneIds.forEach(paneId => {
        update(UpdateLevel.OVERLAY, paneId)
      })
    }
  }

  setPressedInstanceInfo (info: EventOverlayInfo): void {
    this._pressedInstanceInfo = info
  }

  getPressedInstanceInfo (): EventOverlayInfo {
    return this._pressedInstanceInfo
  }

  setHoverInstanceInfo (info: EventOverlayInfo): void {
    const { instance, elementType, elementIndex } = this._hoverInstanceInfo
    if (
      instance?.id !== info.instance?.id ||
      elementType !== info.elementType ||
      elementIndex !== info.elementIndex
    ) {
      this._hoverInstanceInfo = info
      if (instance?.id !== info.instance?.id) {
        instance?.onMouseLeave?.(instance)
        info.instance?.onMouseEnter?.(info.instance)
      }
    }
  }

  getHoverInstanceInfo (): EventOverlayInfo {
    return this._hoverInstanceInfo
  }

  setClickInstanceInfo (info: EventOverlayInfo): void {
    const { paneId, instance, elementType, elementIndex } = this._clickInstanceInfo
    if (instance?.id !== info.instance?.id || elementType !== info.elementType || elementIndex !== info.elementIndex) {
      this._clickInstanceInfo = info
      if (info.instance?.isDrawing() ?? false) {
        info.instance?.onClick?.(info.instance)
      }
      if (instance?.id !== info.instance?.id) {
        instance?.onDeselected?.(instance)
        info.instance?.onSelected?.(info.instance)
        this._chartStore.getChart().updatePane(UpdateLevel.OVERLAY, info.paneId)
        if (paneId !== info.paneId) {
          this._chartStore.getChart().updatePane(UpdateLevel.OVERLAY, paneId)
        }
        this._chartStore.getChart().updatePane(UpdateLevel.OVERLAY, PaneIdConstants.XAXIS)
      }
    }
  }

  getClickInstanceInfo (): EventOverlayInfo {
    return this._clickInstanceInfo
  }

  /**
   * 是否为空
   * @returns
   */
  isEmpty (): boolean {
    return this._instances.size === 0 && this._progressInstanceInfo === null
  }

  /**
   * 是否正在绘制
   * @return
   */
  isDrawing (): boolean {
    return this._progressInstanceInfo !== null && (this._progressInstanceInfo?.instance.isDrawing() ?? false)
  }
}
