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
import { isValid, isString } from '../common/utils/typeChecks'

import type ChartStore from './ChartStore'

import { type IndicatorCreate, type Indicator } from '../component/Indicator'
import type IndicatorImp from '../component/Indicator'
import { IndicatorSeries } from '../component/Indicator'
import { getIndicatorClass } from '../extension/indicator/index'
import TaskScheduler, { generateTaskId } from '../common/TaskScheduler'

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

  private _addTask (paneId: string, indicator: IndicatorImp): void {
    this._scheduler.addTask({
      id: generateTaskId(paneId, indicator.name),
      handler: () => {
        indicator.calcImp(this._chartStore.getDataList()).then(result => {
          if (result) {
            this._chartStore.getChart().adjustPaneViewport(false, true, true, true)
          }
        }).catch(() => {})
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
      this.removeInstance(paneId)
      paneInstances = []
    }
    paneInstances.push(instance)
    this._instances.set(paneId, paneInstances)
    this._sort(paneId)
    this._addTask(paneId, instance)
    return true
  }

  getInstances (paneId: string): IndicatorImp[] {
    return this._instances.get(paneId) ?? []
  }

  removeInstance (paneId: string, name?: string): boolean {
    let removed = false
    const paneInstances = this._instances.get(paneId)
    if (isValid(paneInstances)) {
      if (isString(name)) {
        const index = paneInstances.findIndex(ins => ins.name === name)
        if (index > -1) {
          this._scheduler.removeTask(generateTaskId(paneId, name))
          paneInstances.splice(index, 1)
          removed = true
        }
      } else {
        paneInstances.forEach(instance => {
          this._scheduler.removeTask(generateTaskId(paneId, instance.name))
        })
        this._instances.set(paneId, [])
        removed = true
      }
      if (this._instances.get(paneId)?.length === 0) {
        this._instances.delete(paneId)
      }
    }
    return removed
  }

  hasInstances (paneId: string): boolean {
    return this._instances.has(paneId)
  }

  calcInstance (name?: string, paneId?: string): void {
    if (isString(name)) {
      if (isString(paneId)) {
        const paneInstances = this._instances.get(paneId)
        if (isValid(paneInstances)) {
          const instance = paneInstances.find(ins => ins.name === name)
          if (isValid(instance)) {
            this._addTask(paneId, instance)
          }
        }
      } else {
        this._instances.forEach((paneInstances, paneId) => {
          const instance = paneInstances.find(ins => ins.name === name)
          if (isValid(instance)) {
            this._addTask(paneId, instance)
          }
        })
      }
    } else {
      this._instances.forEach((paneInstances, paneId) => {
        paneInstances.forEach(instance => {
          this._addTask(paneId, instance)
        })
      })
    }
  }

  getInstanceByPaneId (paneId?: string, name?: string): Nullable<Indicator> | Nullable<Map<string, Indicator>> | Map<string, Map<string, Indicator>> {
    const createMapping: ((instances: IndicatorImp[]) => Map<string, Indicator>) = (instances: IndicatorImp[]) => {
      const mapping = new Map<string, Indicator>()
      instances.forEach(ins => {
        mapping.set(ins.name, ins)
      })
      return mapping
    }

    if (isString(paneId)) {
      const paneInstances = this._instances.get(paneId) ?? []
      if (isString(name)) {
        return paneInstances?.find(ins => ins.name === name) ?? null
      }
      return createMapping(paneInstances)
    }
    const mapping = new Map<string, Map<string, Indicator>>()
    this._instances.forEach((instances, paneId) => {
      mapping.set(paneId, createMapping(instances))
    })
    return mapping
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

  override (indicator: IndicatorCreate, paneId: Nullable<string>): boolean {
    const { name } = indicator
    let instances = new Map<string, IndicatorImp[]>()
    if (paneId !== null) {
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
          this._addTask(paneId, instance)
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
