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

import type Nullable from '../common/Nullable'
import { UpdateLevel } from '../common/Updater'
import { type MouseTouchEvent } from '../common/SyntheticEvent'
import { isFunction, isValid, isString, isBoolean } from '../common/utils/typeChecks'
import { createId } from '../common/utils/id'
import { LoadDataType } from '../common/LoadDataCallback'

import type OverlayImp from '../component/Overlay'
import { type OverlayCreate, type OverlayRemove, OVERLAY_ID_PREFIX } from '../component/Overlay'

import { getOverlayInnerClass } from '../extension/overlay/index'

import type ChartStore from './ChartStore'

import { PaneIdConstants } from '../pane/types'

export interface ProgressOverlayInfo {
  paneId: string
  instance: OverlayImp
  appointPaneFlag: boolean
}

export const enum EventOverlayInfoFigureType {
  None, Point, Other
}

export interface EventOverlayInfo {
  paneId: string
  instance: Nullable<OverlayImp>
  figureType: EventOverlayInfoFigureType
  figureKey: string
  figureIndex: number
  attrsIndex: number
}

export default class OverlayStore {
  private readonly _chartStore: ChartStore

  private _instances = new Map<string, OverlayImp[]>()

  /**
   * Overlay information in painting
   */
  private _progressInstanceInfo: Nullable<ProgressOverlayInfo> = null

  /**
   * Overlay information by the mouse pressed
   */
  private _pressedInstanceInfo: EventOverlayInfo = {
    paneId: '',
    instance: null,
    figureType: EventOverlayInfoFigureType.None,
    figureKey: '',
    figureIndex: -1,
    attrsIndex: -1
  }

  /**
   * Overlay information by hover
   */
  private _hoverInstanceInfo: EventOverlayInfo = {
    paneId: '',
    instance: null,
    figureType: EventOverlayInfoFigureType.None,
    figureKey: '',
    figureIndex: -1,
    attrsIndex: -1
  }

  /**
   * Overlay information by the mouse click
   */
  private _clickInstanceInfo: EventOverlayInfo = {
    paneId: '',
    instance: null,
    figureType: EventOverlayInfoFigureType.None,
    figureKey: '',
    figureIndex: -1,
    attrsIndex: -1
  }

  constructor (chartStore: ChartStore) {
    this._chartStore = chartStore
  }

  getInstanceById (id: string): Nullable<OverlayImp> {
    for (const entry of this._instances) {
      const paneShapes = entry[1]
      const overlay = paneShapes.find(s => s.getOverlay().id === id)
      if (isValid(overlay)) {
        return overlay
      }
    }
    if (this._progressInstanceInfo !== null) {
      if (this._progressInstanceInfo.instance.getOverlay().id === id) {
        return this._progressInstanceInfo.instance
      }
    }
    return null
  }

  private _sort (paneId?: string): void {
    if (isString(paneId)) {
      this._instances.get(paneId)?.sort((o1, o2) => o1.getOverlay().zLevel - o2.getOverlay().zLevel)
    } else {
      this._instances.forEach(paneInstances => {
        paneInstances.sort((o1, o2) => o1.getOverlay().zLevel - o2.getOverlay().zLevel)
      })
    }
  }

  addInstances (overlays: OverlayCreate[], paneId: string, appointPaneFlag: boolean): Array<Nullable<string>> {
    const ids = overlays.map(overlay => {
      const id = overlay.id ?? createId(OVERLAY_ID_PREFIX)
      if (this.getInstanceById(id) === null) {
        const OverlayClazz = getOverlayInnerClass(overlay.name)
        if (OverlayClazz !== null) {
          const instance = new OverlayClazz()
          instance.override({ paneId })
          const groupId = overlay.groupId ?? id
          overlay.id = id
          overlay.paneId = paneId
          overlay.groupId = groupId
          instance.override(overlay)
          if (instance.isDrawing()) {
            this._progressInstanceInfo = { paneId, instance, appointPaneFlag }
          } else {
            if (!this._instances.has(paneId)) {
              this._instances.set(paneId, [])
            }
            this._instances.get(paneId)?.push(instance)
          }
          if (instance.isStart()) {
            const o = instance.getOverlay()
            o.onDrawStart?.(({ overlay: o }))
          }
          return id
        }
      }
      return null
    })
    if (ids.some(id => id !== null)) {
      this._sort()
      const chart = this._chartStore.getChart()
      chart.updatePane(UpdateLevel.Overlay, paneId)
      chart.updatePane(UpdateLevel.Overlay, PaneIdConstants.X_AXIS)
    }
    return ids
  }

  getProgressInstanceInfo (): Nullable<ProgressOverlayInfo> {
    return this._progressInstanceInfo
  }

  progressInstanceComplete (): void {
    if (this._progressInstanceInfo !== null) {
      const { instance, paneId } = this._progressInstanceInfo
      if (!instance.isDrawing()) {
        if (!this._instances.has(paneId)) {
          this._instances.set(paneId, [])
        }
        this._instances.get(paneId)?.push(instance)
        this._sort(paneId)
        this._progressInstanceInfo = null
      }
    }
  }

  updateProgressInstanceInfo (paneId: string, appointPaneFlag?: boolean): void {
    if (this._progressInstanceInfo !== null) {
      if (isBoolean(appointPaneFlag) && appointPaneFlag) {
        this._progressInstanceInfo.appointPaneFlag = appointPaneFlag
      }
      this._progressInstanceInfo.paneId = paneId
      this._progressInstanceInfo.instance.override({ paneId })
    }
  }

  getInstances (paneId?: string): OverlayImp[] {
    if (!isString(paneId)) {
      let instances: OverlayImp[] = []
      this._instances.forEach(paneInstances => {
        instances = instances.concat(paneInstances)
      })
      return instances
    }
    return this._instances.get(paneId) ?? []
  }

  override (overlay: Partial<OverlayCreate>): void {
    const { id, groupId, name } = overlay
    let updateFlag = false
    let sortFlag = false

    const setFlag: (instance: OverlayImp) => void = (instance: OverlayImp) => {
      instance.override(overlay)
      const { sort, draw } = instance.shouldUpdate()

      if (draw) {
        updateFlag = true
      }
      if (sort) {
        sortFlag = true
      }
    }

    if (isString(id)) {
      const instance = this.getInstanceById(id)
      if (instance !== null) {
        setFlag(instance)
      }
    } else {
      const nameValid = isString(name)
      const groupIdValid = isString(groupId)
      this._instances.forEach(paneInstances => {
        paneInstances.forEach(instance => {
          const o = instance.getOverlay()
          if (
            (nameValid && o.name === name) ||
            (groupIdValid && o.groupId === groupId) ||
            (!nameValid && !groupIdValid)
          ) {
            setFlag(instance)
          }
        })
      })
      if (this._progressInstanceInfo !== null) {
        const progressInstance = this._progressInstanceInfo.instance
        const o = progressInstance.getOverlay()
        if (
          (nameValid && o.name === name) ||
          (groupIdValid && o.groupId === groupId) ||
          (!nameValid && !groupIdValid)
        ) {
          setFlag(progressInstance)
        }
      }
    }
    if (sortFlag) {
      this._sort()
    }
    if (updateFlag) {
      this._chartStore.getChart().updatePane(UpdateLevel.Overlay)
    }
  }

  removeInstance (overlayRemove?: OverlayRemove): void {
    const match: ((remove: OverlayRemove, overlay: OverlayImp) => boolean) = (remove: OverlayRemove, overlay: OverlayImp) => {
      const o = overlay.getOverlay()
      if (isString(remove.id)) {
        if (o.id !== remove.id) {
          return false
        }
      } else {
        if (isString(remove.groupId)) {
          if (o.groupId !== remove.groupId) {
            return false
          }
        } else {
          if (isString(remove.name)) {
            if (o.name !== remove.name) {
              return false
            }
          }
        }
      }
      return true
    }

    const updatePaneIds: string[] = []
    const overlayRemoveValid = isValid(overlayRemove)
    if (this._progressInstanceInfo !== null) {
      const { instance } = this._progressInstanceInfo
      if (
        !overlayRemoveValid ||
        (overlayRemoveValid && match(overlayRemove, instance))
      ) {
        updatePaneIds.push(this._progressInstanceInfo.paneId)
        const o = instance.getOverlay()
        o.onRemoved?.({ overlay: o })
        this._progressInstanceInfo = null
      }
    }
    if (overlayRemoveValid) {
      const instances = new Map<string, OverlayImp[]>()
      for (const entry of this._instances) {
        const paneInstances = entry[1]
        const newPaneInstances = paneInstances.filter(instance => {
          if (match(overlayRemove, instance)) {
            if (!updatePaneIds.includes(entry[0])) {
              updatePaneIds.push(entry[0])
            }
            const o = instance.getOverlay()
            o.onRemoved?.({ overlay: o })
            return false
          }
          return true
        })
        if (newPaneInstances.length > 0) {
          instances.set(entry[0], newPaneInstances)
        }
      }
      this._instances = instances
    } else {
      this._instances.forEach((paneInstances, paneId) => {
        updatePaneIds.push(paneId)
        paneInstances.forEach(instance => {
          const o = instance.getOverlay()
          o.onRemoved?.({ overlay: o })
        })
      })
      this._instances.clear()
    }
    if (updatePaneIds.length > 0) {
      const chart = this._chartStore.getChart()
      updatePaneIds.forEach(paneId => {
        chart.updatePane(UpdateLevel.Overlay, paneId)
      })
      chart.updatePane(UpdateLevel.Overlay, PaneIdConstants.X_AXIS)
    }
  }

  setPressedInstanceInfo (info: EventOverlayInfo): void {
    this._pressedInstanceInfo = info
  }

  getPressedInstanceInfo (): EventOverlayInfo {
    return this._pressedInstanceInfo
  }

  updatePointPosition (dataChangeLength: number, type?: LoadDataType): void {
    if (dataChangeLength > 0) {
      const dataList = this._chartStore.getDataList()
      this._instances.forEach(overlays => {
        overlays.forEach(overlay => {
          const o = overlay.getOverlay()
          const points = o.points
          points.forEach(point => {
            if (!isValid(point.timestamp) && isValid(point.dataIndex)) {
              if (type === LoadDataType.Forward) {
                point.dataIndex = point.dataIndex + dataChangeLength
              }
              const data = dataList[point.dataIndex]
              point.timestamp = data?.timestamp
            }
          })
        })
      })
    }
  }

  setHoverInstanceInfo (info: EventOverlayInfo, event: MouseTouchEvent): void {
    const { instance, figureType, figureKey, figureIndex } = this._hoverInstanceInfo
    const overlay = instance?.getOverlay()
    const infoOverlay = info.instance?.getOverlay()
    if (
      overlay?.id !== infoOverlay?.id ||
      figureType !== info.figureType ||
      figureIndex !== info.figureIndex
    ) {
      this._hoverInstanceInfo = info
      if (overlay?.id !== infoOverlay?.id) {
        let ignoreUpdateFlag = false
        let sortFlag = false
        if (instance !== null) {
          sortFlag = true
          if (isFunction(overlay?.onMouseLeave)) {
            overlay?.onMouseLeave({ overlay, figureKey, figureIndex, ...event })
            ignoreUpdateFlag = true
          }
        }

        if (infoOverlay !== null) {
          sortFlag = true
          if (isFunction(infoOverlay?.onMouseEnter)) {
            infoOverlay?.onMouseEnter({ overlay: infoOverlay, figureKey: info.figureKey, figureIndex: info.figureIndex, ...event })
            ignoreUpdateFlag = true
          }
        }
        if (sortFlag) {
          this._sort()
        }
        if (!ignoreUpdateFlag) {
          this._chartStore.getChart().updatePane(UpdateLevel.Overlay)
        }
      }
    }
  }

  getHoverInstanceInfo (): EventOverlayInfo {
    return this._hoverInstanceInfo
  }

  setClickInstanceInfo (info: EventOverlayInfo, event: MouseTouchEvent): void {
    const { paneId, instance, figureType, figureKey, figureIndex } = this._clickInstanceInfo
    const overlay = instance?.getOverlay()
    const infoOverlay = info.instance?.getOverlay()
    if (!(info.instance?.isDrawing() ?? false)) {
      infoOverlay?.onClick?.({ overlay: infoOverlay, figureKey: info.figureKey, figureIndex: info.figureIndex, ...event })
    }
    if (overlay?.id !== infoOverlay?.id || figureType !== info.figureType || figureIndex !== info.figureIndex) {
      this._clickInstanceInfo = info
      if (overlay?.id !== infoOverlay?.id) {
        overlay?.onDeselected?.({ overlay, figureKey, figureIndex, ...event })
        infoOverlay?.onSelected?.({ overlay: infoOverlay, figureKey: info.figureKey, figureIndex: info.figureIndex, ...event })
        const chart = this._chartStore.getChart()
        chart.updatePane(UpdateLevel.Overlay, info.paneId)
        if (paneId !== info.paneId) {
          chart.updatePane(UpdateLevel.Overlay, paneId)
        }
        chart.updatePane(UpdateLevel.Overlay, PaneIdConstants.X_AXIS)
      }
    }
  }

  getClickInstanceInfo (): EventOverlayInfo {
    return this._clickInstanceInfo
  }

  isEmpty (): boolean {
    return this._instances.size === 0 && this._progressInstanceInfo === null
  }

  isDrawing (): boolean {
    return this._progressInstanceInfo !== null && (this._progressInstanceInfo?.instance.isDrawing() ?? false)
  }
}
