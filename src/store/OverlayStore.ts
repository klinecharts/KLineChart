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
import type { MouseTouchEvent } from '../common/SyntheticEvent'
import { isFunction, isValid, isString, isBoolean } from '../common/utils/typeChecks'
import { createId } from '../common/utils/id'
import { LoadDataType } from '../common/LoadDataCallback'

import type OverlayImp from '../component/Overlay'
import { type OverlayCreate, OVERLAY_ID_PREFIX, type OverlayFilter } from '../component/Overlay'

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

  private readonly _instances = new Map<string, OverlayImp[]>()

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

  getInstanceByFilter (filter: OverlayFilter): Map<string, OverlayImp[]> {
    const { id, groupId, paneId, name } = filter
    const find: ((overlays: OverlayImp[]) => OverlayImp[]) = (overlays) => {
      return overlays.filter(overlay => {
        if (isValid(id)) {
          return overlay.id === id
        } else {
          if (isValid(groupId)) {
            return overlay.groupId === groupId && (!isValid(name) || overlay.name === name)
          }
        }
        return !isValid(name) || overlay.name === name
      })
    }

    const map = new Map<string, OverlayImp[]>()
    if (isValid(paneId)) {
      const overlays = this.getInstanceByPaneId(paneId)
      map.set(paneId, find(overlays))
    } else {
      this._instances.forEach((overlays, paneId) => {
        map.set(paneId, find(overlays))
      })
    }
    const progressOverlay = this._progressInstanceInfo?.instance
    if (isValid(progressOverlay)) {
      const paneOverlays = map.get(progressOverlay.paneId) ?? []
      paneOverlays.push(progressOverlay)
      map.set(progressOverlay.paneId, paneOverlays)
    }
    return map
  }

  getInstanceByPaneId (paneId?: string): OverlayImp[] {
    if (!isString(paneId)) {
      let overlays: OverlayImp[] = []
      this._instances.forEach(paneOverlays => {
        overlays = overlays.concat(paneOverlays)
      })
      return overlays
    }
    return this._instances.get(paneId) ?? []
  }

  private _sort (paneId?: string): void {
    if (isString(paneId)) {
      this._instances.get(paneId)?.sort((o1, o2) => o1.zLevel - o2.zLevel)
    } else {
      this._instances.forEach(paneInstances => {
        paneInstances.sort((o1, o2) => o1.zLevel - o2.zLevel)
      })
    }
  }

  addInstances (overlays: OverlayCreate[], appointPaneFlags: boolean[]): Array<Nullable<string>> {
    const updatePaneIds: string[] = []
    const ids = overlays.map((overlay, index) => {
      if (isValid(overlay.id)) {
        let findOverlay: Nullable<OverlayImp> = null
        for (const [, overlays] of this._instances) {
          const overlay = overlays.find(o => o.id === overlay.id)
          if (isValid(overlay)) {
            findOverlay = overlay
            break
          }
        }
        if (isValid(findOverlay)) {
          return overlay.id
        }
      }
      const OverlayClazz = getOverlayInnerClass(overlay.name)
      if (isValid(OverlayClazz)) {
        const id = overlay.id ?? createId(OVERLAY_ID_PREFIX)
        const instance = new OverlayClazz()
        const groupId = overlay.groupId ?? id
        overlay.id = id
        overlay.groupId = groupId
        instance.override(overlay)
        const paneId = instance.paneId
        if (!updatePaneIds.includes(paneId)) {
          updatePaneIds.push(paneId)
        }
        if (instance.isDrawing()) {
          this._progressInstanceInfo = { paneId, instance, appointPaneFlag: appointPaneFlags[index] }
        } else {
          if (!this._instances.has(paneId)) {
            this._instances.set(paneId, [])
          }
          this._instances.get(paneId)?.push(instance)
        }
        if (instance.isStart()) {
          instance.onDrawStart?.(({ overlay: instance }))
        }
        return id
      }
      return null
    })
    if (updatePaneIds.length > 0) {
      this._sort()
      const chart = this._chartStore.getChart()
      updatePaneIds.forEach(paneId => {
        chart.updatePane(UpdateLevel.Overlay, paneId)
      })
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

  override (overlay: Partial<OverlayCreate>): void {
    let sortFlag = false

    const updatePaneIds: string[] = []
    const filterMap = this.getInstanceByFilter(overlay)
    filterMap.forEach((instances, paneId) => {
      instances.forEach(instance => {
        instance.override(overlay)
        const { sort, draw } = instance.shouldUpdate()
        if (sort) {
          sortFlag = true
        }
        if (sort || draw) {
          if (!updatePaneIds.includes(paneId)) {
            updatePaneIds.push(paneId)
          }
        }
      })
    })

    if (sortFlag) {
      this._sort()
    }
    if (updatePaneIds.length > 0) {
      const chart = this._chartStore.getChart()
      updatePaneIds.forEach(paneId => {
        chart.updatePane(UpdateLevel.Overlay, paneId)
      })
      chart.updatePane(UpdateLevel.Overlay, PaneIdConstants.X_AXIS)
    }
  }

  removeInstance (filter: OverlayFilter): void {
    const updatePaneIds: string[] = []
    const filterMap = this.getInstanceByFilter(filter)
    filterMap.forEach((overlays, paneId) => {
      const paneOverlays = this.getInstanceByPaneId(paneId)
      overlays.forEach(overlay => {
        overlay.onRemoved?.({ overlay })
        if (!updatePaneIds.includes(paneId)) {
          updatePaneIds.push(paneId)
        }
        if (overlay.isDrawing()) {
          this._progressInstanceInfo = null
        } else {
          const index = paneOverlays.findIndex(o => o.id === overlay.id)
          if (index > -1) {
            paneOverlays.splice(index, 1)
          }
        }
        if (paneOverlays.length === 0) {
          this._instances.delete(paneId)
        }
      })
    })
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
          const points = overlay.points
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
    const infoInstance = info.instance
    if (
      instance?.id !== infoInstance?.id ||
      figureType !== info.figureType ||
      figureIndex !== info.figureIndex
    ) {
      this._hoverInstanceInfo = info
      if (instance?.id !== infoInstance?.id) {
        let ignoreUpdateFlag = false
        let sortFlag = false
        if (instance !== null) {
          sortFlag = true
          if (isFunction(instance?.onMouseLeave)) {
            instance?.onMouseLeave({ overlay: instance, figureKey, figureIndex, ...event })
            ignoreUpdateFlag = true
          }
        }

        if (infoInstance !== null) {
          sortFlag = true
          if (isFunction(infoInstance?.onMouseEnter)) {
            infoInstance?.onMouseEnter({ overlay: infoInstance, figureKey: info.figureKey, figureIndex: info.figureIndex, ...event })
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
    const infoInstance = info.instance
    if (!(info.instance?.isDrawing() ?? false)) {
      infoInstance?.onClick?.({ overlay: infoInstance, figureKey: info.figureKey, figureIndex: info.figureIndex, ...event })
    }
    if (instance?.id !== infoInstance?.id || figureType !== info.figureType || figureIndex !== info.figureIndex) {
      this._clickInstanceInfo = info
      if (instance?.id !== infoInstance?.id) {
        instance?.onDeselected?.({ overlay: instance, figureKey, figureIndex, ...event })
        infoInstance?.onSelected?.({ overlay: infoInstance, figureKey: info.figureKey, figureIndex: info.figureIndex, ...event })
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
