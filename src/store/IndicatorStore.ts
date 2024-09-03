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

import { isValid, isString } from '../common/utils/typeChecks'

import type ChartStore from './ChartStore'

import { IndicatorDataStatus, type IndicatorCreate, type IndicatorFilter } from '../component/Indicator'
import type IndicatorImp from '../component/Indicator'
import { IndicatorSeries } from '../component/Indicator'
import { getIndicatorClass } from '../extension/indicator/index'
import TaskScheduler, { generateTaskId } from '../common/TaskScheduler'
import { LoadDataType } from '../common/LoadDataCallback'

export default class IndicatorStore {
  private readonly _chartStore: ChartStore
  private readonly _instances = new Map<string, IndicatorImp[]>()

  private readonly _scheduler = new TaskScheduler()

  constructor (chartStore: ChartStore) {
    this._chartStore = chartStore
  }

  private _sort (paneId?: string): void {
    if (isString(paneId)) {
      this._instances.get(paneId)?.sort((i1, i2) => i1.zLevel - i2.zLevel)
    } else {
      this._instances.forEach(paneInstances => {
        paneInstances.sort((i1, i2) => i1.zLevel - i2.zLevel)
      })
    }
  }

  private _addTask (paneId: string, indicator: IndicatorImp, loadDataType: LoadDataType): void {
    this._scheduler.addTask({
      id: generateTaskId(paneId, indicator.name),
      handler: () => {
        indicator.onDataStatusChange?.({
          status: IndicatorDataStatus.Loading,
          type: loadDataType,
          indicator
        })
        indicator.calcImp(this._chartStore.getDataList()).then(result => {
          if (result) {
            this._chartStore.getChart().adjustPaneViewport(false, true, true, true)
            indicator.onDataStatusChange?.({
              status: IndicatorDataStatus.Ready,
              type: loadDataType,
              indicator
            })
          }
        }).catch(() => {
          indicator.onDataStatusChange?.({
            status: IndicatorDataStatus.Error,
            type: loadDataType,
            indicator
          })
        })
      }
    })
  }

  addInstance (indicator: IndicatorCreate, paneId: string, isStack: boolean): boolean {
    const { name } = indicator
    let paneInstances = this._instances.get(paneId)
    if (isValid(paneInstances)) {
      const instance = paneInstances.find(ins => ins.name === name)
      if (isValid(instance)) {
        return false
      }
    }
    if (!isValid(paneInstances)) {
      paneInstances = []
    }
    const IndicatorClazz = getIndicatorClass(name)!
    const instance = new IndicatorClazz()

    this.synchronizeSeriesPrecision(instance)
    instance.override(indicator)
    if (!isStack) {
      this.removeInstance({ paneId })
      paneInstances = []
    }
    paneInstances.push(instance)
    this._instances.set(paneId, paneInstances)
    this._sort(paneId)
    this._addTask(paneId, instance, LoadDataType.Init)
    return true
  }

  getInstanceByPaneId (paneId: string): IndicatorImp[] {
    return this._instances.get(paneId) ?? []
  }

  getInstanceByFilter (filter: IndicatorFilter): Map<string, IndicatorImp[]> {
    const find: ((indicators: IndicatorImp[], name?: string) => IndicatorImp[]) = (indicators, name) => {
      return indicators.filter(indicator => {
        return !isValid(name) || indicator.name === name
      })
    }
    const { paneId, name } = filter
    const map = new Map<string, IndicatorImp[]>()
    if (isValid(paneId)) {
      const indicators = this.getInstanceByPaneId(paneId)
      map.set(paneId, find(indicators, name))
    } else {
      if (isValid(name)) {
        const map = new Map<string, IndicatorImp[]>()
        this._instances.forEach((indicators, paneId) => {
          map.set(paneId, find(indicators, name))
        })
      } else {
        this._instances.forEach((indicators, paneId) => {
          map.set(paneId, find(indicators))
        })
      }
    }
    return map
  }

  removeInstance (filter: IndicatorFilter): boolean {
    let removed = false
    const filterMap = this.getInstanceByFilter(filter)
    filterMap.forEach((indicators, paneId) => {
      const paneInstances = this.getInstanceByPaneId(paneId)
      indicators.forEach(indicator => {
        const index = paneInstances.findIndex(ins => ins.name === indicator.name)
        if (index > -1) {
          this._scheduler.removeTask(generateTaskId(paneId, indicator.name))
          paneInstances.splice(index, 1)
          removed = true
        }
      })
      if (paneInstances.length === 0) {
        this._instances.delete(paneId)
      }
    })
    return removed
  }

  hasInstances (paneId: string): boolean {
    return this._instances.has(paneId)
  }

  calcInstance (loadDataType: LoadDataType, filter: IndicatorFilter): void {
    const filterMap = this.getInstanceByFilter(filter)
    filterMap.forEach((indicators, paneId) => {
      indicators.forEach(indicator => {
        this._addTask(paneId, indicator, loadDataType)
      })
    })
  }

  synchronizeSeriesPrecision (indicator?: IndicatorImp): void {
    const { price: pricePrecision, volume: volumePrecision } = this._chartStore.getPrecision()
    const synchronize: ((instance: IndicatorImp) => void) = instance => {
      switch (instance.series) {
        case IndicatorSeries.Price: {
          instance.setSeriesPrecision(pricePrecision)
          break
        }
        case IndicatorSeries.Volume: {
          instance.setSeriesPrecision(volumePrecision)
          break
        }
        default: { break }
      }
    }

    if (isValid(indicator)) {
      synchronize(indicator)
    } else {
      this._instances.forEach(paneInstances => {
        paneInstances.forEach(instance => {
          synchronize(instance)
        })
      })
    }
  }

  override (indicator: IndicatorCreate): boolean {
    const { name, paneId } = indicator
    let instances = new Map<string, IndicatorImp[]>()
    if (isValid(paneId)) {
      const paneInstances = this._instances.get(paneId)
      if (isValid(paneInstances)) {
        instances.set(paneId, paneInstances)
      }
    } else {
      instances = this._instances
    }
    let updateFlag = false
    let sortFlag = false
    instances.forEach((paneInstances, paneId) => {
      const instance = paneInstances.find(ins => ins.name === name)
      if (isValid(instance)) {
        instance.override(indicator)
        const { calc, draw, sort } = instance.shouldUpdateImp()
        if (sort) {
          sortFlag = true
        }
        if (calc) {
          this._addTask(paneId, instance, LoadDataType.Update)
        } else {
          if (draw) {
            updateFlag = true
          }
        }
      }
    })
    if (sortFlag) {
      this._sort()
    }
    return updateFlag
  }
}
