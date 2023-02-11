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

import Nullable from '../common/Nullable'
import Precision from '../common/Precision'

import ChartStore from './ChartStore'

import IndicatorImp, { IndicatorCreate, IndicatorConstructor, Indicator, IndicatorSeries } from '../component/Indicator'
import { getIndicatorClass } from '../extension/indicator/index'

export default class IndicatorStore {
  private readonly _chartStore: ChartStore
  private readonly _instances: Map<string, Map<string, IndicatorImp>> = new Map()

  constructor (chartStore: ChartStore) {
    this._chartStore = chartStore
  }

  private _overrideInstance (instance: IndicatorImp, indicator: Partial<Indicator>): boolean[] {
    const {
      shortName, series, calcParams, precision, figures, minValue, maxValue,
      shouldOhlc, shouldFormatBigNumber, visible, styles, extendData,
      regenerateFigures, createTooltipDataSource, draw, calc
    } = indicator
    let updateFlag = false
    if (shortName !== undefined && instance.setShortName(shortName)) {
      updateFlag = true
    }
    if (series !== undefined && instance.setSeries(series)) {
      updateFlag = true
    }
    let calcFlag = false
    if (calcParams !== undefined && instance.setCalcParams(calcParams)) {
      updateFlag = true
      calcFlag = true
    }
    if (figures !== undefined && instance.setFigures(figures)) {
      updateFlag = true
      calcFlag = true
    }
    if (minValue !== undefined && instance.setMinValue(minValue)) {
      updateFlag = true
    }
    if (maxValue !== undefined && instance.setMinValue(maxValue)) {
      updateFlag = true
    }
    if (precision !== undefined && instance.setPrecision(precision)) {
      updateFlag = true
    }
    if (shouldOhlc !== undefined && instance.setShouldOhlc(shouldOhlc)) {
      updateFlag = true
    }
    if (shouldFormatBigNumber !== undefined && instance.setShouldFormatBigNumber(shouldFormatBigNumber)) {
      updateFlag = true
    }
    if (visible !== undefined && instance.setVisible(visible)) {
      updateFlag = true
    }
    if (styles !== undefined && instance.setStyles(styles)) {
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
    if (calc !== undefined) {
      instance.calc = calc
      calcFlag = true
    }
    return [updateFlag, calcFlag]
  }

  async addInstance (indicator: IndicatorCreate, paneId: string, isStack: boolean): Promise<boolean> {
    const { name } = indicator
    let paneInstances = this._instances.get(paneId)
    if (paneInstances?.has(name) ?? false) {
      return await Promise.reject(new Error('Duplicate indicators.'))
    }
    if (paneInstances === undefined) {
      paneInstances = new Map()
      this._instances.set(paneId, paneInstances)
    }
    const IndicatorClazz = getIndicatorClass(name) as IndicatorConstructor
    const instance = new IndicatorClazz()
    this._overrideInstance(instance, indicator)
    if (!isStack) {
      paneInstances.clear()
    }
    paneInstances.set(name, instance)
    return await instance.calcIndicator(this._chartStore.getDataList())
  }

  getInstances (paneId: string): Map<string, IndicatorImp> {
    return this._instances.get(paneId) ?? new Map()
  }

  removeInstance (paneId: string, name?: string): boolean {
    let removed = false
    const paneInstances = this._instances.get(paneId)
    if (paneInstances !== undefined) {
      if (name !== undefined) {
        if (paneInstances.has(name)) {
          paneInstances.delete(name)
          removed = true
        }
      } else {
        paneInstances.clear()
        removed = true
      }
      if (paneInstances.size === 0) {
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
    if (name !== undefined) {
      if (paneId !== undefined) {
        const paneInstances = this._instances.get(paneId)
        if (paneInstances?.has(name) ?? false) {
          const instance = paneInstances?.get(name) as IndicatorImp
          tasks.push(instance.calcIndicator(this._chartStore.getDataList()))
        }
      } else {
        this._instances.forEach(paneInstances => {
          if (paneInstances.has(name)) {
            const instance = paneInstances?.get(name) as IndicatorImp
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
    if (paneId !== undefined) {
      const paneInstances = this._instances.get(paneId)
      if (name !== undefined) {
        return paneInstances?.get(name) ?? null
      }
      return paneInstances ?? null
    }
    return this._instances
  }

  setSeriesPrecision (precision: Precision): void {
    this._instances.forEach(paneInstances => {
      paneInstances.forEach(instance => {
        if (instance.series === IndicatorSeries.Price) {
          instance.setPrecision(precision.price, true)
        }
        if (instance.series === IndicatorSeries.Volume) {
          instance.setPrecision(precision.volume, true)
        }
      })
    })
  }

  async override (indicator: IndicatorCreate, paneId: Nullable<string>): Promise<[boolean, boolean]> {
    const { name } = indicator
    let instances: Map<string, Map<string, IndicatorImp>> = new Map()
    if (paneId !== null) {
      const paneInstances = this._instances.get(paneId)
      if (paneInstances !== undefined) {
        instances.set(paneId, paneInstances)
      }
    } else {
      instances = this._instances
    }
    let onlyUpdateFlag = false
    const tasks: Array<Promise<boolean>> = []
    instances.forEach(paneInstances => {
      const instance = paneInstances.get(name)
      if (instance !== undefined) {
        const overrideResult = this._overrideInstance(instance, indicator)
        if (overrideResult[1]) {
          tasks.push(instance.calcIndicator(this._chartStore.getDataList()))
        } else {
          if (overrideResult[0]) {
            onlyUpdateFlag = true
          }
        }
      }
    })
    const result = await Promise.all(tasks)
    return [onlyUpdateFlag, result.includes(true)]
  }
}
