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
import { isValid, isString, isArray, isNumber, isBoolean, isFunction } from '../common/utils/typeChecks'

import type ChartStore from './ChartStore'

import { type IndicatorCreate, type Indicator } from '../component/Indicator'
import type IndicatorImp from '../component/Indicator'
import { IndicatorSeries } from '../component/Indicator'
import { getIndicatorClass } from '../extension/indicator/index'

export default class IndicatorStore {
  private readonly _chartStore: ChartStore
  private readonly _instances = new Map<string, IndicatorImp[]>()

  constructor (chartStore: ChartStore) {
    this._chartStore = chartStore
  }

  private _overrideInstance (instance: IndicatorImp, indicator: Partial<Indicator>): [boolean, boolean, boolean] {
    const {
      shortName, series, calcParams, precision, figures, minValue, maxValue,
      shouldOhlc, shouldFormatBigNumber, visible, zLevel, styles, extendData,
      regenerateFigures, createTooltipDataSource, draw, calc
    } = indicator
    let updateFlag = false
    if (isString(shortName) && instance.setShortName(shortName)) {
      updateFlag = true
    }
    if (isValid(series) && instance.setSeries(series)) {
      updateFlag = true
    }
    let calcFlag = false
    if (isArray(calcParams) && instance.setCalcParams(calcParams)) {
      updateFlag = true
      calcFlag = true
    }
    if (isArray(figures) && instance.setFigures(figures)) {
      updateFlag = true
      calcFlag = true
    }
    if (minValue !== undefined && instance.setMinValue(minValue)) {
      updateFlag = true
    }
    if (maxValue !== undefined && instance.setMinValue(maxValue)) {
      updateFlag = true
    }
    if (isNumber(precision) && instance.setPrecision(precision)) {
      updateFlag = true
    }
    if (isBoolean(shouldOhlc) && instance.setShouldOhlc(shouldOhlc)) {
      updateFlag = true
    }
    if (isBoolean(shouldFormatBigNumber) && instance.setShouldFormatBigNumber(shouldFormatBigNumber)) {
      updateFlag = true
    }
    if (isBoolean(visible) && instance.setVisible(visible)) {
      updateFlag = true
    }
    let sortFlag = false
    if (isNumber(zLevel) && instance.setZLevel(zLevel)) {
      updateFlag = true
      sortFlag = true
    }
    if (isValid(styles) && instance.setStyles(styles)) {
      updateFlag = true
    }
    if (extendData !== undefined && instance.setExtendData(extendData)) {
      updateFlag = true
      calcFlag = true
    }
    if (regenerateFigures !== undefined && instance.setRegenerateFigures(regenerateFigures)) {
      updateFlag = true
    }
    if (createTooltipDataSource !== undefined && instance.setCreateTooltipDataSource(createTooltipDataSource)) {
      updateFlag = true
    }
    if (draw !== undefined && instance.setDraw(draw)) {
      updateFlag = true
    }
    if (isFunction(calc)) {
      instance.calc = calc
      calcFlag = true
    }
    return [updateFlag, calcFlag, sortFlag]
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

  async addInstance (indicator: IndicatorCreate, paneId: string, isStack: boolean): Promise<boolean> {
    const { name } = indicator
    let paneInstances = this._instances.get(paneId)
    if (isValid(paneInstances)) {
      const instance = paneInstances.find(ins => ins.name === name)
      if (isValid(instance)) {
        return await Promise.reject(new Error('Duplicate indicators.'))
      }
    }
    if (!isValid(paneInstances)) {
      paneInstances = []
    }
    const IndicatorClazz = getIndicatorClass(name)!
    const instance = new IndicatorClazz()

    this.synchronizeSeriesPrecision(instance)
    this._overrideInstance(instance, indicator)
    if (!isStack) {
      paneInstances = []
    }
    paneInstances.push(instance)
    this._instances.set(paneId, paneInstances)
    this._sort(paneId)
    return await instance.calcIndicator(this._chartStore.getDataList())
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
          paneInstances.splice(index, 1)
          removed = true
        }
      } else {
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

  async calcInstance (name?: string, paneId?: string): Promise<boolean> {
    const tasks: Array<Promise<boolean>> = []
    if (isString(name)) {
      if (isString(paneId)) {
        const paneInstances = this._instances.get(paneId)
        if (isValid(paneInstances)) {
          const instance = paneInstances.find(ins => ins.name === name)
          if (isValid(instance)) {
            tasks.push(instance.calcIndicator(this._chartStore.getDataList()))
          }
        }
      } else {
        this._instances.forEach(paneInstances => {
          const instance = paneInstances.find(ins => ins.name === name)
          if (isValid(instance)) {
            tasks.push(instance.calcIndicator(this._chartStore.getDataList()))
          }
        })
      }
    } else {
      this._instances.forEach(paneInstances => {
        paneInstances.forEach(instance => {
          tasks.push(instance.calcIndicator(this._chartStore.getDataList()))
        })
      })
    }
    const result = await Promise.all(tasks)
    return result.includes(true)
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
          instance.setPrecision(pricePrecision, true)
          break
        }
        case IndicatorSeries.Volume: {
          instance.setPrecision(volumePrecision, true)
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

  async override (indicator: IndicatorCreate, paneId: Nullable<string>): Promise<[boolean, boolean]> {
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
    let onlyUpdateFlag = false
    const tasks: Array<Promise<boolean>> = []
    let sortFlag = false
    instances.forEach(paneInstances => {
      const instance = paneInstances.find(ins => ins.name === name)
      if (isValid(instance)) {
        const overrideResult = this._overrideInstance(instance, indicator)
        if (overrideResult[2]) {
          sortFlag = true
        }
        if (overrideResult[1]) {
          tasks.push(instance.calcIndicator(this._chartStore.getDataList()))
        } else {
          if (overrideResult[0]) {
            onlyUpdateFlag = true
          }
        }
      }
    })
    if (sortFlag) {
      this._sort()
    }
    const result = await Promise.all(tasks)
    return [onlyUpdateFlag, result.includes(true)]
  }
}
